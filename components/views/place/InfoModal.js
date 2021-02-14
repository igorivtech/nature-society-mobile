import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Modal from 'react-native-modal';
import { colors } from "../../../values/colors";
import { smallScreen, width } from "../../../values/consts";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { globalStyles } from "../../../values/styles";
import { TapView } from "../general";
import { siteColor } from "../../../hooks/helpers";

export const InfoModal = ({ visible, setVisible }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const close = () => {
    setVisible(false);
  };
  useEffect(() => {
    Animated.timing(scale, {
      useNativeDriver: true,
      toValue: visible ? 1 : 0.5,
      easing: Easing.inOut(Easing.ease),
      duration: 300
    }).start();
  }, [visible]);
  return (
    <Modal 
      hideModalContentWhileAnimating={true}
      style={globalStyles.marginZero}
      isVisible={visible} 
      animationIn='fadeIn' 
      animationOut='fadeOut' 
      useNativeDriver={true} 
      onBackButtonPress={close}
      backdropTransitionOutTiming={0}
    >
      <View style={styles.container}>
        <TapView onPress={close} />
        <Animated.View style={styles.card(scale)}>
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
        </Animated.View>
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
    <View style={styles.rankContainer}>
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
      <Text
        style={textStyles.normalOfSize(
          smallScreen ? 14 : 16,
          siteColor(rating)
        )}
      >
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
    borderTopLeftRadius: rating === 5 ? 1.5 : 0,
    borderTopRightRadius: rating === 5 ? 1.5 : 0,
    borderBottomLeftRadius: rating === 1 ? 1.5 : 0,
    borderBottomRightRadius: rating === 1 ? 1.5 : 0,
  }),

  rankContainer: {
    flexGrow: 1,
  },
  ranksContainer: {
    marginTop: smallScreen ? 22 : 36,
    flexDirection: "row",
  },
  iconsContainer: {
    marginTop: 12,
  },
  ratingContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: smallScreen ? 6 : 10,
    height: 42,
  },
  icon: (rating) => ({
    transform: [{ scale: 0.74 }],
    marginLeft: smallScreen ? 0 : 2,
    resizeMode: "contain",
    tintColor: siteColor(rating),
  }),
  title: {
    ...textStyles.boldOfSize(smallScreen ? 20 : 24),
    flex: 1,
    paddingRight: smallScreen ? 4 : 9,
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
  card: (scale) => ({
    transform: [{ scale }],
    paddingHorizontal: smallScreen ? 22 : 27,
    paddingTop: smallScreen ? 22 : 30,
    paddingBottom: smallScreen ? 32 : 45,
    alignItems: "stretch",
    backgroundColor: "white",
    ...globalStyles.shadow,
    borderRadius: 22.5,
    width: width - 2 * 30,
  }),
});
