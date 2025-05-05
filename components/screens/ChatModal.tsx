import { StyleSheet, View } from "react-native";
import Room from "../ui/Room";
import Modal from "react-native-modal";

const ChatModal = ({
  visible,
  onClose,
  id,
}: {
  visible: boolean;
  onClose: () => void;
  id: string;
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackButtonPress={onClose}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={400}
      animationOutTiming={400}
      backdropOpacity={0.2}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      style={styles.modal}
    >
      <View style={styles.modalContainer}>
        <Room id={id} handleClose={onClose} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatModal;
