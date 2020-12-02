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
} from "react-native";
import { colors } from "../../values/colors";
import { CARD_RADIUS, width } from "../../values/consts";
import { strings } from "../../values/strings";
import { textStyles } from "../../values/textStyles";
import { CoolButton } from "../views/onboarding/views";

export const LoginScreen = ({ navigation }) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Text style={styles.loginTitle}>{strings.loginScreen.title}</Text>

          <Input
            autoCapitalize='none'
            keyboardType='email-address'
            title={strings.email}
            onChange={onEmailChanged}
            value={email}
          />
          <Input
            autoCapitalize='none'
            title={strings.password}
            onChange={onPasswordChanged}
            value={password}
            secure={true}
          />

          <CoolButton title={strings.login} onPress={login} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const DURATION = 300;
const TEXT_SCALE = 0.7;

const Input = ({ autoCapitalize = 'words', keyboardType = 'default', title, value, onChange, secure = false }) => {
  
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textTranslateX = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;
  const placeholderWidth = useRef();

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
        toValue: -30,
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
    <View style={styles.animatedTextContainer}>
      <Animated.Text onLayout={(e) => {
        const {x, y, width, height} = e.nativeEvent.layout;
        placeholderWidth.current = width;
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

  animatedTextContainer: {
    width: "100%",
    paddingTop: 16,
    borderBottomColor: colors.treeBlues,
    borderBottomWidth: 1,
    paddingBottom: 4,
  },

  scrollView: {
    justifyContent: "center",
    flexGrow: 1,
  },

  loginTitle: {
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
    aspectRatio: 1 / 1.1,
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
