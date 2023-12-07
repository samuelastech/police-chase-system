import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowCircleLeft, Broadcast } from 'phosphor-react-native';
import { useWork, usePatrol } from '../hooks/';
import { colors } from '../styles/base';
import { ButtonBar } from './ButtonBar';
import { AddressSignal } from './AddressSignal';

export const Chasing = () => {
  const { socket } = useWork();
  const { toggleChase, setSupportPosition, setChaserRoute, position } = usePatrol();
  const [isCallingSupport, setIsCallingSupport] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('');

  // useEffect(() => {
  //   setSupportPosition({ someId: [-23.662699877102977, -46.801921983273886] });
  // }, []);

  useEffect(() => {
    socket.on('support:cleanUp', (clientId) => {
      setSupportPosition((agents: any) => {
        const { [clientId]: coords, ...rest } = agents;
        return rest;
      });
    });

    socket.on('support:position', (position) => {
      setSupportPosition((agents: any) => {
        return { ...position, ...agents };
      });
    });

    socket.on('squad:finishChase', () => {
      toggleChase();
    });

    return () => {
      socket.off('squad:finishChase');
      socket.off('support:position');
      socket.off('support:cleanUp');
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('occurrence:position', position);

    const interval = setInterval(() => {
      socket.emit('occurrence:position', position);
    }, 3000);

    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${position[0]},${position[1]}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`,
      )
      .then((response) => {
        setAddress(
          `${response.data.results[0]['address_components'][1]['long_name']}, ${response.data.results[0]['address_components'][2]['long_name']}, ${response.data.results[0]['address_components'][3]['long_name']}`,
        );
      });

    setChaserRoute((coords: any) => {
      if (coords && coords.length) {
        return [...coords, { latitude: position[0], longitude: position[1] }];
      } else {
        return [{ latitude: position[0], longitude: position[1] }];
      }
    });

    return () => clearInterval(interval);
  }, [socket, position]);

  const emitSupportRequest = () => {
    setIsCallingSupport(!isCallingSupport);
    if (!isCallingSupport) {
      socket.emit('squad:supportRequest');
    }
  };

  const finishChase = () => {
    socket.emit('police:finishChase');
    toggleChase();
  };

  return (
    <>
      {address ? <AddressSignal address={address} /> : null}
      <View style={styles.containerButtons}>
        <ButtonBar text='Encerrar' icon={ArrowCircleLeft} onPress={finishChase} />
        {isCallingSupport ? (
          <ButtonBar text='Apoio' icon={Broadcast} active onPress={emitSupportRequest} />
        ) : (
          <ButtonBar text='Apoio' icon={Broadcast} onPress={emitSupportRequest} />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  containerButtons: {
    zIndex: 9999,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
    bottom: 0,
    left: 0,
    width: '100%',
    backgroundColor: 'white',
    minHeight: 80,
    borderTopColor: colors.blue[950],
    borderWidth: 1,
  },
});
