import { StyleSheet } from "react-native";
import { colors } from "./colors";
import {fonts} from './fonts'

export const textStyles = StyleSheet.create({
  onboardingText: {
    color: 'black',
    textAlign: 'center',
    marginTop: 20,
    fontFamily: fonts.normal,
    fontSize: 22,
    lineHeight: 24
  },

  onboardingCoolButton: {
    color: 'white',
    fontWeight: '700',
    fontFamily: fonts.normal,
    fontSize: 24,
  },

  cardTitle: {
    fontFamily: fonts.bold,
    fontWeight: "700",
    textAlign: "right",
    fontSize: 14,
    color: colors.darkWithTone,
  },

  cardDetail: {
    fontFamily: fonts.normal,
    fontWeight: "400",
    textAlign: "right",
    fontSize: 14,
    color: colors.darkWithTone,
  },

  rating: (color) => ({
    marginRight: 4,
    color: color,
    fontFamily: fonts.normal,
    fontWeight: "400",
    textAlign: "right",
  }),

  normalOfSize: (size, color = colors.darkWithTone) => ({
    textAlign: "right",
    fontFamily: fonts.normal,
    fontSize: size,
    color,
  }),

  boldOfSize: (size, color = colors.darkWithTone) => ({
    
    textAlign: "right",
    fontFamily: fonts.bold,
    fontSize: size,
    color: color,
    
  }),

  pointsGrowthText: (opacity) => ({
    opacity,
    flexShrink: 1,
    paddingHorizontal: 11,
    fontFamily: fonts.normal,
    fontSize: 40,
    textAlign: 'center',
    color: colors.treeBlues
  })
});
