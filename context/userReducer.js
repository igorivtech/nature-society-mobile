import { DEFAULT_NOTIFICATION, DEFAULT_USER } from "../values/consts";

export const SAVE_USER = "SAVE_USER";
export const SAVE_NOTIFICATION = "SAVE_NOTIFICATION";
export const SAVE_PLACES = "SAVE_PLACES";

export const initialState = {
  token: null,
  // user: null,
  user: null,
  notification: null,
  serverPlaces: [],
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
    default:
      return state;
  }
};
