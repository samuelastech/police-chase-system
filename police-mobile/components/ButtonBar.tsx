import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors, fonts } from '../styles/base';

interface ButtonBar extends TouchableOpacityProps {
  icon: React.ElementType;
  text: string;
  active?: boolean;
}

export const ButtonBar = ({ icon, text, active = false, ...rest }: ButtonBar) => {
  const Icon = icon;

  return (
    <TouchableOpacity style={styles(active).button} {...rest}>
      <Icon size={20} color={active ? 'white' : colors.blue[950]} />
      <Text style={styles(active).buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = (active: boolean) =>
  StyleSheet.create({
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: active ? colors.blue[500] : undefined,
    },

    buttonText: {
      color: active ? 'white' : colors.blue[950],
      fontFamily: fonts.default,
      fontSize: 18,
    },
  });
