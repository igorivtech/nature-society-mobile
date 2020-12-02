import React, { memo, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Input } from "./Input";
import { CoolButton } from "../onboarding/views";
import { colors } from "../../../values/colors";
import { CARD_RADIUS, width } from "../../../values/consts";

const CARD_ANIMATION_DURATION = 600;

export const LoginView = memo(
  ({
    visible,
    email,
    onEmailChanged,
    password,
    onPasswordChanged,
    forgotPassword,
    login,
    signup,
  }) => {

    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(()=>{
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
        duration: CARD_ANIMATION_DURATION,
        timing: Easing.inOut(Easing.ease)
      }).start();
    }, [visible]);

    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity)}>
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
        </Animated.View>
      </View>
    );
  }
);

const PIC_SIZE = 111;
const INNER_PIC_SIZE = PIC_SIZE - 6;

export const SignupView = memo(
  ({
    visible,
    name,
    onNameChanged,
    email,
    onEmailChanged,
    password,
    onPasswordChanged,
    login,
    signup,
    selectImage,
    image,
    loadingImage,
  }) => {

    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        useNativeDriver: true,
        duration: CARD_ANIMATION_DURATION,
        timing: Easing.inOut(Easing.ease)
      }).start();
    }, [visible]);

    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity)}>
          <Text style={styles.loginTitle}>
            {strings.loginScreen.signupTitle}
          </Text>

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
            autoCapitalize="none"
            title={strings.password}
            onChange={onPasswordChanged}
            value={password}
            secure={true}
          />

          <View style={styles.profilePicContainer}>
            <TouchableOpacity onPress={selectImage} style={styles.profilePicButton}>
              {loadingImage ? (
                <ActivityIndicator color={colors.treeBlues} />
              ) : (
                <Image source={require("../../../assets/images/upload_icon.png")} />
              )}
              {image ? (<Image style={styles.profilePic} source={{ uri: image.uri }} />) : null}
            </TouchableOpacity>
            <Text style={styles.profilePicTitle}>
              {strings.loginScreen.profilePic}
            </Text>
          </View>

          <CoolButton
            textStyle={{
              ...textStyles.boldOfSize(24),
              color: "white",
            }}
            title={strings.loginScreen.finishSignup}
            onPress={signup}
          />

          <View style={styles.bottomButtonsSignupContainer}>
            <Text style={styles.orText}>{strings.or}</Text>
            <SmallButton onPress={login} title={strings.login} />
          </View>
        </Animated.View>
      </View>
    );
  }
);

export const SmallButton = ({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.smallButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  profilePicTitle: {
    ...textStyles.normalOfSize(18),
    textAlign: "center",
    color: colors.treeBlues,
  },

  profilePic: {
    position: "absolute",
    backgroundColor: "red",
    width: INNER_PIC_SIZE,
    height: INNER_PIC_SIZE,
    overflow: "hidden",
    borderRadius: INNER_PIC_SIZE / 2,
  },

  profilePicButton: {
    height: PIC_SIZE,
    width: PIC_SIZE,
    borderRadius: PIC_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    alignItems: "center",
    justifyContent: "center",
  },

  profilePicContainer: {
    marginBottom: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },

  absolutePopup: (visible) => ({
    position: "absolute",
    zIndex: visible ? 1 : -1,
  }),

  cardContainer: (opacity) => ({
    opacity: opacity,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 40,
    width: width - 2 * 30,
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    shadowOffset: {
      height: -4,
      width: 0,
    },
    shadowColor: "rgba(0, 0, 0, 0.035)",
    shadowRadius: 12,
    shadowOpacity: 1,
  }),

  orText: {
    marginTop: 12,
    marginBottom: 8,
    ...textStyles.normalOfSize(12),
    textAlign: "center",
    color: colors.lighterShade,
  },

  bottomButtonsSignupContainer: {
    alignItems: "center",
  },

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

});
