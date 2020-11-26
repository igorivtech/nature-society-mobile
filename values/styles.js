import { StyleSheet, Dimensions } from "react-native";
import { colors } from "./colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
});
