import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
  Easing,
  ScrollView,
  Keyboard,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { colors } from "../../values/colors";
import { CARD_RADIUS, width } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { CoolButton } from "../views/onboarding/views";
import * as Animatable from 'react-native-animatable';
import {useKeyboard} from '../../hooks/useKeyboard'

export const LoginScreen = ({ navigation }) => {

  const [keyboardHeight] = useKeyboard();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onEmailChanged = (value) => {
    setEmail(value);
  };

  const onPasswordChanged = (value) => {
    setPassword(value);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const login = () => {
    console.log("login");
  }

  const signup = () => {
    console.log("signup");
  }

  const forgotPassword = () => {
    console.log("forgotPassword");
  }

  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (keyboardHeight > 0) {
        Keyboard.dismiss();
      } else {
        goBack();
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TapGestureHandler onHandlerStateChange={tapClose}>
          <View style={StyleSheet.absoluteFill} />
        </TapGestureHandler>
        <LoginView
          email={email}
          onEmailChanged={onEmailChanged}
          password={password}
          onPasswordChanged={onPasswordChanged}
          forgotPassword={forgotPassword}
          login={login}
          signup={signup}
         />
      </ScrollView>
    </SafeAreaView>
  );
};

const LoginView = ({email, onEmailChanged, password, onPasswordChanged, forgotPassword, login, signup}) => {
  return (
    <Animatable.View animation='fadeInUpBig' style={styles.cardContainer}>
      <Text style={styles.loginTitle}>{strings.loginScreen.title}</Text>

      <Input
        autoCapitalize='none'
        keyboardType='email-address'
        title={strings.email}
        onChange={onEmailChanged}
        value={email}
      />
      <Input
        extraMargin={true}
        autoCapitalize='none'
        title={strings.password}
        onChange={onPasswordChanged}
        value={password}
        secure={true}
      />

      <CoolButton textStyle={{
        ...textStyles.boldOfSize(24),
        color: 'white'
      }} title={strings.login} onPress={login} />

      <View style={styles.bottomButtonsContainer}>
        <SmallButton onPress={forgotPassword} title={strings.loginScreen.forgotPassword} />
        <SmallButton onPress={signup} title={strings.loginScreen.signup} />
      </View>
    </Animatable.View>
  )
}

const SmallButton = ({title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text style={styles.smallButtonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const DURATION = 300;
const TEXT_SCALE = 0.7;

const Input = ({ autoCapitalize = 'words', keyboardType = 'default', title, value, onChange, secure = false, extraMargin = false }) => {
  
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  const placeholderWidth = useRef();
  const placeholderHeight = useRef();

  const onBlur = () => {
    if (value.length === 0) {
      Animated.parallel([
        Animated.timing(textTranslateY, {
          duration: DURATION,
          useNativeDriver: true,
          toValue: 0,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(textTranslateX, {
          duration: DURATION,
          useNativeDriver: true,
          toValue: 0,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(textScale, {
          duration: DURATION,
          useNativeDriver: true,
          toValue: 1,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start();
    } else {
      // ?
    }
  };

  const onFocus = () => {
    Animated.parallel([
      Animated.timing(textTranslateY, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: -30, // -placeholderHeight.current - 12,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(textTranslateX, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: placeholderWidth.current * (1 - TEXT_SCALE)/2,
        easing: Easing.inOut(Easing.ease),
      }),
      Animated.timing(textScale, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: TEXT_SCALE,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };

  return (
    <View style={styles.animatedTextContainer(extraMargin ? 64 : 32)}>
      <Animated.Text onLayout={(e) => {
        placeholderWidth.current = e.nativeEvent.layout.width;
        placeholderHeight.current = e.nativeEvent.layout.height;
      }} style={styles.animatedPlaceholder(textTranslateX, textTranslateY, textScale)}>
        {title}
      </Animated.Text>
      <TextInput
        underlineColorAndroid={colors.clear}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        onChangeText={onChange}
        secureTextEntry={secure}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        style={styles.textInput}
        selectionColor={colors.desertRock}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  bottomButtonsContainer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%'
  },

  smallButtonText: {
    textDecorationLine: 'underline',
    ...textStyles.normalOfSize(12),
    textAlign: 'center',
    color: colors.treeBlues
  },

  textInput: {
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
  },

  animatedPlaceholder: (translateX, translateY, scale) => ({
    transform: [{ translateX }, { translateY }, { scale }],
    position: "absolute",
    right: 4,
    bottom: 4,
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
    textDecorationLine: "underline",
  }),

  animatedTextContainer: (marginBottom) => ({
    width: "100%",
    paddingTop: 16,
    borderBottomColor: colors.treeBlues,
    borderBottomWidth: 1,
    paddingBottom: 4,
    marginBottom,
  }),

  scrollView: {
    justifyContent: "center",
    flexGrow: 1,
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
    width: width - 2 * 30,
    alignSelf: "center",
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
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },
});
