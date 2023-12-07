import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { colors } from '../styles/base';

interface CalloutProps {
  text: string;
  icon: React.ElementType;
}

const Callout = forwardRef(({ text, icon }: CalloutProps, ref) => {
  const Icon = icon;

  const calloutRef = useRef<Text>(null);
  useImperativeHandle(ref, () => ({
    focus: () => {
      calloutRef.current?.focus();
    },
  }));

  return (
    <View style={style.container}>
      <Icon style={style.icon} size={20} color={colors.gray[100]} />
      <Text style={style.text} ref={calloutRef}>
        {text}
      </Text>
    </View>
  );
});

Callout.displayName = 'Callout';
export { Callout };

const style = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 20,
    gap: 15,
    backgroundColor: colors.blue[950],
  },

  text: {
    flex: 2,
    color: colors.gray[100],
    fontSize: 18,
  },

  icon: {
    marginTop: 2,
    flex: 1,
  },
});
