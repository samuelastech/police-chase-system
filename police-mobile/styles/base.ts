import { Dimensions } from 'react-native';

export const dimensions = {
  fullWidth: Dimensions.get('window').width,
  fullHeight: Dimensions.get('window').height,
};

export const colors = {
  blue: {
    '950': '#18242F',
    '900': '#1E2A36',
    '800': '#253745',
    '500': '#1293EF',
  },
  gray: {
    '50': '#FCFAFA',
    '100': '#E6ECF3',
    '400': '#546575',
  },
  orange: {
    '500': '#F0C313',
  },
  red: {
    '0.25': 'rgba(239, 18, 18, 0.25)',
    '500': '#EF1212',
  },
  green: {
    '300': '#009C07',
    '200': '#00BD08',
  },
};

export const fonts = {
  default: 'RobotoCondensed_400Regular',
  bold: 'RobotoCondensed_700Bold',
};
