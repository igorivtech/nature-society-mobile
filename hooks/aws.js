import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { Storage } from "aws-amplify";
import { useContext } from "react";
import { UserContext } from "../context/context";
import {BASE_URL} from './useServer'

export const useUploadImage = () => {
  
  const {state} = useContext(UserContext);
  const {user} = state;

  const uploadImage = async (image, callback) => {
    if (image == null || (user != null && user.image === image.uri)) {
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

  return {uploadImage}
  
}

export const uploadImageAsync = async (token, reportId, image) => {
  if (image == null || token == null || reportId == null) {
    return;
  }
  try {
    const fileName = uuidv4();
    const result = image;
    const response = await fetch(result.uri);
    const blob = await response.blob();
    await Storage.put(`users/${fileName}`, blob, {
      contentType: image.type,
      ACL: "public-read",
      visibility: "public",
      level: "public",
    })
    const url = `https://naturesocietyd770eeed1aeb4e34ba859038a344c121174124-prod.s3.eu-central-1.amazonaws.com/public/users/${fileName}`;
    await fetch(`${BASE_URL}/editReport`, {
      method: "PATCH",
      body: JSON.stringify({
        id: reportId,
        image: url
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: token ?? 'guest'
      }
    });
  } catch (err) {console.error(err)}
}