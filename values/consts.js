import { Dimensions } from "react-native";
import Constants from 'expo-constants';

export const statusBarHeight = Constants.statusBarHeight;

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export const NAV_DURATION = 500;
export const NAV_DURATION_CLOSE = 400;

export const NAV_CLOSE_TAP_SIZE = 64;

export const CARD_RADIUS = 24;

// export const recentVisitors = [
//   {name: "איגור", role: "לקט", image: "https://yt3.ggpht.com/ytc/AAUvwngMp380bo6VdFqO0Y81qDqJKsedWvTosxGAAZwp=s900-c-k-c0x00ffffff-no-rj"},
//   {name: "יואב", role: "צייד", image: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"},
// ]

export const INITIAL_REGION = {
  longitude: 34.9916,
  latitude: 31.4561,
  latitudeDelta: 4,
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
  }
}

export const emptyFunc = () => {}

export const THUMB_COLORS = ['#F5B345', '#E8D13F', '#C4E055', '#80E268', '#3EDF7E']
export const CLEANNESS_COLORS = {
  1: THUMB_COLORS[0],
  2: THUMB_COLORS[1],
  3: THUMB_COLORS[2],
  4: THUMB_COLORS[3],
  5: THUMB_COLORS[4],
}

export const DEFAULT_PLACES = [
  {
    locked: false,
    key: "1",
    position: {
      longitude: 23,
      latitude: 52,
      latitudeDelta: 1,
      longitudeDelta: 1,
    },
    title: "בריכת נמרוד",
    distance: 34,
    lastVisitorName: "איגור",
    lastVisitorGender: 0,
    cleanness: 2.4,
    crowdness: 3.6,
    image:
      "https://www.tiuli.com/image/688556e71c5f04e49836a4b756506034.jpg?&width=546&height=400",
    lastVisitorImage: "https://www.w3schools.com/w3images/avatar6.png",
    description:
      "כל היא שעומדת בבסיס הסביבתנות - תנועה פוליטית' חברתית ופילוסופית רחבה ומגוונת שמטרתה להגן על מרכיב הטבע שנותר בסביבה הטבעית' ובמקרים רבים אף לשקם או להרחיב את חלקו של הטבע בסביבה זו. הגנת הסביבה' בהקשר זה' היא הניסיון לשמר מצב של השפעה אנושית מינימלית על הסביבה הטבעית",
  },
  {
    locked: true,
    pointsToUnlock: 10,
    key: "2",
    position: {
      longitude: 3,
      latitude: 5,
      latitudeDelta: 1,
      longitudeDelta: 1,
    },
    title: "מעיין דניאל",
    distance: 34,
    lastVisitorName: "איגור",
    lastVisitorGender: 0,
    cleanness: 4.4,
    crowdness: 3.6,
    image:
      "https://lh3.googleusercontent.com/-H6PacdskbPehw_P3NQvLvIix3PK3gNC82AZXhpFhYm5PVY26CqyHieUp_jifhmYY-FrcezAVQ=w640-h400-e365-rj-sc0x00ffffff",
    lastVisitorImage: "https://www.w3schools.com/w3images/avatar6.png",
    description:
      "כל היא שעומדת בבסיס הסביבתנות - תנועה פוליטית' חברתית ופילוסופית רחבה ומגוונת שמטרתה להגן על מרכיב הטבע שנותר בסביבה הטבעית' ובמקרים רבים אף לשקם או להרחיב את חלקו של הטבע בסביבה זו. הגנת הסביבה' בהקשר זה' היא הניסיון לשמר מצב של השפעה אנושית מינימלית על הסביבה הטבעית",
  },
  {
    locked: false,
    key: "3",
    position: {
      longitude: 13,
      latitude: 12,
      latitudeDelta: 1,
      longitudeDelta: 1,
    },
    title: "בריכת המשושים",
    distance: 34,
    lastVisitorName: "איגור",
    lastVisitorGender: 0,
    cleanness: 4.4,
    crowdness: 3.6,
    image:
      "https://iso.500px.com/wp-content/uploads/2017/10/PhotographingTwilight_TannerWendellStewart-218136823.jpg",
    lastVisitorImage: "https://www.w3schools.com/w3images/avatar6.png",
    description:
      "כל היא שעומדת בבסיס הסביבתנות - תנועה פוליטית' חברתית ופילוסופית רחבה ומגוונת שמטרתה להגן על מרכיב הטבע שנותר בסביבה הטבעית' ובמקרים רבים אף לשקם או להרחיב את חלקו של הטבע בסביבה זו. הגנת הסביבה' בהקשר זה' היא הניסיון לשמר מצב של השפעה אנושית מינימלית על הסביבה הטבעית",
  },
  {
    locked: true,
    pointsToUnlock: 10,
    key: "4",
    position: {
      longitude: 3,
      latitude: 52,
      latitudeDelta: 1,
      longitudeDelta: 1,
    },
    title: "גן העצמאות",
    distance: 34,
    lastVisitorName: "איגור",
    lastVisitorGender: 0,
    cleanness: 4.4,
    crowdness: 3.6,
    image:
      "https://www.rei.com/dam/catskills_060117_003_hero_lg.jpg",
    lastVisitorImage: "https://www.w3schools.com/w3images/avatar6.png",
    description:
      "כל היא שעומדת בבסיס הסביבתנות - תנועה פוליטית' חברתית ופילוסופית רחבה ומגוונת שמטרתה להגן על מרכיב הטבע שנותר בסביבה הטבעית' ובמקרים רבים אף לשקם או להרחיב את חלקו של הטבע בסביבה זו. הגנת הסביבה' בהקשר זה' היא הניסיון לשמר מצב של השפעה אנושית מינימלית על הסביבה הטבעית",
  },
];

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
  achievements: [
    {
      "score": 0,
      "title": "חדש",
    },
    {
      "score": 20,
      "title": "בוטנאי",
    },
    {
      "score": 200,
      "title": "חקלאי",
    },
    {
      "score": 300,
      "title": "גדול",
    },
    {
      "score": 400,
      "title": "קטן",
    },
    {
      "score": 500,
      "title": "ממש",
    },
    {
      "score": 600,
      "title": "דדה",
    },
    {
      "score": 700,
      "title": "בבה",
    },
    {
      "score": 1000,
      "title": "לא",
    },
    {
      "score": 1200,
      "title": "כן",
    },
    {
      "score": 1300,
      "title": "מחר",
    },
    {
      "score": 1400,
      "title": "מחרתיים",
    },
    {
      "score": 1600,
      "title": "אולי",
    },
    {
      "score": 1700,
      "title": "מתישהו",
    },
    {
      "score": 1800,
      "title": "איפשהו",
    },
    {
      "score": 2000,
      "title": "סוף",
    },
  ],
  pointsForUnlock: 10,
  reportPoints: 30,
};

export const SERVER_ACHIEVEMENTS = [
  {title: "חדש", points: 0},
  {title: "חדשה", points: 100},
  {title: "שניים", points: 200},
  {title: "שלושה", points: 300},
  {title: "מלפפון", points: 400},
  {title: "עגבניה", points: 500},
  {title: "מלון", points: 600},
  {title: "ירח", points: 700},
  {title: "חתול", points: 800},
  {title: "מנגינה", points: 900},
  {title: "טחינה", points: 1000},
  {title: "פיצה", points: 1100},
]

export const DEFAULT_ACHIEVEMENTS = [
  {
    topDone: true,
    bottomDone: true,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: true,
    bottomDone: true,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: false,
    bottomDone: true,
    current: true,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: false,
    bottomDone: false,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: false,
    bottomDone: false,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: false,
    bottomDone: false,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: false,
    bottomDone: false,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
  {
    topDone: false,
    bottomDone: false,
    current: false,
    topTitle: 'בוטנאי',
    bottomTitle: 'חקלאית',
    points: 700
  },
]