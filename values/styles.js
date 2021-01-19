import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { width, height, safeAreaHeight, smallScreen } from "./consts";

export const globalStyles = StyleSheet.create({
  absolute: {
    position: 'absolute'
  },  
  scale: (scale) => ({
    transform: [{scale}]
  }),
  mapStyle: {
    ...StyleSheet.absoluteFill,
    bottom: -(safeAreaHeight+20),
    top: -(safeAreaHeight+20)
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
    justifyContent: 'space-between'
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

  halfLeftInner: {
    height: '100%',
    width: '50%',
    position: 'absolute',
    left: 0
  },

  halfRight: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: width / 2,
  },

  halfRightInner: {
    height: '100%',
    width: '50%',
    position: 'absolute',
    right: 0
  },

  fillParent: {
    height: "100%",
    width: "100%",
  },

  homeTopContainer: (translateY, topSafeAreaHeight) => ({
    transform: [{translateY}],
    alignItems: 'center',
    flexDirection: "row",
    paddingHorizontal: smallScreen ? 44 : 64,
    justifyContent: "space-between",
    marginTop: topSafeAreaHeight + 16,
  }),

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

  cardContainerTranslateY: (translateY, opacity) => ({
    opacity,
    transform: [{translateY}]
  }),

  mainListStyle: {
    flexGrow: 0,
  },

  cardMainImage: {
    resizeMode: 'cover',
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    width: "33%",
    height: "100%",
    backgroundColor: colors.imageBg,
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
    resizeMode: 'center',
    borderWidth: 0.4,
    borderColor: '#202224',
    width: large ? 27 : 22,
    height: large ? 27 :22,
    borderRadius: large ? (27/2) : 11,
  }),

  pointsGrowthContainer: (opacity, scale, translateX) => ({
    borderWidth: 1,
    borderColor: colors.treeBlues,
    position: 'absolute',
    top: height * 0.22,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 56 / 2,
    maxWidth: 130,
    opacity,
    transform: [{ translateX }, { scale }],
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowRadius: 10,
    shadowOpacity: 1,
    elevation: 4
  }),

  imageContain: (small) => ({
    // s - 19 × 20
    // k - 25 × 25
    width: small ? 19 : 25,
    height: small ? 20 : 25,
    resizeMode: 'contain'
  }),
  imageJustContain: {
    resizeMode: 'contain'
  }
});
