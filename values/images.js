const tempRankImages = [
  {
    on: require("../assets/images/rank_0_on.png"),
    off: require("../assets/images/rank_0_off.png"),
    title: "אוהב טבע",
    points: 0
  },
  {
    on: require("../assets/images/rank_1_on.png"),
    off: require("../assets/images/rank_1_off.png"),
    title: "אוהב טבע מתקדם",
    points: 100
  },
  {
    on: require("../assets/images/rank_2_on.png"),
    off: require("../assets/images/rank_2_off.png"),
    title: "אוהב טבע מקצוען",
    points: 200
  },
  {
    on: require("../assets/images/rank_3_on.png"),
    off: require("../assets/images/rank_3_off.png"),
    title: "אוהב טבע מומחה",
    points: 300
  },
  {
    on: require("../assets/images/rank_4_on.png"),
    off: require("../assets/images/rank_4_off.png"),
    title: "פעיל טבע",
    points: 400
  },
  {
    on: require("../assets/images/rank_5_on.png"),
    off: require("../assets/images/rank_5_off.png"),
    title: "פעיל טבע מתקדם",
    points: 500
  },
  {
    on: require("../assets/images/rank_6_on.png"),
    off: require("../assets/images/rank_6_off.png"),
    title: "פעיל טבע מקצוען",
    points: 600
  },
  {
    on: require("../assets/images/rank_7_on.png"),
    off: require("../assets/images/rank_7_off.png"),
    title: "פעיל טבע מומחה",
    points: 700
  },
  {
    on: require("../assets/images/rank_8_on.png"),
    off: require("../assets/images/rank_8_off.png"),
    title: "נאמן טבע",
    points: 800
  },
  {
    on: require("../assets/images/rank_9_on.png"),
    off: require("../assets/images/rank_9_off.png"),
    title: "נאמן טבע מתקדם",
    points: 900
  },
  {
    on: require("../assets/images/rank_10_on.png"),
    off: require("../assets/images/rank_10_off.png"),
    title: "נאמן טבע מקצוען",
    points: 1000
  },
  {
    on: require("../assets/images/rank_11_on.png"),
    off: require("../assets/images/rank_11_off.png"),
    title: "נאמן טבע מומחה",
    points: 1100
  },
  {
    on: require("../assets/images/rank_12_on.png"),
    off: require("../assets/images/rank_12_off.png"),
    title: "שומר טבע",
    points: 1200
  },
  {
    on: require("../assets/images/rank_13_on.png"),
    off: require("../assets/images/rank_13_off.png"),
    title: "שומר טבע מתקדם",
    points: 1300
  },
  {
    on: require("../assets/images/rank_14_on.png"),
    off: require("../assets/images/rank_14_off.png"),
    title: "שומר טבע מקצוען",
    points: 1400
  },
  {
    on: require("../assets/images/rank_15_on.png"),
    off: require("../assets/images/rank_15_off.png"),
    title: "שומר טבע מומחה",
    points: 1500
  },
  {
    on: require("../assets/images/rank_16_on.png"),
    off: require("../assets/images/rank_16_off.png"),
    title: "לוחם טבע",
    points: 1600
  },
  {
    on: require("../assets/images/rank_17_on.png"),
    off: require("../assets/images/rank_17_off.png"),
    title: "לוחם טבע מתקדם",
    points: 1700
  },
  {
    on: require("../assets/images/rank_18_on.png"),
    off: require("../assets/images/rank_18_off.png"),
    title: "לוחם טבע מקצוען",
    points: 1800
  },
  {
    on: require("../assets/images/rank_19_on.png"),
    off: require("../assets/images/rank_19_off.png"),
    title: "לוחם טבע מומחה",
    points: 1900
  },
];

const imageSize = (index, on) => {
  let height = on ? 58.5 : 30;
  let width = on ? 70 : 35;
  if (index < 4) {
    height = on ? 58.5 : 30;
    width = on ? 70 : 35;
  } else if (index < 8) {
    height = on ? 65 : 30;
    width = on ? 78 : 35;
  } else if (index < 12) {
    height = on ? 70 : 35;
    width = on ? 70 : 35;
  } else if (index < 16) {
    height = on ? 80 : 35;
    width = on ? 70 : 30;
  } else if (index < 20) {
    height = on ? 70 : 35;
    width = on ? 62 : 31;
  }
  return {
    height,
    width,
  };
};

let tt = tempRankImages.map((item, index) => ({
  on: {
    image: item.on,
    size: imageSize(index, true),
    title: item.title,
    points: item.points
  },
  off: {
    image: item.off,
    size: imageSize(index, false),
    title: item.title,
    points: item.points
  },
}));

tt.reverse();

export const rankImages = tt;
