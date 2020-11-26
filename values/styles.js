import { StyleSheet } from "react-native";
import { colors } from "./colors";
import { width, height } from './consts'

export const styles = StyleSheet.create({
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
    top: height/2 - 60,
    position: 'absolute',
    width: "100%",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: 'flex-start',
  },

  halfLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: width / 2 
  },

  fillParent: {
    height: '100%',
    width: '100%',
  },

});
