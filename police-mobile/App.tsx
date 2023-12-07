import { useFonts } from 'expo-font';
import {
  RobotoCondensed_400Regular,
  RobotoCondensed_700Bold,
} from '@expo-google-fonts/roboto-condensed';

import { Routes } from './Routes';

const App = () => {
  const [fontsLoaded] = useFonts({
    RobotoCondensed_400Regular,
    RobotoCondensed_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <Routes />;
};

export default App;
