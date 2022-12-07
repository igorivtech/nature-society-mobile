import * as ImageManipulator from "expo-image-manipulator";
import { CLEANNESS_COLORS, height, isAlt, MAP_BOUNDARY_NORTHEAST, MAP_BOUNDARY_SOUTHWEST, width } from "../values/consts";
import { landscapeImages } from "../values/images";
import { strings } from "../values/strings";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const isLocationInIsrael = (coordinate) => {
  return (
    coordinate.longitude >= MAP_BOUNDARY_SOUTHWEST.longitude &&
    coordinate.longitude <= MAP_BOUNDARY_NORTHEAST.longitude &&
    coordinate.latitude >= MAP_BOUNDARY_SOUTHWEST.latitude &&
    coordinate.latitude <= MAP_BOUNDARY_NORTHEAST.latitude
  );
};

export const getExpoToken = async () => {
  let token;
  if (Device.isDevice) {
    const { status } = await Notifications.getPermissionsAsync();
    //  Permissions.getAsync(
    //   Permissions.NOTIFICATIONS
    // );
    if (status !== "granted") {
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    return null;
  }
  return token;
};

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
  const resizedImage = await ImageManipulator.manipulateAsync(response.uri, [{ resize: { width: newWidth, height: newHeight } }], { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG });
  resizedImage.type = "image";
  return resizedImage;
};

export const objectLength = (object) => {
  if (object === null) {
    return 0;
  }
  return Object.keys(object).length;
};

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const calcPlaceDelta = ({ southWest, northEast }) => {
  const ASPECT_RATIO = width / height;
  const northeastLat = northEast.latitude;
  const southwestLat = southWest.latitude;
  const latitudeDelta = northeastLat - southwestLat;
  const longitudeDelta = latitudeDelta * ASPECT_RATIO;
  return { latitudeDelta, longitudeDelta };
};

export const calcCustomAchievements = async (serverAchievements, userPoints) => {
  let output = [];
  var i;
  let currentSet = false;
  let landscapeIndex = 0;
  let tempLandscapeImages = shuffle([...landscapeImages]);
  for (i = 0; i < serverAchievements.length; i++) {
    if (i % 2 == 0) {
      const bottom = serverAchievements[i];
      const top = serverAchievements[i + 1];
      let item = {
        topDone: userPoints >= top.score,
        bottomDone: userPoints >= bottom.score,
        current: false,
        topTitle: top.title,
        bottomTitle: bottom.title,
        topPoints: top.score,
        bottomPoints: bottom.score,
        landscape: tempLandscapeImages[landscapeIndex++],
      };
      if (!currentSet) {
        if (!item.topDone || !item.bottomDone) {
          item.current = true;
          currentSet = true;
        }
      }
      output = [...output, item];
    }
  }
  output.reverse();
  return output;
};

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

export const convertServerPlaces = (serverPlaces, location, specialSort = false) => {
  let res = [...serverPlaces];

  res.forEach((place, i) => {
    res[i].key = place._id;
    res[i].position = {
      longitude: place.location.coordinates[0],
      latitude: place.location.coordinates[1],
    };
    if (place.title == null || place.title == "" || place.title.trim() === "") {
      res[i].title = "אין שם";
    }
    if (location) {
      const di = distance(place.location.coordinates[1], place.location.coordinates[0], location.latitude, location.longitude);
      if (di < 1) {
        res[i].distance = parseFloat(di.toFixed(1));
      } else {
        res[i].distance = Math.round(Math.round(di * 100) / 100);
      }
    } else {
      res[i].distance = null;
    }
    if (!place.similarReports) {
      res[i].similarReports = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
    }
    //
    res[i].cleanness = place.cleanness;
    res[i].cleannessColor = siteColor(res[i].cleanness);
    //
    res[i].crowdness = place.crowdness;
    res[i].crowdnessColor = siteColor(res[i].crowdness);
    //
    if (!place.image.startsWith("http")) {
      res[i].image = `https://d2hi055ukb5xv2.cloudfront.net/public/images/${place.image}`;
    } else {
      res[i].image = null;
    }
  });

  return res;
};

export const convertSliderValue = (value) => {
  return 1 + 4 * value;
};

export const siteColor = (rating) => {
  return CLEANNESS_COLORS[clamp(1, Math.round(rating), 5)];
};

export const placeLocked = (user, place) => {
  return false;
};

export const specialSortPlaces = (res, location = null) => {
  if (res.length > 2) {
    let newRes = [];
    let notMapped = [...res];
    let currentLocation;
    if (location == null) {
      currentLocation = { ...res[0] };
    } else {
      currentLocation = { position: location };
    }
    let distances = res.map((p) => distancePlaces(p, currentLocation));
    let indexOfMin = distances.indexOf(Math.min(...distances));
    newRes.push(notMapped.splice(indexOfMin, 1)[0]);
    let curr = newRes[0];
    let i;
    for (i = 1; i < res.length; i++) {
      distances = notMapped.map((p) => distancePlaces(p, curr));
      indexOfMin = distances.indexOf(Math.min(...distances));
      curr = notMapped.splice(indexOfMin, 1)[0];
      newRes.push(curr);
    }
    return [...newRes];
  } else {
    return res;
  }
};

const firstNameOnly = (fullName) => {
  const parts = fullName.split(" ");
  return parts[0];
};

function toRad(Value) {
  return (Value * Math.PI) / 180;
}
const distance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var R = 6371; // km
    var dLat = toRad(lat2 - lat1);
    var dLon = toRad(lon2 - lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }
};

const distancePlaces = (p1, p2) => {
  return distance(p1.position.latitude, p1.position.longitude, p2.position.latitude, p2.position.longitude);
};

export const formatRating = (rating, isCleanness) => {
  if (isAlt) {
    const fixedRating = rating >= 4.5 ? 4 : rating;
    if (isCleanness) {
      return strings.reportScreen.cleanTitles[Math.round(fixedRating)];
    } else {
      return strings.reportScreen.crowdTitles[Math.round(fixedRating)];
    }
  } else {
    return rating.toFixed(1);
  }
};

export const getZoomLevelFromRegion = (region) => {
  const { longitudeDelta } = region;
  // Normalize longitudeDelta which can assume negative values near central meridian
  const lngD = (360 + longitudeDelta) % 360;
  // Calculate the number of tiles currently visible in the viewport
  const tiles = width / 256;
  // Calculate the currently visible portion of the globe
  const portion = lngD / 360;
  // Calculate the portion of the globe taken up by each tile
  const tilePortion = portion / tiles;
  // Return the zoom level which splits the globe into that number of tiles
  return Math.log2(1 / tilePortion);
};

const EPSILON = 0.01;
export const mapAtPlace = (mapRegion, place) => {
  return Math.abs(mapRegion.latitude - place.position.latitude) < EPSILON && Math.abs(mapRegion.longitude - place.position.longitude) < EPSILON;
};

export const calcRadius = (region) => {
  return (90 * region.longitudeDelta) / 2;
};
