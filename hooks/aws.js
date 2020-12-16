import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";

export const uploadImage = async (image, callback) => {
  if (image == null) {
    callback();
    return;
  }
  const fileName = uuidv4();
  const result = image;

  const response = await fetch(result.uri);
  const blob = await response.blob();

  Storage.put(`users/${fileName}`, blob, {
    contentType: image.type,
    ACL: "public-read",
    visibility: "public",
    level: "public",
  })
    .then(() => {
      callback(fileName);
    })
    .catch((error) => {
      callback();
    });
};
