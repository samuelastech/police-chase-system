import { useEffect, useRef, useState } from 'react';
import { View, Text, type TextInput, StyleSheet, StatusBar } from 'react-native';
import { Roles } from '../types/roles.enum';
import { useAuth, useNavigate } from '../hooks';
import { axios } from '../api/axios';
import { colors, fonts } from '../styles/base';
import { Envelope, LockSimple, WarningCircle } from 'phosphor-react-native';
import { Button, Input, Callout } from '../components';

export const SignIn = () => {
  const { setAuth } = useAuth();
  const navigation = useNavigate();

  const emailRef = useRef<TextInput>(null);
  const errorRef = useRef<Text>(null);

  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('Text');

  useEffect(() => {
    if (emailRef.current !== null) {
      emailRef.current.focus();
    }

    return () => {
      setEmail('');
      setPass('');
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    setErrorMessage('');
  }, [email, pass]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      if (!email || !pass) {
        throw new Error(`Você precisa preencher ${!email ? 'o e-email' : 'a senha'}`);
      }

      const response = await axios.post(
        '/auth/signin',
        JSON.stringify({
          email,
          password: pass,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      const { accessToken, type, id, module } = response.data;
      if (type !== Roles.POLICE) throw new Error('User type not allowed');

      setAuth({ email, pass, accessToken, type, id, module });
      setEmail('');
      setPass('');
      navigation.replace('Work', {
        screen: 'Dashboard',
      });
    } catch (error: any) {
      setIsLoading(false);

      if (error.message === 'User type not allowed') {
        setErrorMessage('Somente POLICIAIS podem fazer login');
      } else if (error.message.match('Você precisa preencher')) {
        setErrorMessage(error.message);
      } else if (!error?.response) {
        setErrorMessage('Sem resposta do servidor');
      } else if (error.response?.status === 400) {
        setErrorMessage('Algum campo foi esquecido');
      } else if (error.response?.status === 401) {
        setErrorMessage('Não autorizado');
      } else {
        console.log(error);
        setErrorMessage('Login falhou por alguma coisa');
      }

      errorRef.current?.focus();
    }
  };

  return (
    <>
      <View style={styles.container}>
        <StatusBar barStyle='light-content' backgroundColor={colors.blue[500]} />

        {errorMessage ? <Callout icon={WarningCircle} text={errorMessage} ref={errorRef} /> : null}
        <Text style={styles.title}>Entrar</Text>
        <Input
          ref={emailRef}
          label='E-mail'
          icon={Envelope}
          placeholder='Digite seu email'
          setProperty={setEmail}
        />
        <Input
          label='Senha'
          placeholder='Digite sua senha'
          icon={LockSimple}
          setProperty={setPass}
          secureTextEntry
        />
        <Button isLoading={isLoading} text='Entrar' onPress={handleSubmit} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: 'center',
    backgroundColor: colors.blue[900],
    gap: 15,
  },

  title: {
    fontSize: 48,
    fontFamily: fonts.bold,
    color: colors.gray[100],
  },
});
