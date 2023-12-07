import { useEffect } from 'react';
import { useNavigate, useWork } from '../hooks';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/base';

export const WaitingPatrol = () => {
  const { socket } = useWork();
  const navigation = useNavigate();

  useEffect(() => {
    socket.on('squad:readyForWork', () => {
      navigation.navigate('Patrol', {
        screen: 'PatrollingMap',
      });
    });

    return () => {
      socket.off('squad:readyForWork');
    };
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color={colors.orange[500]} />
      <Text style={styles.text}>Esperando equipe iniciar patrulhamento</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },

  text: {
    fontSize: 24,
    textAlign: 'center',
  },
});
