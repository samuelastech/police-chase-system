import { useMemo, useState } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { BleError, BleManager, Characteristic, Device } from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';
import base64 from 'react-native-base64';

const MODULE_UUID = 'd684998b-a18d-4858-8840-9f388662ee3e';
const MODULE_CHARACTERISTIC = 'd684998b-a18d-4858-8840-9f388662ee3e';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  connectedDevice: string;
  allDevices: Device[];
  location: number[];
  setLocation: (data: any) => void;
  sendDataToDevice: (data: string) => Promise<void>;
  ip: string;
}

export const useBluetoothLE = (): BluetoothLowEnergyApi => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [t, setT] = useState<Device | null>(null);
  const [location, setLocation] = useState<number[]>([0, 0]);

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted = await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicteDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex((device) => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicteDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection.id);
      setT(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      bleManager.stopDeviceScan();
      startStreamingData(deviceConnection);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const sendDataToDevice = async (data: string) => {
    await t?.writeCharacteristicWithResponseForService(
      MODULE_UUID,
      MODULE_CHARACTERISTIC,
      base64.encode(data),
    );
  };

  const disconnectFromDevice = async () => {
    await bleManager.cancelDeviceConnection('FC:B4:67:C2:C1:FA');
    setConnectedDevice('');
    setLocation([0, 0]);
  };

  const onLocationUpdate = (error: BleError | null, characteristic: Characteristic | null) => {
    if (error) {
      console.log(error);
      return [0, 0];
    } else if (!characteristic?.value) {
      console.log('No Data was recieved');
      return [0, 0];
    }

    const decodedValue = base64.decode(characteristic.value);
    console.log('data:A', decodedValue);

    if (!decodedValue) {
    } else if (!decodedValue.includes(',')) {
      setIp(decodedValue);
      console.log('data:A', decodedValue);
    } else {
      const serialize = decodedValue.split(',').map((coord) => +coord);
      setLocation(serialize);
    }

    // if (!decodedValue.includes('.')) {
    //   setIp(decodedValue);
    //   console.log('ip', decodedValue);
    // } else {
    //   const serialize = decodedValue.split(',').map((coord) => +coord);
    //   setLocation(serialize);
    // }
  };

  const startStreamingData = async (device: Device) => {
    if (device) {
      device.monitorCharacteristicForService(MODULE_UUID, MODULE_CHARACTERISTIC, onLocationUpdate);
    } else {
      console.log('No Device Connected');
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    connectedDevice,
    disconnectFromDevice,
    location,
    setLocation,
    sendDataToDevice,
    ip,
  };
};
