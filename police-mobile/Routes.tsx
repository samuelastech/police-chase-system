import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dashboard, PatrollingLayout, SignIn, WaitingPatrol } from './pages/';
import { AuthProvider, WorkProvider } from './context/';

const { Navigator, Screen } = createNativeStackNavigator();

export const Routes = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <Navigator screenOptions={{ headerShown: false }} initialRouteName='SignIn'>
          <Screen name='SignIn' component={SignIn} />
          <Screen name='Work' component={WorkRoutes} />
        </Navigator>
      </AuthProvider>
    </NavigationContainer>
  );
};

export const WorkRoutes = () => {
  return (
    <WorkProvider>
      <Navigator screenOptions={{ headerShown: false }}>
        <Screen name='Dashboard' component={Dashboard} />
        <Screen name='WaitingPatrol' component={WaitingPatrol} />
        <Screen name='Patrol' component={PatrollingRoutes} />
      </Navigator>
    </WorkProvider>
  );
};

export const PatrollingRoutes = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='PatrollingMap' component={PatrollingLayout} />
    </Navigator>
  );
};
