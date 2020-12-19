import * as ImageManipulator from "expo-image-manipulator";

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