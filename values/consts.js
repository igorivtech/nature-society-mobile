import { Dimensions, Platform } from "react-native";
import Constants from 'expo-constants';
import { rankImages } from "./images";

export const statusBarHeight = Constants.statusBarHeight;

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;
export const pureHeight = height - Constants.statusBarHeight;
export const safeAreaHeight = Constants.statusBarHeight;

export const SPLASH_HIDE_DELAY = 1000;

export const SCREEN_ASPECT_RATIO = height/width;

export const smallScreen = height < 667;

export const NAV_DURATION = 500;
export const NAV_DURATION_CLOSE = 400;

export const WHITE_LIST_APPS = ['google-maps', 'apple-maps', 'waze'];

export const TOP_BUTTONS_CONTAINER_WIDTH = smallScreen ? 0.75 : 0.7

export const NAV_CLOSE_TAP_SIZE = 64;

export const CARD_RADIUS = 24;

const releaseChannel = Constants.manifest.releaseChannel;
export const isAlt = true; // releaseChannel === 'alt';

export const isStandalone = Constants.appOwnership === 'standalone'

export const isAndroid = Platform.OS === 'android';

export const keyboardAwareBehaviour = Platform.OS === "ios" ? "padding" : "height";

// export const recentVisitors = [
//   {name: "איגור", role: "לקט", image: "https://yt3.ggpht.com/ytc/AAUvwngMp380bo6VdFqO0Y81qDqJKsedWvTosxGAAZwp=s900-c-k-c0x00ffffff-no-rj"},
//   {name: "יואב", role: "צייד", image: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"},
// ]

export const MAP_BOUNDARY_NORTHEAST = {
  longitude: 36.084697,
  latitude: 33.435642
}

export const MAP_BOUNDARY_SOUTHWEST = {
  longitude: 33.960871,
  latitude: 29.291052
}
export const MAP_MIN_ZOOM = 8;
export const INITIAL_REGION = {
  longitude: 34.9916,
  latitude: 31.4561,
  latitudeDelta: 2*SCREEN_ASPECT_RATIO,
  longitudeDelta: 2,
}

export const errors = {
  shortPassword: {
    code: "short_password"
  },
  enterCode: {
    code: "enter_code"
  },
  enterName: {
    code: "enter_name"
  },
  invalidEmail: {
    code: "invalid_email"
  },
  reportNotLoggedIn: {
    code: "report_lot_logged_in"
  }
}

export const emptyFunc = () => {}

export const THUMB_COLORS = ['#F5B345', '#E8D13F', '#BCD84B', '#80E268', '#3EDF7E']
export const CLEANNESS_COLORS = {
  1: THUMB_COLORS[0],
  2: THUMB_COLORS[1],
  3: THUMB_COLORS[2],
  4: THUMB_COLORS[3],
  5: THUMB_COLORS[4],
}

export const DEFAULT_NOTIFICATION = {
  title: "יחמור פרסי",
  description: 'התרומה שלך לשמירה על הטבע הצילה יחמור פרסי מצוי.',
  points: 10,
  type: 'user', // 'animal_y', 'tip', 'user'
  user: {
    pic: 'https://roneringa.com/wp-content/uploads/2016/06/Scribe-300x300.jpg',
    name: 'דורון שלום',
    points: 19,
    role: 'לקט'
  }
}

export const DEFAULT_IMAGE_QUALITY = 0.5;

export const DEFAULT_SETTINGS = {
  achievements: [...rankImages].reverse().map(item=>({
    "score": item.on.points,
    "title": item.on.title
  })),
  pointsForUnlock: 10,
  reportPoints: 100,
};

