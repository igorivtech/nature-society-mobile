import * as ImageManipulator from "expo-image-manipulator";
import { height, width } from "../values/consts";

export const clamp = (min, value, max) => {
  if (value < min) {
    return min;
  } else if (value > max) {
    return max;
  } else {
    return value;
  }
};

const imageMaxSize = 1080;
const newImageSize = (image) => {
  let newWidth;
  let newHeight;
  if (image.height <= image.width) {
    // width larger
    newWidth = imageMaxSize;
    newHeight = imageMaxSize * (image.height / image.width);
  } else {
    // height larger
    newHeight = imageMaxSize;
    newWidth = imageMaxSize * (image.width / image.height);
  }
  return { newWidth, newHeight };
};

export const resizeImage = async (response) => {
  const { newWidth, newHeight } = newImageSize(response);
  const resizedImage = await ImageManipulator.manipulateAsync(
    response.uri,
    [{ resize: { width: newWidth, height: newHeight } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  resizedImage.type = "image";
  return resizedImage;
};

export const objectLength = (object) => {
  return Object.keys(object).length;
}

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const calcPlaceDelta = ({southWest, northEast}) => {
    const ASPECT_RATIO = width / height;
    const northeastLat = northEast.latitude;
    const southwestLat = southWest.latitude;
    const latitudeDelta = northeastLat - southwestLat;
    const longitudeDelta = latDelta * ASPECT_RATIO;
    return {latitudeDelta, longitudeDelta}
}

export const calcCustomAchievements = (serverAchievements, userPoints) => {
  let output = [];
  var i;
  let currentSet = false;
  for (i = 0; i < serverAchievements.length; i++) { 
    if (i % 2 == 0) {
      const bottom = serverAchievements[i];
      const top = serverAchievements[i+1];
      let item = {
        topDone: userPoints >= top.points,
        bottomDone: userPoints >= bottom.points,
        current: false,
        topTitle: top.title,
        bottomTitle: bottom.title,
        topPoints: top.points,
        bottomPoints: bottom.points,
      }
      if (!currentSet) {
        if (!item.topDone || !item.bottomDone) {
          item.current = true;
          currentSet = true;
        }
      }
      output = [...output, item];
    }
  }
  return output
}