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
import { CARD_RADIUS, smallScreen, width } from "../../../values/consts";
import { globalStyles } from "../../../values/styles";

const CARD_ANIMATION_DURATION = 400;

const useVisible = (visible, initialScale, initialOpacity) => {

  const opacity = useRef(new Animated.Value(initialOpacity)).current;
  const scale = useRef(new Animated.Value(initialScale)).current;

  useEffect(()=>{
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      useNativeDriver: true,
      duration: visible ? CARD_ANIMATION_DURATION : (CARD_ANIMATION_DURATION - 100),
      timing: Easing.inOut(Easing.ease)
    }).start();
    Animated.timing(scale, {
      toValue: visible ? 1 : 0.8,
      useNativeDriver: true,
      duration: visible ? CARD_ANIMATION_DURATION : (CARD_ANIMATION_DURATION - 100),
      timing: Easing.inOut(Easing.ease)
    }).start();
  }, [visible]);

  return {opacity, scale}
}

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
    loading
  }) => {

    const {opacity, scale} = useVisible(visible, 0, 1);

    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity, scale)}>
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
            loading={loading}
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

export const ForgotPasswordView = memo(
  ({
    visible,
    email,
    onEmailChanged,
    restorePassword
  }) => {

    const {opacity, scale} = useVisible(visible, 0, 0);
    
    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity, scale)}>
          <Text style={styles.loginTitle}>{strings.loginScreen.restorePassword}</Text>

          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            title={strings.email}
            onChange={onEmailChanged}
            value={email}
            extraMargin={true}
          />

          <CoolButton
            textStyle={{
              ...textStyles.boldOfSize(24),
              color: "white",
            }}
            title={strings.loginScreen.restorePasswordButton}
            onPress={restorePassword}
          />

        </Animated.View>
      </View>
    );
  }
);

export const EmailSentView = memo(
  ({
    visible,
    gotIt,
  }) => {

    const {opacity, scale} = useVisible(visible, 0, 0);

    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity, scale)}>
          <Text style={styles.emailSentTitle}>{strings.loginScreen.restorePassword}</Text>

          <Text style={styles.emailSentDesc}>{strings.loginScreen.emailSentDesc}</Text>

          <CoolButton
            textStyle={{
              ...textStyles.boldOfSize(24),
              color: "white",
            }}
            title={strings.loginScreen.emailSentButton}
            onPress={gotIt}
          />

        </Animated.View>
      </View>
    );
  }
);

export const NewPasswordView = memo(
  ({
    visible,
    code,
    onCodeChanged,
    newPassword,
    onNewPasswordChanged,
    changePassword
  }) => {

    const {opacity, scale} = useVisible(visible, 0, 0);
    
    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity, scale)}>
          <Text style={styles.loginTitle}>{strings.loginScreen.chooseNewPasswordTitle}</Text>

          <Input
            autoCapitalize="none"
            title={strings.code}
            onChange={onCodeChanged}
            value={code}
          />

          <Input
            autoCapitalize="none"
            title={strings.password}
            onChange={onNewPasswordChanged}
            value={newPassword}
            secure={true}
          />

          <CoolButton
            textStyle={{
              ...textStyles.boldOfSize(24),
              color: "white",
            }}
            title={strings.loginScreen.chooseNewPasswordTitle}
            onPress={changePassword}
          />

        </Animated.View>
      </View>
    );
  }
);

const PIC_SIZE = smallScreen ? 100 : 111;
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
    loading
  }) => {

    const {opacity, scale} = useVisible(visible, 0, 0);

    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity, scale)}>
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
              <Text style={styles.profilePicDetail}>
                {"\n"+strings.loginScreen.notMandatory}
              </Text>
            </Text>
          </View>

          <CoolButton
            loading={loading}
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

export const ProfileView = memo(
  ({
    loading,
    visible,
    name,
    onNameChanged,
    email,
    onEmailChanged,
    logout,
    updateChanges,
    selectImage,
    image,
    loadingImage,
    setLoadingImage
  }) => {

    const {opacity, scale} = useVisible(visible, 0, 1);

    return (
      <View style={styles.absolutePopup(visible)}>
        <Animated.View style={styles.cardContainer(opacity, scale)}>
          <Text style={styles.loginTitle}>
            {strings.loginScreen.updateDetailsTitle}
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

          <View style={styles.profilePicContainerLarge}>
            <TouchableOpacity onPress={selectImage} style={styles.profilePicButton}>
              {loadingImage ? (
                <ActivityIndicator color={colors.treeBlues} />
              ) : (
                <Image source={require("../../../assets/images/upload_icon.png")} />
              )}
              {image ? (<Image onLoad={()=>setLoadingImage(false)} style={styles.profilePic} source={{ uri: image.uri }} />) : null}
            </TouchableOpacity>
            <Text style={styles.profilePicTitle}>
              {strings.loginScreen.profilePic}
            </Text>
          </View>

          <CoolButton
            loading={loading}
            textStyle={{
              ...textStyles.boldOfSize(24),
              color: "white",
            }}
            title={strings.loginScreen.updateDetails}
            onPress={updateChanges}
          />

          <View style={styles.bottomButtonsSignupContainer}>
            <Text style={styles.orText}>{strings.or}</Text>
            <SmallButton onPress={logout} title={strings.logout} />
          </View>
        </Animated.View>
      </View>
    );
  }
);

export const SmallButton = memo(({ title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.smallButtonText}>{title}</Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  profilePicDetail: {
    ...textStyles.normalOfSize(12),
    color: colors.treeBlues,
    lineHeight: 16
  },
  profilePicTitle: {
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
    flexGrow: 1, 
    flexShrink: 1,
    paddingRight: smallScreen ? 2 : 8
  },

  profilePic: {
    position: "absolute",
    backgroundColor: colors.clear,
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
    marginBottom: smallScreen ? 22 : 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },

  profilePicContainerLarge: {
    marginBottom: smallScreen ? 24 : 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },

  absolutePopup: (visible) => ({
    position: "absolute",
    zIndex: visible ? 1 : -1,
  }),

  cardContainer: (opacity, scale) => ({
    transform: [{scale}],
    opacity: opacity,
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: smallScreen ? 28 : 32,
    paddingBottom: smallScreen ? 20 : 24,
    paddingHorizontal: smallScreen ? 30 : 40,
    width: width - 2 * 30,
    backgroundColor: "white",
    borderRadius: CARD_RADIUS,
    ...globalStyles.shadow
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
    marginBottom: smallScreen ? 28 : 38,
    ...textStyles.boldOfSize(24),
    color: colors.treeBlues,
    textAlign: "right",
    width: "100%",
  },

  emailSentTitle: {
    marginBottom: 20,
    ...textStyles.boldOfSize(24),
    color: colors.treeBlues,
    textAlign: "right",
    width: "100%",
  },

  emailSentDesc: {
    marginBottom: 48,
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
    textAlign: "right",
    width: "100%",
  }

});
