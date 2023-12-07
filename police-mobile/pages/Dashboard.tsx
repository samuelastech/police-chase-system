import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { useWork, useNavigate, useAuth } from '../hooks';
import { AskModal, Button, Card } from '../components/';
import { colors, fonts } from '../styles/base';
import { axiosPrivate } from '../api/axios';
import { SignOut } from 'phosphor-react-native';
import { useLogout } from '../hooks/useLogout';

interface UserStats {
  work: number;
  occurrences: number;
  supported: number;
}

export const Dashboard = () => {
  const { auth } = useAuth();
  const { socket } = useWork();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [stats, setStats] = useState<UserStats>({ work: 0, occurrences: 0, supported: 0 });
  const navigation = useNavigate();
  const logout = useLogout();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getStats = async () => {
      try {
        const response = await axiosPrivate.get(`/users/stats/${auth.id}`, {
          signal: controller.signal,
        });
        isMounted && setStats(response.data);
      } catch (error: any) {
        console.log(error);
      }
    };

    getStats();

    socket.on('startAlone', () => {
      navigation.navigate('Patrol', {
        screen: 'PatrollingMap',
      });
    });

    socket.on('waitForSquad', () => {
      navigation.navigate('WaitingPatrol');
    });

    socket.on('squad:startWork', () => {
      toggleModal();
    });

    return () => {
      isMounted = false;
      socket.off('squad:startWork');
      socket.off('waitForSquad');
      socket.off('startAlone');
    };
  }, [stats]);

  const startWork = () => {
    socket.emit('agent:startWork');
  };

  const acceptPatrolRequest = () => {
    toggleModal();
    socket.emit('squad:acceptStartWork');
    navigation.navigate('WaitingPatrol');
  };

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('SignIn');
  };

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor={colors.orange[500]} />
      <AskModal
        text='Membro(s) solicitando inicio de patrulhamento'
        accept={acceptPatrolRequest}
        reject={toggleModal}
        isOpen={modalIsOpen}
      />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>
            Dashboard <Text style={styles.subtitle}>Patrulhamento</Text>
          </Text>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <SignOut color='#fff' />
          </TouchableOpacity>
        </View>
        <Card text='Patrulhamentos realizados' data={stats.work} />
        <Card text='Perseguições realizadas' data={stats.occurrences} />
        <Card text='Apoios prestados' data={stats.supported} />
        <View style={styles.buttonContainer}>
          <Button
            text='Iniciar patrulhamento'
            color={colors.orange[500]}
            textColor={colors.blue[950]}
            onPress={startWork}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 40,
    position: 'relative',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 38,
    fontFamily: fonts.bold,
    color: colors.blue[950],
  },

  subtitle: {
    fontSize: 16,
    fontFamily: fonts.default,
    color: colors.blue[950],
  },

  buttonContainer: {
    paddingTop: 20,
  },

  logoutButton: {
    backgroundColor: colors.blue[500],
    paddingVertical: 10,
    paddingHorizontal: 3,
    borderRadius: 4,
  },
});
