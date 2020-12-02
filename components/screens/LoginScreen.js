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

export const LoginScreen = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onEmailChanged = (value) => {
    setEmail(value)
  }

  const onPasswordChanged = (value) => {
    setPassword(value)
  }

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.cardContainer}>
          <Text style={styles.loginTitle}>{strings.loginScreen.title}</Text>

          <Input title={strings.email} onChange={onEmailChanged} value={email} />
          <Input title={strings.password} onChange={onPasswordChanged} value={password} secure={true} />
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const DURATION = 300;

const Input = ({ title, value, onChange, secure = false }) => {
  
  const textTranslateY = useRef(new Animated.Value(0)).current;
  const textScale = useRef(new Animated.Value(1)).current;

  const onBlur = () => {
    if (value.length === 0) {
      Animated.parallel([
        Animated.timing(textTranslateY, {
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
      Animated.timing(textScale, {
        duration: DURATION,
        useNativeDriver: true,
        toValue: 0.7,
        easing: Easing.inOut(Easing.ease),
      }),
    ]).start();
  };

  return (
    <View
      style={{
        width: "100%",
        paddingTop: 16,
        borderBottomColor: colors.treeBlues,
        borderBottomWidth: 1,
        paddingBottom: 4,
      }}
    >
      <Animated.Text
        style={{
          transform: [
            {translateY: textTranslateY},
            {scale: textScale},
          ],
          position: "absolute",
          right: 4,
          bottom: 4,
          ...textStyles.normalOfSize(18),
          color: colors.treeBlues,
          textDecorationLine: "underline",
        }}
      >
        {title}
      </Animated.Text>
      <TextInput
        onChangeText={onChange}
        secureTextEntry={secure}
        value={value}
        onBlur={onBlur}
        onFocus={onFocus}
        style={{
          //   backgroundColor: "red",
          ...textStyles.normalOfSize(18),
          color: colors.treeBlues,
          textDecorationLine: "underline",
        }}
        selectionColor={colors.desertRock}
      />
    </View>
  );
};

const styles = StyleSheet.create({

  scrollView: {
    justifyContent: 'center',
    flexGrow: 1
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
