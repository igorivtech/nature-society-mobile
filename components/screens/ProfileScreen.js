import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Keyboard,
} from "react-native";
import { State, TapGestureHandler } from "react-native-gesture-handler";
import { colors } from "../../values/colors";
import {useKeyboard} from '../../hooks/useKeyboard'
import { ProfileView } from "../views/login/views";
import * as ImagePicker from 'expo-image-picker';
import { height, width } from "../../values/consts";

const scrollZero = {
  y: 0,
  animated: true,
}

export const ProfileScreen = ({ navigation, route }) => {

  const {user} = route.params;

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const scrollRef = useRef();

  useEffect(()=>{
    console.log({user});
    if (user.name) {
      setName(user.name);
    }
    if (user.email) {
      setSignupEmail(user.email);
    }
    if (user.image) {
      setImage({
        uri: user.image
      })
    }
  }, [])

  useEffect(() => {
    setPaddingBottom(keyboardHeight);
    setScrollEnabled(keyboardHeight > 0);
    if (keyboardHeight === 0) {
      scrollRef.current.scrollTo(scrollZero);
    }
  }, [keyboardHeight]);

  const selectImage = async () => {
    setLoadingImage(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 0.75,
    });
    // console.log(result);
    if (!result.cancelled) {
      setImage(result);
    }
    setLoadingImage(false);
  };

  const onSafeAreaLayout = (event) => {
    setSafeAreaHeight(event.nativeEvent.layout.height);
  }

  const onNameChanged = (value) => {
    setName(value);
  };

  const onSignupEmailChanged = (value) => {
    setSignupEmail(value);
  };

  const onSignupPasswordChanged = (value) => {
    setSignupPassword(value);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const updateChanges = () => {
    goBack();
  }

  const logout = () => {
    navigation.navigate("Progress", {logout: true, user: null})
  }

  const tapClose = (event) => {
    if (event.nativeEvent.state === State.END) {
      if (keyboardHeight > 0 ) {
        Keyboard.dismiss();
      } else {
        goBack();
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onLayout={onSafeAreaLayout} ref={scrollRef} scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView(paddingBottom)}>

        <View style={styles.popupsContainer(safeAreaHeight)}>

          <TapGestureHandler onHandlerStateChange={tapClose}>
            <View style={StyleSheet.absoluteFill} />
          </TapGestureHandler>

          <ProfileView
            image={image}
            loadingImage={loadingImage}
            selectImage={selectImage}
            visible={true}
            name={name}
            onNameChanged={onNameChanged}
            email={signupEmail}
            onEmailChanged={onSignupEmailChanged}
            logout={logout}
            updateChanges={updateChanges}
          />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: (paddingBottom) => ({
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: "center",
    paddingBottom,
  }),

  popupsContainer: (height) => ({
    height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  })
});
