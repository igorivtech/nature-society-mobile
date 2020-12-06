import { DEFAULT_USER } from "../values/consts";

export const SAVE_USER = "SAVE_USER";

export const initialState = {
  token: null,
  // user: null,
  user: DEFAULT_USER,
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
    default:
      return state;
  }
};
