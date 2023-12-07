import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { colors, fonts } from '../styles/base';
import { Device } from 'react-native-ble-plx';
import React, { useState } from 'react';

export interface DevicesModalProps {
  isOpen: boolean;
  devices: Device[];
  connectToDevice: (deviceId: Device) => Promise<void>;
  setIsOpen: (isOpen: boolean) => void;
  sendDataToDevice: (data: string) => void;
}

export const DevicesModal = ({
  isOpen,
  devices,
  connectToDevice,
  setIsOpen,
  sendDataToDevice,
}: DevicesModalProps) => {
  const [isWaitingForIp, setIsWaitingForIp] = useState(false);
  const [requestNetwork, setRequestNetwork] = useState(false);
  const [ssid, setSsid] = useState('');
  const [pass, setPass] = useState('');
  return (
    <Modal animationType='fade' transparent visible={isOpen}>
      <View style={styles.containerModal}>
        <View style={styles.subContainerModal}>
          {requestNetwork ? (
            <>
              <Text style={styles.text}>Rede: </Text>
              <View style={styles.devicesContainer}>
                <TextInput
                  onChangeText={(text) => setSsid(text)}
                  placeholder={'Digite o SSID da rede'}
                />
                <TextInput
                  onChangeText={(text) => setPass(text)}
                  secureTextEntry
                  placeholder={'Digite a senha da rede'}
                />
                {isWaitingForIp ? (
                  <>
                    <ActivityIndicator size='large' color='black' />
                  </>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setIsWaitingForIp(true);
                      sendDataToDevice(ssid + ';' + pass);
                      setIsOpen(false);
                    }}
                  >
                    <Text>Enviar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          ) : (
            <View style={styles.devicesContainer}>
              <Text style={styles.text}>Dispositivos</Text>
              {devices.length ? (
                devices.map((device) =>
                  device.name ? (
                    <TouchableOpacity
                      style={styles.deviceButton}
                      key={device.id}
                      onPress={async () => {
                        await connectToDevice(device);
                        const isConnected = await device.isConnected();
                        if (isConnected) {
                          setRequestNetwork(true);
                        }
                      }}
                    >
                      <Text style={styles.deviceText}>{device.name}</Text>
                    </TouchableOpacity>
                  ) : null,
                )
              ) : (
                <Text>Nenhum dispositivo...</Text>
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerModal: {
    zIndex: 9999,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.60)',
  },

  subContainerModal: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
    gap: 10,
  },

  text: {
    fontSize: 20,
    fontFamily: fonts.default,
  },

  devicesContainer: {
    gap: 5,
  },

  deviceButton: {
    width: '100%',
    backgroundColor: colors.orange[500],
    padding: 4,
    paddingVertical: 15,
    borderRadius: 4,
  },

  deviceText: {
    color: colors.blue[950],
    textAlign: 'center',
    fontSize: 16,
  },
});
