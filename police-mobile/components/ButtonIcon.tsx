import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors, fonts } from '../styles/base';

interface ButtonIconProps extends TouchableOpacityProps {
  text: string;
  icon: React.ElementType;
  backgroundColor?: string;
  textColor?: string;
  border?: number;
  borderColor?: string;
}

export const ButtonIcon = ({
  text,
  icon,
  backgroundColor = colors.blue[500],
  textColor = colors.gray[100],
  border = 0,
  borderColor = backgroundColor,
  ...rest
}: ButtonIconProps) => {
  const Icon = icon;

  return (
    <TouchableOpacity
      style={styles(textColor, backgroundColor, border, borderColor).button}
      {...rest}
    >
      <Icon size={18} color={textColor} />
      <Text style={styles(textColor, backgroundColor, border, borderColor).buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = (textColor: string, backgroundColor: string, border: number, borderColor: string) =>
  StyleSheet.create({
    button: {
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 4,
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
      backgroundColor,
      borderWidth: border,
      borderColor,
    },

    buttonText: {
      textAlign: 'center',
      color: textColor,
      fontFamily: fonts.default,
      fontSize: 16,
    },
  });
