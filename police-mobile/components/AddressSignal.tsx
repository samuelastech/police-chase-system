import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/base';

interface AddressSignalProps {
  address: string;
}

export const AddressSignal = ({ address }: AddressSignalProps) => {
  return (
    <View style={styles.containerAddress}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Endereço</Text>
      </View>
      <View style={styles.addressContainer}>
        <Text style={styles.address}>{address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    paddingVertical: 10,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
  },

  containerAddress: {
    zIndex: 9999,
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    borderRadius: 4,
    backgroundColor: colors.green[200],
  },

  address: {
    color: 'white',
    fontFamily: fonts.bold,
    fontSize: 20,
  },

  labelContainer: {
    paddingVertical: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingHorizontal: 20,
    backgroundColor: colors.green[300],
  },

  label: {
    fontFamily: fonts.default,
    fontSize: 16,
    color: 'white',
  },
});
