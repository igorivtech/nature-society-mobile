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
    points: 1
  },
  {
    on: require("../assets/images/rank_2_on.png"),
    off: require("../assets/images/rank_2_off.png"),
    title: "אוהב טבע מקצוען",
    points: 3
  },
  {
    on: require("../assets/images/rank_3_on.png"),
    off: require("../assets/images/rank_3_off.png"),
    title: "אוהב טבע מומחה",
    points: 6
  },
  {
    on: require("../assets/images/rank_4_on.png"),
    off: require("../assets/images/rank_4_off.png"),
    title: "פעיל טבע",
    points: 10
  },
  {
    on: require("../assets/images/rank_5_on.png"),
    off: require("../assets/images/rank_5_off.png"),
    title: "פעיל טבע מתקדם",
    points: 16
  },
  {
    on: require("../assets/images/rank_6_on.png"),
    off: require("../assets/images/rank_6_off.png"),
    title: "פעיל טבע מקצוען",
    points: 24
  },
  {
    on: require("../assets/images/rank_7_on.png"),
    off: require("../assets/images/rank_7_off.png"),
    title: "פעיל טבע מומחה",
    points: 34
  },
  {
    on: require("../assets/images/rank_8_on.png"),
    off: require("../assets/images/rank_8_off.png"),
    title: "נאמן טבע",
    points: 44
  },
  {
    on: require("../assets/images/rank_9_on.png"),
    off: require("../assets/images/rank_9_off.png"),
    title: "נאמן טבע מתקדם",
    points: 56
  },
  {
    on: require("../assets/images/rank_10_on.png"),
    off: require("../assets/images/rank_10_off.png"),
    title: "נאמן טבע מקצוען",
    points: 68
  },
  {
    on: require("../assets/images/rank_11_on.png"),
    off: require("../assets/images/rank_11_off.png"),
    title: "נאמן טבע מומחה",
    points: 70
  },
  {
    on: require("../assets/images/rank_12_on.png"),
    off: require("../assets/images/rank_12_off.png"),
    title: "שומר טבע",
    points: 84
  },
  {
    on: require("../assets/images/rank_13_on.png"),
    off: require("../assets/images/rank_13_off.png"),
    title: "שומר טבע מתקדם",
    points: 98
  },
  {
    on: require("../assets/images/rank_14_on.png"),
    off: require("../assets/images/rank_14_off.png"),
    title: "שומר טבע מקצוען",
    points: 114
  },
  {
    on: require("../assets/images/rank_15_on.png"),
    off: require("../assets/images/rank_15_off.png"),
    title: "שומר טבע מומחה",
    points: 130
  },
  {
    on: require("../assets/images/rank_16_on.png"),
    off: require("../assets/images/rank_16_off.png"),
    title: "לוחם טבע",
    points: 148
  },
  {
    on: require("../assets/images/rank_17_on.png"),
    off: require("../assets/images/rank_17_off.png"),
    title: "לוחם טבע מתקדם",
    points: 164
  },
  {
    on: require("../assets/images/rank_18_on.png"),
    off: require("../assets/images/rank_18_off.png"),
    title: "לוחם טבע מקצוען",
    points: 182
  },
  {
    on: require("../assets/images/rank_19_on.png"),
    off: require("../assets/images/rank_19_off.png"),
    title: "לוחם טבע מומחה",
    points: 200
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


export const landscapeImages = [
  require("../assets/images/ls_0"),
  require("../assets/images/ls_1"),
  require("../assets/images/ls_2"),
  require("../assets/images/ls_3"),
  require("../assets/images/ls_4"),
  require("../assets/images/ls_5"),
  require("../assets/images/ls_6"),
  require("../assets/images/ls_7"),
  require("../assets/images/ls_8"),
  require("../assets/images/ls_9"),
  require("../assets/images/ls_10"),
  require("../assets/images/ls_11"),
  require("../assets/images/ls_12"),
  require("../assets/images/ls_13"),
  require("../assets/images/ls_14"),
  require("../assets/images/ls_15"),
]