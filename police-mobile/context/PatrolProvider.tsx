/* eslint-disable @typescript-eslint/no-unused-vars */
import { Fragment, ReactNode, createContext, useEffect, useRef, useState } from 'react';
import {
  requestForegroundPermissionsAsync,
  LocationOptions,
  LocationAccuracy,
  watchPositionAsync,
} from 'expo-location';
import useWork from '../hooks/useWork';
import useAuth from '../hooks/useAuth';
import { useBluetoothLE } from '../hooks/useBle';
import MapView, { PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { Dimensions, View } from 'react-native';
import { AgentsPosition } from '../types/agents-position.interface';
import { PositionMarker } from '../components/PositionMarker';
import { DevicesModal } from '../components/DevicesModal';

const PatrolContext = createContext({
  position: [] as number[],
  isChasing: false,
  isSupporting: false,
  occurrenceId: '',
  chaserPosition: {},
  toggleChase: () => {},
  toggleSupporting: () => {},
  setSupportPosition: (position: any) => {},
  setChaserPosition: (position: any) => {},
  setOccurrenceId: (occurrenceId: string) => {},
  setSquadPosition: (position: any) => {},
  setChaserRoute: (route: any) => {},
  setDirection: (route: any) => {},
});

interface PatrolProviderProps {
  children?: ReactNode;
}

export const PatrolProvider = ({ children }: PatrolProviderProps) => {
  const { socket } = useWork();
  const { auth } = useAuth();
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    location,
    setLocation,
    sendDataToDevice,
    ip,
  } = useBluetoothLE();
  const [devicesModal, setDevicesModal] = useState<boolean>(false);
  const [isChasing, setIsChasing] = useState<boolean>(false);
  const [isSupporting, setIsSupporting] = useState<boolean>(false);
  const [chaserRoute, setChaserRoute] = useState([]);
  const [direction, setDirection] = useState<any>([]);
  const [occurrenceId, setOccurrenceId] = useState<string>('');

  // Possible markers
  const [supportPosition, setSupportPosition] = useState<AgentsPosition>({});
  const [chaserPosition, setChaserPosition] = useState<AgentsPosition>({});
  const [squadPosition, setSquadPosition] = useState<AgentsPosition>({});
  const [position, setPosition] = useState([0, 0]);

  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (auth.module) {
      setDevicesModal(true);
      scanForDevices();
      watchPosition();
    } else {
      watchPosition();
    }

    // if (isChasing) {
    //   helperRoute();
    // }
  }, []);

  useEffect(() => {
    setLocation(position);
  }, [location, position]);

  useEffect(() => {
    animateCamera();
  }, [auth.module ? location : position]);

  useEffect(() => {
    socket.emit('police:position', auth.module ? location : position);
  }, [socket, auth.module ? location : position]);

  useEffect(() => {
    if (ip) {
      socket.emit('operator:ip', ip);
    }
  }, [ip]);

  const animateCamera = () => {
    if (isSupporting) {
      mapRef.current?.fitToSuppliedMarkers([...Object.keys(chaserPosition), socket.id], {
        edgePadding: {
          top: 300,
          right: 50,
          bottom: 225,
          left: 50,
        },
      });
    } else {
      mapRef.current?.animateCamera({
        center: {
          latitude: auth.module ? location[0] : position[0],
          longitude: auth.module ? location[1] : position[1],
        },
      });
    }
  };

  const watchPosition = async () => {
    const { granted } = await requestForegroundPermissionsAsync();

    const locationOptions: LocationOptions = {
      accuracy: LocationAccuracy.BestForNavigation,
      timeInterval: 500,
      distanceInterval: 0.1,
    };

    if (granted) {
      watchPositionAsync(locationOptions, (currentPosition) => {
        const { latitude, longitude } = currentPosition.coords;
        setPosition([latitude, longitude]);
      });
    }
  };

  const scanForDevices = async () => {
    const isPermissionEnabled = await requestPermissions();
    if (isPermissionEnabled) {
      scanForPeripherals();
    }
  };

  // const helperRoute = () => {
  //   const positions = [
  //     [-23.660977848590143, -46.79998310234614],
  //     [-23.66090828235633, -46.799993811375174],
  //   ];

  //   for (const position of positions) {
  //     setTimeout(() => {
  //       setPosition(position);
  //     }, 1000);
  //   }
  // };

  const cleanUp = () => {
    setChaserPosition({});
    setSupportPosition({});
    setDirection([]);
    setChaserRoute([]);
  };

  const toggleChase = () => {
    cleanUp();
    setIsChasing(!isChasing);
  };

  const toggleSupporting = () => {
    cleanUp();
    setIsSupporting(!isSupporting);
  };

  return (
    <PatrolContext.Provider
      value={{
        position: auth.module ? location : position,
        toggleSupporting,
        toggleChase,
        isChasing,
        isSupporting,
        chaserPosition,
        setChaserPosition,
        setChaserRoute,
        setDirection,
        setSquadPosition,
        setSupportPosition,
        setOccurrenceId,
        occurrenceId,
      }}
    >
      <View>
        {children}
        <DevicesModal
          sendDataToDevice={sendDataToDevice}
          isOpen={devicesModal}
          devices={allDevices}
          connectToDevice={connectToDevice}
          setIsOpen={setDevicesModal}
        />
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={{
            width: Dimensions.get('window').width,
            height: '100%',
          }}
          initialRegion={{
            latitude: auth.module ? location[0] : position[0],
            longitude: auth.module ? location[1] : position[1],
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        >
          <PositionMarker
            position={auth.module ? location : position}
            isChasing={isChasing}
            id={socket.id}
          />
          {Object.keys(chaserPosition).length
            ? Object.keys(chaserPosition).map((agent: string) => {
                return (
                  <Fragment key={agent}>
                    <PositionMarker position={chaserPosition[agent]} isChasing id={agent} />
                  </Fragment>
                );
              })
            : null}
          {Object.keys(supportPosition).length
            ? Object.keys(supportPosition).map((agent: string) => {
                return (
                  <Fragment key={agent}>
                    <PositionMarker position={supportPosition[agent]} isSupporting id={agent} />
                  </Fragment>
                );
              })
            : null}
          {Object.keys(squadPosition).length
            ? Object.keys(squadPosition).map((agent: string) => {
                return (
                  <Fragment key={agent}>
                    <PositionMarker position={squadPosition[agent]} isSquadMember id={agent} />
                  </Fragment>
                );
              })
            : null}
          {chaserRoute && chaserRoute.length ? (
            <Polyline coordinates={chaserRoute} strokeColor='red' strokeWidth={6}></Polyline>
          ) : null}

          {direction && direction.length ? (
            <Polyline coordinates={direction} strokeColor='blue' strokeWidth={6}></Polyline>
          ) : null}
        </MapView>
      </View>
    </PatrolContext.Provider>
  );
};

export default PatrolContext;
