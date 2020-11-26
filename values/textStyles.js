import { StyleSheet } from "react-native";
import { colors } from "./colors";
import {fonts} from './fonts'

export const textStyles = StyleSheet.create({
  onboardingText: {
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.normal,
    fontSize: 22,
  },

  onboardingCoolButton: {
    color: 'white',
    fontWeight: '700',
    fontFamily: fonts.normal,
    fontSize: 24,
  }
});
