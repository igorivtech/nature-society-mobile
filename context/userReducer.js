import { DEFAULT_NOTIFICATION, DEFAULT_SETTINGS } from "../values/consts";

export const SAVE_SETTINGS = "SAVE_SETTINGS";
export const SAVE_TOKEN = "SAVE_TOKEN";
export const SAVE_USER = "SAVE_USER";
export const SAVE_NOTIFICATION = "SAVE_NOTIFICATION";
export const SAVE_PLACES = "SAVE_PLACES";
export const SAVE_ACHIEVEMENTS = "SAVE_ACHIEVEMENTS";

export const initialState = {
  token: null,
  // user: null,
  user: null,
  notification: null,
  serverPlaces: [],
  serverAchievements: [],
  settings: DEFAULT_SETTINGS
  // fetchingUser: false,
  // pushToken: null,
  // isSignout: false,
  // pushOn: null,
  // liveUpdatesOn: false
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SAVE_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case SAVE_PLACES:
      return {
        ...state,
        serverPlaces: action.payload
      };
    case SAVE_TOKEN:
      return {
        ...state,
        token: action.payload
      }
    case SAVE_ACHIEVEMENTS:
      return {
        ...state,
        serverAchievements: action.payload
      }
    case SAVE_SETTINGS:
      return {
        ...state,
        settings: action.payload
      }
    default:
      return state;
  }
};
