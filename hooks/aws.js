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
      callback(`https://naturesocietyd770eeed1aeb4e34ba859038a344c121174124-prod.s3.eu-central-1.amazonaws.com/public/users/${fileName}`);
    })
    .catch((error) => {
      callback();
    });
};
