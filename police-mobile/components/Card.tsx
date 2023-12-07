import { View, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../styles/base';

interface CardProps {
  data: number;
  text: string;
}

export const Card = ({ data, text }: CardProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.data}>{data}</Text>
      <Text style={styles.legend}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray[50],
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
  },

  data: {
    color: colors.blue[950],
    fontFamily: fonts.bold,
    fontSize: 40,
  },

  legend: {
    color: colors.blue[950],
    fontFamily: fonts.default,
    fontSize: 20,
  },
});
