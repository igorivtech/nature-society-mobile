import * as ImageManipulator from "expo-image-manipulator";
import { CLEANNESS_COLORS, height, width } from "../values/consts";

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
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;
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
        topDone: userPoints >= top.score,
        bottomDone: userPoints >= bottom.score,
        current: false,
        topTitle: top.title,
        bottomTitle: bottom.title,
        topPoints: top.score,
        bottomPoints: bottom.score,
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

export const convertServerPlaces = (serverPlaces, location) => {

  let res = [...serverPlaces];

  res.forEach((place, i) => {
    res[i].key = place._id;
    const {longitudeDelta, latitudeDelta} = calcPlaceDelta({
      southWest: place.southwest[0],
      northEast: place.northeast[0]
    })
    res[i].position = {
      longitude: place.location.coordinates[0],
      latitude: place.location.coordinates[1],
      latitudeDelta: latitudeDelta+0.5,
      longitudeDelta: longitudeDelta+0.5,
    }
    if (place.title.trim() === "") {
      res[i].title = "אין שם";
    }
    if (location) {
      const di = distance(place.location.coordinates[1], place.location.coordinates[0], location.latitude, location.longitude);
      res[i].distance = Math.round(Math.round((di) * 100) / 100);
    } else {
      res[i].distance = null;
    }
    //
    if (place.cleanesss === 0) {
      res[i].cleanness = Math.round(10*clamp(1, 5*Math.random(), 5))/10;
    }
    res[i].cleannessColor = siteColor(res[i].cleanness);
    if (place.cleanesss === 0) {
      res[i].crowdness = Math.round(10*clamp(1, 5*Math.random(), 5))/10;
    }
    res[i].crowdnessColor = siteColor(res[i].crowdness);
  })

  if (location) {
    res.sort((p1, p2) => p1.distance > p2.distance);
  }

  return res
}

export const convertSliderValue = (value) => {
  return 1 + 4*value;
}

const siteColor = (rating) => {
  return CLEANNESS_COLORS[clamp(1, Math.round(rating), 5)]
}

export const placeLocked = (user, place) => {
  if (user == null) {
    return true;
  }
  const unlockedPlaces = user.unlockedPlaces;
  return unlockedPlaces[place._id] == null
}

const firstNameOnly = (fullName) => {
  const parts = fullName.split(' ');
  return parts[0];
  // if (parts.length === 1) {
  //   return parts[0];
  // } else {
  //   const firstChar = parts[parts.length - 1].substring(0, 1).trim();
  //   if (firstChar.length === 0) {
  //     return `${parts[0]}.`
  //   } else {
  //     return `${parts[0]} ${firstChar}.`
  //   }
  // }
}

// {
//   image:
//     "https://www.rei.com/dam/catskills_060117_003_hero_lg.jpg",
//   lastVisitorImage: "https://www.w3schools.com/w3images/avatar6.png",
//   description:
//     "כל היא שעומדת בבסיס הסביבתנות - תנועה פוליטית' חברתית ופילוסופית רחבה ומגוונת שמטרתה להגן על מרכיב הטבע שנותר בסביבה הטבעית' ובמקרים רבים אף לשקם או להרחיב את חלקו של הטבע בסביבה זו. הגנת הסביבה' בהקשר זה' היא הניסיון לשמר מצב של השפעה אנושית מינימלית על הסביבה הטבעית",
// },

// Object {
//   "_id": "5fde3850eb3a77cdb6579e4e",
//   "cleanesss": 0,
//   "crowdness": 0,
//   "description": "מקום ממש טוב",
//   "dis": 8865.925634581798,
//   "image": "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg",
//   "lastVisitors": Array [
//     Object {
//       "lastVisitorImage": "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
//       "lastVisitorName": "נא בא",
//       "lastVisitorRank": 400,
//     },
//     Object {
//       "lastVisitorImage": "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
//       "lastVisitorName": "בן אדם",
//       "lastVisitorRank": 900,
//     },
//     Object {
//       "lastVisitorImage": "https://cdn.jpegmini.com/user/images/slider_puffin_before_mobile.jpg",
//       "lastVisitorName": "בת אדם",
//       "lastVisitorRank": 100,
//     },
//   ],
//   "location": Object {
//     "coordinates": Array [
//       35.3995774218733,
//       31.509952863146665,
//     ],
//     "type": "Point",
//   },
//   "northeast": Array [
//     Object {
//       "latitude": 31.512768978305747,
//       "longitude": 35.40287565291429,
//     },
//   ],
//   "similarReports": Array [
//     Object {
//       "1": 23,
//     },
//     Object {
//       "2": 83,
//     },
//     Object {
//       "3": 41,
//     },
//     Object {
//       "4": 53,
//     },
//     Object {
//       "5": 32,
//     },
//   ],
//   "southwest": Array [
//     Object {
//       "latitude": 31.50713674798758,
//       "longitude": 35.39627919083232,
//     },
//   ],
//   "title": " ",
//   "type": " ",
// },

const distance = (lat1, lon1, lat2, lon2) => {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		// if (unit=="K") { dist = dist * 1.609344 }
    // if (unit=="N") { dist = dist * 0.8684 }
    dist = dist * 1.609344
		return Math.round(dist * 100) / 100;
	}
}