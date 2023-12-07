import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useWork, useNavigate, usePatrol, useAuth, useBluetoothLE } from '../hooks/';
import { Siren, ArrowCircleLeft } from 'phosphor-react-native';
import { AskModal } from './AskModal';
import { ButtonIcon } from './ButtonIcon';
import { colors } from '../styles/base';

export const Patrolling = () => {
  const { auth } = useAuth();
  const { disconnectFromDevice } = useBluetoothLE();
  const { socket } = useWork();
  const { setSquadPosition, toggleChase, toggleSupporting, setOccurrenceId, occurrenceId } =
    usePatrol();
  const [isOpenForSupporting, setIsOpenForSupporting] = useState<boolean>(false);
  const [isOpenForFinishPatrolling, setIsOpenForFinishPatrolling] = useState<boolean>(false);
  const navigation = useNavigate();

  useEffect(() => {
    socket.on('squad:startChase', () => {
      toggleChase();
    });

    socket.on('squad:calledToSupport', () => {
      toggleSupporting();
    });

    socket.on('polices:supportRequest', (chasingId) => {
      setOccurrenceId(chasingId);
      toggleModalForSupporting();
    });

    socket.on('squad:finishWork', () => {
      toggleModalForFinishPatrolling();
    });

    socket.on('patrol:position', (position) => {
      setSquadPosition(position);
    });

    socket.once('squad:readyForFinishWork', () => {
      navigation.navigate('Work', {
        screen: 'Dashboard',
      });
    });

    return () => {
      socket.off('squad:calledToSupport');
      socket.off('squad:calledToSupport');
      socket.off('polices:supportRequest');
      socket.off('squad:toggleSquadCoords');
      socket.off('squad:finishWork');
      socket.off('squad:startChase');
    };
  }, [socket]);

  const finishPatrol = async () => {
    if (auth.module) {
      await disconnectFromDevice();
    }

    socket.emit('agent:finishWork');
  };

  const rejectSupportRequest = () => {
    setOccurrenceId('');
    toggleModalForSupporting();
  };

  const acceptSupportRequest = () => {
    setOccurrenceId('');
    toggleModalForSupporting();
    socket.emit('police:acceptSupport', occurrenceId);
  };

  const acceptRequestToFinishPatrol = () => {
    toggleModalForFinishPatrolling();
    socket.emit('squad:acceptFinishWork');
  };

  const rejectRequestToFinishPatrol = () => {
    toggleModalForFinishPatrolling();
  };

  const toggleModalForSupporting = () => {
    setIsOpenForSupporting(!isOpenForSupporting);
  };

  const toggleModalForFinishPatrolling = () => {
    setIsOpenForFinishPatrolling(!isOpenForFinishPatrolling);
  };

  const handleStartChase = () => {
    socket.emit('police:startChase');
    toggleChase();
  };

  return (
    <View style={styles.container}>
      <AskModal
        text='Membro(s) estão querendo finalizar o patrulhamento'
        accept={acceptRequestToFinishPatrol}
        reject={rejectRequestToFinishPatrol}
        isOpen={isOpenForFinishPatrolling}
      />
      <AskModal
        text='Policiais estão solicitando suporte'
        accept={acceptSupportRequest}
        reject={rejectSupportRequest}
        isOpen={isOpenForSupporting}
      />

      <ButtonIcon text='Encerrar' icon={ArrowCircleLeft} onPress={finishPatrol} />
      <ButtonIcon
        text='Acompanhamento'
        icon={Siren}
        onPress={handleStartChase}
        backgroundColor={colors.red[500]}
      />
    </View>
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

  button: {
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderRadius: 15,
    shadowColor: 'rgba(0,0,0, .7)',
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 1,
    elevation: 2,
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },

  buttonText: {
    textAlign: 'center',
    fontFamily: 'RobotoCondensed_400Regular',
  },
});
