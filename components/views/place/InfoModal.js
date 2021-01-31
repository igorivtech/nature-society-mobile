import React, { useEffect } from "react";
import { Image, Modal, StyleSheet, View } from "react-native";
import { colors } from "../../../values/colors";
import { width } from "../../../values/consts";
import { globalStyles } from "../../../values/styles";
import { TapView } from "../general";

export const InfoModal = ({ visible, setVisible }) => {
  const close = () => {
    setVisible(false);
  };
  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        <TapView onPress={close} />
        <View style={styles.card}>
          <Image
            style={globalStyles.imageJustContain}
            source={require("../../../assets/images/info_icon_large.png")}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    ...globalStyles.shadow,
    borderRadius: 22.5,
    height: 400,
    width: width - 2 * 30,
  },
});
