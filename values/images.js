const tempRankImages = [
  {
    on: require("../assets/images/rank_0_on.png"),
    off: require("../assets/images/rank_0_off.png"),
    title: "אוהב טבע"
  },
  {
    on: require("../assets/images/rank_1_on.png"),
    off: require("../assets/images/rank_1_off.png"),
    title: "אוהב טבע מתקדם"
  },
  {
    on: require("../assets/images/rank_2_on.png"),
    off: require("../assets/images/rank_2_off.png"),
    title: "אוהב טבע מקצוען"
  },
  {
    on: require("../assets/images/rank_3_on.png"),
    off: require("../assets/images/rank_3_off.png"),
    title: "אוהב טבע מומחה"
  },
  {
    on: require("../assets/images/rank_4_on.png"),
    off: require("../assets/images/rank_4_off.png"),
    title: "פעיל טבע"
  },
  {
    on: require("../assets/images/rank_5_on.png"),
    off: require("../assets/images/rank_5_off.png"),
    title: "פעיל טבע מתקדם"
  },
  {
    on: require("../assets/images/rank_6_on.png"),
    off: require("../assets/images/rank_6_off.png"),
    title: "פעיל טבע מקצוען"
  },
  {
    on: require("../assets/images/rank_7_on.png"),
    off: require("../assets/images/rank_7_off.png"),
    title: "פעיל טבע מומחה"
  },
  {
    on: require("../assets/images/rank_8_on.png"),
    off: require("../assets/images/rank_8_off.png"),
    title: "נאמן טבע"
  },
  {
    on: require("../assets/images/rank_9_on.png"),
    off: require("../assets/images/rank_9_off.png"),
    title: "נאמן טבע מתקדם"
  },
  {
    on: require("../assets/images/rank_10_on.png"),
    off: require("../assets/images/rank_10_off.png"),
    title: "נאמן טבע מקצוען"
  },
  {
    on: require("../assets/images/rank_11_on.png"),
    off: require("../assets/images/rank_11_off.png"),
    title: "נאמן טבע מומחה"
  },
  {
    on: require("../assets/images/rank_12_on.png"),
    off: require("../assets/images/rank_12_off.png"),
    title: "שומר טבע"
  },
  {
    on: require("../assets/images/rank_13_on.png"),
    off: require("../assets/images/rank_13_off.png"),
    title: "שומר טבע מתקדם"
  },
  {
    on: require("../assets/images/rank_14_on.png"),
    off: require("../assets/images/rank_14_off.png"),
    title: "שומר טבע מקצוען"
  },
  {
    on: require("../assets/images/rank_15_on.png"),
    off: require("../assets/images/rank_15_off.png"),
    title: "שומר טבע מומחה"
  },
  {
    on: require("../assets/images/rank_16_on.png"),
    off: require("../assets/images/rank_16_off.png"),
    title: "לוחם טבע"
  },
  {
    on: require("../assets/images/rank_17_on.png"),
    off: require("../assets/images/rank_17_off.png"),
    title: "לוחם טבע מתקדם"
  },
  {
    on: require("../assets/images/rank_18_on.png"),
    off: require("../assets/images/rank_18_off.png"),
    title: "לוחם טבע מקצוען"
  },
  {
    on: require("../assets/images/rank_19_on.png"),
    off: require("../assets/images/rank_19_off.png"),
    title: "לוחם טבע מומחה"
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

export const rankImages = tempRankImages.map((item, index) => ({
  on: {
    image: item.on,
    size: imageSize(index, true)
  },
  off: {
    image: item.off,
    size: imageSize(index, false)
  },
}));
