import { Text, StyleSheet, TouchableOpacity, TouchableOpacityProps, Animated } from 'react-native';
import { colors, fonts } from '../styles/base';
import { CircleNotch } from 'phosphor-react-native';
import { useEffect, useState } from 'react';

interface ButtonProps extends TouchableOpacityProps {
  text: string;
  textColor?: string;
  color?: string;
  isLoading?: boolean;
}

export const Button = ({ text, textColor, color, isLoading = false, ...rest }: ButtonProps) => {
  const [spinAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isLoading) spin();
  }, [isLoading]);

  const spin = () => {
    Animated.loop(
      Animated.timing(spinAnimation, {
        toValue: 2,
        duration: 800,
        useNativeDriver: true,
      } as Animated.TimingAnimationConfig),
    ).start(() => {
      spinAnimation.setValue(0);
    });
  };

  const interpolateRotating = spinAnimation.interpolate({
    inputRange: [0, 2],
    outputRange: ['0deg', '720deg'],
  });

  const animatedStyle = {
    transform: [
      {
        rotate: interpolateRotating,
      },
    ],
  };

  return (
    <TouchableOpacity style={styles(color).button} {...rest}>
      {isLoading ? (
        <Animated.View style={animatedStyle}>
          <CircleNotch size={20} color={colors.gray[100]} />
        </Animated.View>
      ) : (
        <Text style={styles(color, textColor).buttonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = (color = colors.blue[500], textColor = colors.gray[100]) =>
  StyleSheet.create({
    button: {
      backgroundColor: color,
      borderRadius: 4,
      height: 53,
      justifyContent: 'center',
      alignItems: 'center',
    },

    buttonText: {
      color: textColor,
      textAlign: 'center',
      fontFamily: fonts.default,
    },
  });
