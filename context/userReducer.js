import { DEFAULT_NOTIFICATION, DEFAULT_SETTINGS } from "../values/consts";

export const SAVE_SETTINGS = "SAVE_SETTINGS";
export const SAVE_TOKEN = "SAVE_TOKEN";
export const SAVE_USER = "SAVE_USER";
export const SAVE_OFFLINE_USER = "SAVE_OFFLINE_USER";
export const SAVE_NOTIFICATION = "SAVE_NOTIFICATION";
export const SAVE_PLACES = "SAVE_PLACES";
export const SAVE_DEEP_LINK_ID = "SAVE_DEEP_LINK_ID";
export const ASK_PUSH = "ASK_PUSH";

export const initialState = {
  token: null,
  user: null,
  offlineUser: {
    points: 50,
    numOfReports: 0,
  },
  notification: null,
  deepLinkId: null,
  serverPlaces: [],
  settings: DEFAULT_SETTINGS,
  askPush: false,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SAVE_OFFLINE_USER:
      return {
        ...state,
        offlineUser: action.payload,
      };
    case SAVE_NOTIFICATION:
      return {
        ...state,
        notification: action.payload,
      };
    case SAVE_PLACES:
      return {
        ...state,
        serverPlaces: action.payload,
      };
    case SAVE_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SAVE_SETTINGS:
      return {
        ...state,
        settings: action.payload,
      };
    case ASK_PUSH:
      return {
        ...state,
        askPush: action.payload,
      };
    case SAVE_DEEP_LINK_ID:
      return {
        ...state,
        deepLinkId: action.payload
      }
    default:
      return state;
  }
};
