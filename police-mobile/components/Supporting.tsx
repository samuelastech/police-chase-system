import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWork, usePatrol, useBluetoothLE } from '../hooks/';
import { ArrowCircleLeft } from 'phosphor-react-native';
import { ButtonIcon } from './ButtonIcon';
import { coordinatesDecode } from '../utils/map.utils';
import { AddressSignal } from './AddressSignal';

export const Supporting = () => {
  const { socket } = useWork();
  const { location } = useBluetoothLE();
  const {
    position,
    toggleSupporting,
    setSupportPosition,
    setChaserPosition,
    setChaserRoute,
    setDirection,
  } = usePatrol();
  const [destination, setDestination] = useState<number[]>([]);
  const [address, setAddress] = useState<string>('');

  // useEffect(() => {
  //   setChaserPosition({
  //     somedID: [-23.67506900727423, -46.80163615946291],
  //   });

  //   setDestination([-23.67506900727423, -46.80163615946291]);
  // }, []);

  useEffect(() => {
    socket.once('squad:leaveSupport', () => {
      toggleSupporting();
    });

    socket.on('support:position', (position) => {
      setSupportPosition((agents: any) => {
        return { ...agents, ...position };
      });
    });

    socket.on('support:chaserPosition', (position: any) => {
      const key: string = Object.keys(position)[0];
      // console.log(position);
      setDestination(position[key]);
      setChaserPosition((agents: any) => {
        return { ...agents, ...position };
      });
      const location = position[Object.keys(position)[0]];
      setChaserRoute((coords: any) => {
        if (coords && coords.length) {
          return [...coords, { latitude: location[0], longitude: location[1] }];
        } else {
          return [{ latitude: location[0], longitude: location[1] }];
        }
      });
    });

    socket.once('support:finishChase', () => {
      toggleSupporting();
    });

    socket.on('support:cleanUp', (clientId) => {
      setSupportPosition((agents: any) => {
        const { [clientId]: coords, ...rest } = agents;
        return rest;
      });
    });

    return () => {
      socket.off('support:position');
      socket.off('support:chaserPosition');
      socket.off('squad:toggleSquadCoords');
      socket.off('police:cleanUp');
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('support:occurrence:position', position);

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${position[0]},${position[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
      )
      .then((response) => {
        setAddress(
          `${response.data.results[0]['address_components'][1]['long_name']}, ${response.data.results[0]['address_components'][2]['long_name']}, ${response.data.results[0]['address_components'][3]['long_name']}`,
        );
      });

    axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${position[0]},${position[1]}&destination=${destination[0]},${destination[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}&mode=driving`,
      )
      .then((response) => {
        if (response.data.routes && response.data.routes.length) {
          setDirection(coordinatesDecode(response.data.routes[0].overview_polyline.points));
        }
      });
  }, [socket, position, location]);

  const leaveSupport = () => {
    socket.emit('occurrence:leaveSupport');
    toggleSupporting();
  };

  return (
    <>
      {address ? <AddressSignal address={address} /> : null}
      <View style={styles.container}>
        <ButtonIcon text='Sair do suporte' icon={ArrowCircleLeft} onPress={leaveSupport} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 5,
    bottom: 0,
    left: 0,
    width: '100%',
    padding: 10,
  },
});
