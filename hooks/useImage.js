import { useState, useCallback } from "react";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import { DEFAULT_IMAGE_QUALITY } from "../values/consts";
import { resizeImage } from "./helpers";
import { useActionSheet } from '@expo/react-native-action-sheet'
import {colors} from '../values/colors'
// import {textStyles} from '../values/textStyles'

const options = [
  'מצלמה', 
  'גלריה', 
  'ביטול'
];

export const useImage = () => {
  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imagePopupvisible, setPopupVisible] = useState(false);
  const { showActionSheetWithOptions } = useActionSheet();

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
      setPopupVisible(true);
    }
  }, []);

  const selectImage = () => {
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
        tintColor: colors.treeBlues,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          selectImageCamera();
        } else if (buttonIndex === 1) {
          selectImageGallery();
        }
      }
    )
  }

  return { image, setImage, loadingImage, setLoadingImage, selectImage, selectImageCamera, selectImageGallery, imagePopupvisible, setPopupVisible };
};
