import React from "react";
import { View, Text, Button } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { strings } from "../../values/strings";
import { styles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import { OnboardingPagination } from "../views/onboarding/OnboardingPagination";

export const OnboardingScreen = () => {
  return (
    <View style={styles.onboardingContainer}>
      <OnboardingPagination />
    </View>
  );
};
