import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { width, height } from "./consts";

export const globalStyles = StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFill
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

  baseContainer: {
    flex: 1
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
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    zIndex: 1,
    // flex: 1,
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

  shadow: {
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.035)",
    shadowRadius: 12,
    shadowOpacity: 1,
    elevation: 4
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
    alignItems: 'center',
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

  pointsGrowthContainer: {
    position: 'absolute',
    top: height * 0.22,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderTopRightRadius: 56 / 2,
    borderBottomRightRadius: 56 / 2,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    maxWidth: 130,
  },
});
