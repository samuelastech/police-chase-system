import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { TextInput, Text, TextInputProps, StyleSheet, View } from 'react-native';
import { colors, fonts } from '../styles/base';

interface InputProps extends TextInputProps {
  label: string;
  placeholder: string;
  icon: React.ElementType;
  setProperty: (property: string) => void;
}

const Input = forwardRef(({ label, placeholder, setProperty, icon, ...rest }: InputProps, ref) => {
  const Icon = icon;
  const inputRef = useRef<TextInput>(null);
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setIsFocused(true);
    },
  }));

  const [isFocused, setIsFocused] = useState<boolean>(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <View style={[styles.iconContainer, isFocused ? styles.iconContainerFocused : null]}>
          {Icon && (
            <Icon
              style={styles.icon}
              color={isFocused ? colors.gray[100] : colors.gray[400]}
              size={17}
            />
          )}
        </View>
        <TextInput
          autoCapitalize='none'
          style={[styles.input, isFocused ? styles.inputFocused : null]}
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor={colors.gray[400]}
          onChangeText={(text) => setProperty(text)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </View>
    </View>
  );
});

Input.displayName = 'Input';
export { Input };

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  input: {
    flex: 8,
    backgroundColor: '#253745',
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    paddingVertical: 15,
    paddingRight: 20,
    fontSize: 16,
    color: colors.gray[100],
    fontFamily: fonts.default,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.blue[900],
  },

  inputFocused: {
    borderColor: colors.blue[500],
  },

  iconContainer: {
    flex: 1,
    backgroundColor: '#253745',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderTopWidth: 2,
    borderColor: colors.blue[900],
  },

  iconContainerFocused: {
    borderColor: colors.blue[500],
  },

  icon: {
    marginTop: 20,
  },

  label: {
    color: colors.gray[100],
    marginBottom: 5,
    fontFamily: fonts.default,
  },
});
