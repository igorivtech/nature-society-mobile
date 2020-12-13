import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import * as ImagePicker from "expo-image-picker";
import { textStyles } from "../../../values/textStyles";
import * as Permissions from "expo-permissions";

export const TakePicView = ({ image, setImage }) => {
  const [loadingImage, setLoadingImage] = useState(false);

  const selectImage = async () => {
    setLoadingImage(true);
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA);
    if (status === 'granted') {
      ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: 0.75,
      })
        .then((result) => {
          if (!result.cancelled) {
            setImage(result);
          }
        })
        .catch((error) => {
          console.log({ error });
        })
        .finally(() => {
          setLoadingImage(false);
        });
    } else {
      setLoadingImage(false);
    }
  };

  return (
    <View style={styles.outerContainer}>
      <TouchableOpacity
        onPress={selectImage}
        style={cameraStyle.container(image)}
      >
        <Image source={require("../../../assets/images/camera_icon.png")} />

        {loadingImage && (
          <View style={cameraStyle.indicatorContainer}>
            <ActivityIndicator
              style={cameraStyle.indicator}
              color={colors.treeBlues}
            />
          </View>
        )}
        {image && <Image style={cameraStyle.image} source={{ uri: image.uri }} />}
      </TouchableOpacity>
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
        <Image source={require("../../../assets/images/finish_report_icon.png")} />
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
    ...textStyles.normalOfSize(18),
    color: 'white',
    textAlign: 'center'
  },

  buttonIconContainer: {
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
    transform: [{ translateY: 60 }],
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
