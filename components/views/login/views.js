import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Input } from "./Input";
import { CoolButton } from "../onboarding/views";
import { colors } from "../../../values/colors";
import { CARD_RADIUS, width } from "../../../values/consts";

export const LoginView = ({
  email,
  onEmailChanged,
  password,
  onPasswordChanged,
  forgotPassword,
  login,
  signup,
}) => {
  return (
    <View>
      <Animatable.View style={styles.cardContainer}>
        <Text style={styles.loginTitle}>{strings.loginScreen.title}</Text>

        <Input
          autoCapitalize="none"
          keyboardType="email-address"
          title={strings.email}
          onChange={onEmailChanged}
          value={email}
        />
        <Input
          extraMargin={true}
          autoCapitalize="none"
          title={strings.password}
          onChange={onPasswordChanged}
          value={password}
          secure={true}
        />

        <CoolButton
          textStyle={{
            ...textStyles.boldOfSize(24),
            color: "white",
          }}
          title={strings.login}
          onPress={login}
        />

        <View style={styles.bottomButtonsContainer}>
          <SmallButton
            onPress={forgotPassword}
            title={strings.loginScreen.forgotPassword}
          />
          <SmallButton onPress={signup} title={strings.loginScreen.signup} />
        </View>
      </Animatable.View>
    </View>
  );
};

export const SignupView = ({
    name,
    onNameChanged,
    email,
    onEmailChanged,
    password,
    onPasswordChanged,
    forgotPassword,
    login,
    signup,
  }) => {
    return (
      <View>
        <Animatable.View style={styles.cardContainer}>
          <Text style={styles.loginTitle}>{strings.loginScreen.signupTitle}</Text>

          <Input
            title={strings.fullName}
            onChange={onNameChanged}
            value={name}
          />
  
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            title={strings.email}
            onChange={onEmailChanged}
            value={email}
          />
          <Input
            extraMargin={true}
            autoCapitalize="none"
            title={strings.password}
            onChange={onPasswordChanged}
            value={password}
            secure={true}
          />
  
          <CoolButton
            textStyle={{
              ...textStyles.boldOfSize(24),
              color: "white",
            }}
            title={strings.loginScreen.finishSignup}
            onPress={signup}
          />
  
        </Animatable.View>
      </View>
    );
  };

export const SmallButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.smallButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomButtonsContainer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
  },

  smallButtonText: {
    textDecorationLine: "underline",
    ...textStyles.normalOfSize(12),
    textAlign: "center",
    color: colors.treeBlues,
  },

  loginTitle: {
    marginBottom: 38,
    ...textStyles.boldOfSize(24),
    color: colors.treeBlues,
    textAlign: "right",
    width: "100%",
  },

  cardContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 40,
    //   width: width - 2 * 30,
    width: "100%",
    //   alignSelf: "center",
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.035)",
    shadowRadius: 12,
    shadowOpacity: 1,
  },
});
