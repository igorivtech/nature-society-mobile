import { Dimensions } from "react-native";

export const width = Dimensions.get("window").width;
export const height = Dimensions.get("window").height;

export const NAV_DURATION = 500;
export const NAV_DURATION_CLOSE = 400;

export const NAV_CLOSE_TAP_SIZE = 64;

export const CARD_RADIUS = 24;

export const recentVisitors = [
  {name: "איגור", role: "לקט", image: "https://yt3.ggpht.com/ytc/AAUvwngMp380bo6VdFqO0Y81qDqJKsedWvTosxGAAZwp=s900-c-k-c0x00ffffff-no-rj"},
  {name: "יואב", role: "צייד", image: "https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png"},
]


export const DEFAULT_PLACES = [
  {
    locked: false,
    key: "1",
    location: [23, 52],
    title: "בריכת נמרוד",
    distance: 34,
    lastVisitorName: "איגור",
    lastVisitorGender: 0,
    cleanness: 4.4,
    crowdness: 3.6,
    image:
      "https://www.tiuli.com/image/688556e71c5f04e49836a4b756506034.jpg?&width=546&height=400",
    lastVisitorImage: "https://www.w3schools.com/w3images/avatar6.png",
    description:
      "כל היא שעומדת בבסיס הסביבתנות - תנועה פוליטית' חברתית ופילוסופית רחבה ומגוונת שמטרתה להגן על מרכיב הטבע שנותר בסביבה הטבעית' ובמקרים רבים אף לשקם או להרחיב את חלקו של הטבע בסביבה זו. הגנת הסביבה' בהקשר זה' היא הניסיון לשמר מצב של השפעה אנושית מינימלית על הסביבה הטבעית",
  },
  {
    locked: true,
    key: "2",
    location: [3, 5],
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
    location: [13, 12],
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
    key: "4",
    location: [3, 52],
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
  // image: require("../assets/images/notification_icon_outline.png"),
  image: require("../assets/images/yahmur_icon.png"),
  points: 10
}

export const DEFAULT_USER = {
  name: "יעל השכנה",
  email: "yael@nextdoor",
  image:
    "https://cdn.iconscout.com/icon/premium/png-256-thumb/woman-avatar-1543937-1371628.png",
  points: 630,
  numOfReports: 31,
  lastAchievement: "חקלאית",
  achievements: [
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

}