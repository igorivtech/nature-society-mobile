import React, { useEffect } from "react";
import { Image, Modal, StyleSheet, Text, View } from "react-native";
import { colors } from "../../../values/colors";
import { width } from "../../../values/consts";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { globalStyles } from "../../../values/styles";
import { TapView } from "../general";
import { siteColor } from "../../../hooks/helpers";

export const InfoModal = ({ visible, setVisible }) => {
  const close = () => {
    setVisible(false);
  };
  return (
    <Modal visible={visible} animationType="fade">
      <View style={styles.container}>
        <TapView onPress={close} />
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{strings.placeScreen.infoTitle}</Text>
            <Image
              style={globalStyles.imageJustContain}
              source={require("../../../assets/images/info_icon_large.png")}
            />
          </View>
          <Text style={textStyles.normalOfSize(18)}>
            {strings.placeScreen.infoDesc}
          </Text>
          <Ranks />
        </View>
      </View>
    </Modal>
  );
};

const Ranks = () => {
  return (
    <View style={styles.ranksContainer}>
      <Rank cleanness={false} />
      <Rank cleanness={true} />
    </View>
  );
};

const Rank = ({ cleanness }) => {
  return (
    <View style={styles.rankContainer(cleanness)}>
      <Text style={textStyles.normalOfSize(14)}>
        {strings.placeScreen.ranksTitle(cleanness)}
      </Text>
      <Icons cleanness={cleanness} />
    </View>
  );
};

const Icons = ({ cleanness }) => {
  return (
    <View style={styles.iconsContainer}>
      {[5, 4, 3, 2, 1].map((rating) => (
        <Rating key={rating.toString()} cleanness={cleanness} rating={rating} />
      ))}
    </View>
  );
};

const Rating = ({ cleanness, rating }) => {
  return (
    <View style={styles.ratingContainer}>
      <View style={styles.bar(rating)} />
      <Text style={textStyles.normalOfSize(16, siteColor(rating))}>
        {cleanness
          ? strings.reportScreen.cleanTitles[rating - 1]
          : strings.reportScreen.crowdTitles[rating - 1]}
      </Text>
      <Image
        style={styles.icon(rating)}
        source={
          cleanness
            ? require("../../../assets/images/HeartL.png")
            : require("../../../assets/images/HowBusyL.png")
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bar: (rating) => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    width: 3,
    backgroundColor: siteColor(rating),
  }),

  rankContainer: (cleanness) => ({
    flexGrow: 1,
    // backgroundColor: cleanness ? "#f002" : "#0f02",
  }),
  ranksContainer: {
    marginTop: 36,
    // backgroundColor: "#f002",
    flexDirection: "row",
  },
  iconsContainer: {
    marginTop: 12,
  },
  ratingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 10,
    height: 42,
  },
  icon: (rating) => ({
    transform: [{ scale: 0.8 }],
    marginLeft: 6,
    resizeMode: "contain",
    tintColor: siteColor(rating),
  }),
  title: {
    ...textStyles.boldOfSize(24),
    flex: 1,
    paddingRight: 9,
  },
  titleContainer: {
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    paddingHorizontal: 27,
    paddingTop: 30,
    paddingBottom: 45,
    alignItems: "stretch",
    backgroundColor: "white",
    ...globalStyles.shadow,
    borderRadius: 22.5,
    width: width - 2 * 30,
  },
});
