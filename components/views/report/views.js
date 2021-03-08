import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Popup } from "../Popup";
import { askSettings } from "../../../hooks/usePermissions";
import { smallScreen } from "../../../values/consts";
import { globalStyles } from "../../../values/styles";
import {ActivityIndicator} from "../ActivityIndicator";

export const TakePicView = ({ useImageData }) => {

  const {image, loadingImage, selectImage, imagePopupvisible, setPopupVisible} = useImageData;

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        onPress={selectImage}
        style={cameraStyle.container(image)}
      >
        <Image source={require("../../../assets/images/camera_icon.png")} />

        {loadingImage ? (
          <View style={cameraStyle.indicatorContainer}>
            <ActivityIndicator
              style={cameraStyle.indicator}
              color={colors.treeBlues}
            />
          </View>
        ) : null}
        {image && <Image style={cameraStyle.image} source={{ uri: image.uri }} />}
      </TouchableOpacity>
      <Popup textData={strings.popups.camera} action={askSettings} popupVisible={imagePopupvisible} setPopupVisible={setPopupVisible} />
    </View>
  );
};

export const GoBackButton = ({ goBack }) => {
  return (
    <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
      <Image source={require("../../../assets/images/scroll_back_icon.png")} />
      <Text style={styles.goBack}>{strings.reportScreen.goBack}</Text>
    </TouchableOpacity>
  );
};

export const FinishButton = ({points, finishReport}) => {
  return (
    <TouchableOpacity onPress={finishReport}>
    <View style={styles.buttonContainer}>
      <View style={styles.buttonIconContainer}>
        <Text style={styles.buttonText}>{`+${points}`}</Text>
        <Image style={globalStyles.imageJustContain} source={require("../../../assets/images/finish_report_icon.png")} />
      </View>
      <Text style={styles.finishText}>{strings.reportScreen.finishButton}</Text>
    </View>
  </TouchableOpacity>
  )
}


const styles = StyleSheet.create({

  outerContainer: {
    flexGrow: 1
  },

  finishText: {
    ...textStyles.boldOfSize(18),
    color: 'white',
    textAlign: 'center'
  },

  buttonIconContainer: {
    ...globalStyles.shadow,
    flexDirection: 'row',
    alignItems: 'center'
  },

  buttonText: {
    ...textStyles.normalOfSize(24),
    textAlign: 'center',
    color: 'white',
    marginRight: 10
  },


  buttonContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: colors.treeBlues,
    height: 45,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center'
  },

  goBackButton: {
    alignItems: "center",
    justifyContent: "space-between",
  },

  goBack: {
    marginTop: 0,
    ...textStyles.normalOfSize(12),
    textAlign: "center",
    color: colors.lighterShade,
  },
});

const cameraStyle = StyleSheet.create({
  indicatorContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    transform: [{ translateY: 2.7 }],
  },
  image: {
    ...StyleSheet.absoluteFill,
    borderRadius: 15,
  },
  container: (image) => ({
    ...StyleSheet.absoluteFill,
    borderWidth: image !== null ? 0 : 1,
    borderColor: colors.treeBlues,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    overflow: "hidden",
  }),
});
