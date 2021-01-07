import { useState, useCallback } from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { DEFAULT_IMAGE_QUALITY } from "../values/consts";
import { resizeImage } from "./helpers";
import { Alert } from "react-native";

export const useImage = () => {
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imagePopupvisible, setPopupVisible] = useState(false);

  const selectImageCamera = useCallback(async () => {
    setLoadingImage(true);
    const { status, permissions } = await Permissions.askAsync(
      Permissions.CAMERA
    );
    if (status === "granted") {
      ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: DEFAULT_IMAGE_QUALITY,
      })
        .then(async (result) => {
          if (!result.cancelled) {
            const resized = await resizeImage(result);
            setImage(resized);
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
      setPopupVisible(true);
    }
  }, []);

  const selectImageGallery = useCallback(async () => {
    setLoadingImage(true);
    const { status, permissions } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    if (status === "granted") {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: DEFAULT_IMAGE_QUALITY,
      })
        .then(async (result) => {
          if (!result.cancelled) {
            const resized = await resizeImage(result);
            setImage(resized);
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
  }, []);

  const selectImage = () => {
    Alert.alert("take image", 'from?', [
      {
        text: 'camera',
        onPress: selectImageCamera
      }, 
      {
        text: 'gallery',
        onPress: selectImageGallery
      }
    ], { cancelable: true })
  }

  return { image, loadingImage, selectImage, selectImageCamera, selectImageGallery, imagePopupvisible, setPopupVisible };
};
