export const SAVE_USER = "SAVE_USER";

export const initialState = {
  token: null,
  // user: null,
  user: {
    name: "יעל השכנה",
    email: "yael@nextdoor",
    image:
      "https://cdn.iconscout.com/icon/premium/png-256-thumb/woman-avatar-1543937-1371628.png",
    points: 630,
    numOfReports: 21,
    lastAchievement: "חקלאית",
    achievements: [
      {
        done: false,
        current: false
      },
      {
        done: false,
        current: false
      },
      {
        done: false,
        current: false
      },
      {
        done: false,
        current: true
      },
      {
        done: true,
        current: false
      },
      {
        done: true,
        current: false
      },
      {
        done: true,
        current: false
      },
      {
        done: true,
        current: false
      },
    ]

  },
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
