import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
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
import { Input } from "../views/login/Input";

export const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scrollEnabled, setScrollEnabled] = useState(false);
  
  const [keyboardHeight] = useKeyboard();
  const [paddingBottom, setPaddingBottom] = useState(0);

  useEffect(() => {
    setPaddingBottom(keyboardHeight);
    setScrollEnabled(keyboardHeight > 0);
  }, [keyboardHeight]);

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
      <ScrollView scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView(paddingBottom)}>
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

  scrollView: (paddingBottom) => ({
    justifyContent: "center",
    flexGrow: 1,
    paddingBottom
  }),

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
