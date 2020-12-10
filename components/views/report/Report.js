import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Pagination } from "./Slider";
import * as ImagePicker from 'expo-image-picker';

export const Report = ({goBack}) => {

  const [image, setImage] = useState(null);

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <GoBackButton goBack={goBack} />    
        <View style={styles.titlesContainer}>
          <View style={styles.pagContainer}>
            <Pagination index={2} />
          </View>
          <Text style={textStyles.normalOfSize(12)}>{strings.reportScreen.takePic1}</Text>
          <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.takePic2}</Text>
        </View>
        <TakePicView image={image} setImage={setImage} />
      </View>
    </View>
  );
};

const TakePicView = ({image, setImage}) => {

  const [loadingImage, setLoadingImage] = useState(false);

  const selectImage = () => {
    setLoadingImage(true);
    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.75,
    }).then((result)=>{
      if (!result.cancelled) {
        setImage(result);
      }
    }).catch((error)=>{
      console.log({error});
    }).finally(()=>{
      setLoadingImage(false);
    });
  };

  return (
    <TouchableOpacity onPress={selectImage} style={cameraStyle.container(image)}>
      <Image source={require("../../../assets/images/camera_icon.png")} />
      
      {loadingImage && (
        <View style={cameraStyle.indicatorContainer}>
          <ActivityIndicator style={cameraStyle.indicator} color={colors.treeBlues} />
        </View>
      )}
      {image && (<Image style={cameraStyle.image} source={{uri: image.uri}} />)}
    </TouchableOpacity>
  )
}

const cameraStyle = StyleSheet.create({
  indicatorContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicator: {
    transform: [
      {translateY: 60}
    ]
  },
  image: {
    ...StyleSheet.absoluteFill,
    borderRadius: 15
  },
  container: (image) => ({
    width: "100%",
    borderWidth: image !== null ? 0 : 1,
    borderColor: colors.treeBlues,
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    overflow: 'hidden'
  })
});

const GoBackButton = ({goBack}) => {
  return (
    <TouchableOpacity onPress={goBack} style={styles.goBackButton}>
      <Image source={require("../../../assets/images/scroll_back_icon.png")} />
      <Text style={styles.goBack}>{strings.reportScreen.goBack}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({

  titlesContainer: {
    marginTop: 23
  },

  firstContainer: {
    flex: 1,
    alignItems: 'stretch'
  },

  container: {
    height: "33.3333333333333%",
    width: "100%",
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 13,
    paddingBottom: 21,
    paddingHorizontal: 30
  },
  pagContainer: {
    position: 'absolute',
  },

  goBackButton: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  goBack: {
    marginTop: 0,
    ...textStyles.normalOfSize(12),
    textAlign: 'center',
    color: colors.lighterShade
  },
});