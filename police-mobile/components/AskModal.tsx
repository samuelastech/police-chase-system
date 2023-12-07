import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from './Button';
import { colors, fonts } from '../styles/base';

export interface AskModalProps {
  text: string;
  acceptText?: string;
  rejectText?: string;
  isOpen: boolean;
  accept: () => void;
  reject: () => void;
}

export const AskModal = ({
  isOpen,
  accept,
  reject,
  text,
  acceptText = 'Aceitar',
  rejectText = 'Recusar',
}: AskModalProps) => {
  return (
    <Modal animationType='fade' transparent visible={isOpen}>
      <TouchableOpacity style={styles.containerModal} onPress={reject}>
        <View style={styles.subContainerModal}>
          <Text style={styles.text}>{text}</Text>
          <Button
            text={acceptText}
            color={colors.orange[500]}
            textColor={colors.blue[950]}
            onPress={accept}
          />
          <TouchableOpacity style={styles.containerModal} onPress={reject}>
            <Text style={styles.rejectText}>{rejectText}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  containerModal: {
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

  rejectText: {
    fontSize: 18,
    fontFamily: fonts.default,
    textAlign: 'center',
  },
});
