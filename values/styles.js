import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { width, height } from "./consts";

export const styles = StyleSheet.create({
  mapStyle: {
    position: "absolute",
    width: width,
    height: height,
  },
  centerChildren: {
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  homeContainer: {
    flex: 1,
  },

  fullWidth: {
    width: '100%'
  },

  marginLeft: (margin) => ({
    marginLeft: margin
  }),

  safeAreaContainer: {
    justifyContent: "space-between",
    flex: 1,
  },

  onboardingContainer: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },

  onboardingButtonsContainer: {
    width: "80%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  onboardingMainContainer: {
    top: height / 2 - 60,
    position: "absolute",
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  halfLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: width / 2,
  },

  fillParent: {
    height: "100%",
    width: "100%",
  },

  homeTopContainer: {
    flexDirection: "row",
    paddingHorizontal: 64,
    justifyContent: "space-between",
    marginTop: 20,
  },

  mainCardContainer: (translateY) => ({
    padding: 3,
    borderRadius: 15,
    flexDirection: "row",
    marginHorizontal: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    transform: [{ translateY }],
  }),

  cardDetailsContainer: {
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 10,
    height: "100%",
    // backgroundColor: "red",
    flex: 1,
  },

  cardLocationContainer: {
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: "cyan",
    justifyContent: "flex-end",
  },

  mainListContainer: {
    paddingBottom: 8,
  },

  mainListStyle: (paddingTop, yTranslate) => ({
    paddingTop,
    transform: [{ translateY: yTranslate }],
    flexGrow: 0,
  }),

  cardMainImage: {
    resizeMode: 'cover',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    width: "33%",
    height: "100%",
    backgroundColor: "#ccc",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  spacer: (size) => ({
    width: size,
    height: size,
  }),

  cardDetailIcon: {
    marginLeft: 8,
    width: 22,
  },

  cardVisitorPic: (large) => ({
    width: large ? 27 : 22,
    height: large ? 27 :22,
    borderRadius: large ? (27/2) : 11,
  }),
});
