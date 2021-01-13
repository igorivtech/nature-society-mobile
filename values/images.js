const tempRankImages = [
  {
    on: require("../assets/images/rank_0_on.png"),
    off: require("../assets/images/rank_0_off.png"),
    title: "אוהבי טבע",
    points: 0
  },
  {
    on: require("../assets/images/rank_1_on.png"),
    off: require("../assets/images/rank_1_off.png"),
    title: "אוהבי טבע מתקדמים",
    points: 1
  },
  {
    on: require("../assets/images/rank_2_on.png"),
    off: require("../assets/images/rank_2_off.png"),
    title: "אוהבי טבע מקצוענים",
    points: 3
  },
  {
    on: require("../assets/images/rank_3_on.png"),
    off: require("../assets/images/rank_3_off.png"),
    title: "אוהבי טבע מומחים",
    points: 6
  },
  {
    on: require("../assets/images/rank_4_on.png"),
    off: require("../assets/images/rank_4_off.png"),
    title: "פעילי טבע",
    points: 10
  },
  {
    on: require("../assets/images/rank_5_on.png"),
    off: require("../assets/images/rank_5_off.png"),
    title: "פעילי טבע מתקדמים",
    points: 16
  },
  {
    on: require("../assets/images/rank_6_on.png"),
    off: require("../assets/images/rank_6_off.png"),
    title: "פעילי טבע מקצוענים",
    points: 24
  },
  {
    on: require("../assets/images/rank_7_on.png"),
    off: require("../assets/images/rank_7_off.png"),
    title: "פעילי טבע מומחים",
    points: 34
  },
  {
    on: require("../assets/images/rank_8_on.png"),
    off: require("../assets/images/rank_8_off.png"),
    title: "נאמני טבע",
    points: 44
  },
  {
    on: require("../assets/images/rank_9_on.png"),
    off: require("../assets/images/rank_9_off.png"),
    title: "נאמני טבע מתקדמים",
    points: 56
  },
  {
    on: require("../assets/images/rank_10_on.png"),
    off: require("../assets/images/rank_10_off.png"),
    title: "נאמני טבע מקצוענים",
    points: 68
  },
  {
    on: require("../assets/images/rank_11_on.png"),
    off: require("../assets/images/rank_11_off.png"),
    title: "נאמני טבע מומחים",
    points: 70
  },
  {
    on: require("../assets/images/rank_12_on.png"),
    off: require("../assets/images/rank_12_off.png"),
    title: "שומרי טבע",
    points: 84
  },
  {
    on: require("../assets/images/rank_13_on.png"),
    off: require("../assets/images/rank_13_off.png"),
    title: "שומרי טבע מתקדמים",
    points: 98
  },
  {
    on: require("../assets/images/rank_14_on.png"),
    off: require("../assets/images/rank_14_off.png"),
    title: "שומרי טבע מקצוענים",
    points: 114
  },
  {
    on: require("../assets/images/rank_15_on.png"),
    off: require("../assets/images/rank_15_off.png"),
    title: "שומרי טבע מומחים",
    points: 130
  },
  {
    on: require("../assets/images/rank_16_on.png"),
    off: require("../assets/images/rank_16_off.png"),
    title: "אלופי טבע",
    points: 148
  },
  {
    on: require("../assets/images/rank_17_on.png"),
    off: require("../assets/images/rank_17_off.png"),
    title: "אלופי טבע מתקדמים",
    points: 164
  },
  {
    on: require("../assets/images/rank_18_on.png"),
    off: require("../assets/images/rank_18_off.png"),
    title: "אלופי טבע מקצוענים",
    points: 182
  },
  {
    on: require("../assets/images/rank_19_on.png"),
    off: require("../assets/images/rank_19_off.png"),
    title: "אלופי טבע מומחים",
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
  require("../assets/images/ls_0.png"),
  require("../assets/images/ls_1.png"),
  require("../assets/images/ls_2.png"),
  require("../assets/images/ls_3.png"),
  require("../assets/images/ls_4.png"),
  require("../assets/images/ls_5.png"),
  require("../assets/images/ls_6.png"),
  require("../assets/images/ls_7.png"),
  require("../assets/images/ls_8.png"),
  require("../assets/images/ls_9.png"),
  require("../assets/images/ls_10.png"),
  require("../assets/images/ls_11.png"),
  require("../assets/images/ls_12.png"),
  require("../assets/images/ls_13.png"),
  require("../assets/images/ls_14.png"),
  require("../assets/images/ls_15.png"),
]