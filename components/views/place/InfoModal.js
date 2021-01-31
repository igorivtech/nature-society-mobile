import React, { useEffect } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../values/colors";
import { width } from "../../../values/consts";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
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
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{strings.placeScreen.infoTitle}</Text>
            <Image
              style={globalStyles.imageJustContain}
              source={require("../../../assets/images/info_icon_large.png")}
            />
          </View>
          <Text style={textStyles.normalOfSize(18)}>{strings.placeScreen.infoDesc}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  title: {
    ...textStyles.boldOfSize(24),
    flex: 1,
    paddingRight: 9,
  },
  titleContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    paddingHorizontal: 27,
    paddingTop: 30,
    paddingBottom: 45,
    alignItems: "stretch",
    backgroundColor: "white",
    ...globalStyles.shadow,
    borderRadius: 22.5,
    width: width - 2 * 30,
  },
});
