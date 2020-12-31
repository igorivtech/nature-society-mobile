import React, { useContext, useEffect, useRef, useState, useCallback } from "react";
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
import { DEFAULT_IMAGE_QUALITY, errors, height, width } from "../../values/consts";
import { UserContext } from "../../context/context";
import { SAVE_TOKEN, SAVE_USER } from "../../context/userReducer";
import * as Permissions from "expo-permissions";
import { Popup } from "../views/Popup";
import { strings } from "../../values/strings";
import { askSettings } from "../../hooks/usePermissions";
import { Auth } from 'aws-amplify';
import { useUploadImage } from "../../hooks/aws";
import { cognitoToUser } from "../../hooks/useUser";
import { objectLength, resizeImage, validateEmail } from "../../hooks/helpers";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from "lodash";

export const ProfileScreen = ({ navigation }) => {

  const [errorData, setErrorData] = useState(strings.popups.empty);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const {state, dispatch} = useContext(UserContext);
  const {user} = state;

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const [popupVisible, setPopupVisible] = useState(false);

  const scrollRef = useRef();

  const { uploadImage } = useUploadImage();

  useEffect(()=>{
    if (user) {
      if (user.name) {
        setName(user.name);
      }
      if (user.email) {
        setSignupEmail(user.email);
      }
      if (user.image) {
        setLoadingImage(true);
        setImage({
          uri: user.image
        })
      }
    }
  }, [])

  useEffect(() => {
    debounce.cancel();
    debounce(keyboardHeight);
  }, [keyboardHeight]);

  const debounce = useCallback(_.debounce((keyboardHeight) => {
    setScrollEnabled(keyboardHeight > 0);
    if (keyboardHeight === 0) {
      scrollRef?.current.scrollToPosition(0, 0);
    } else {
      scrollRef?.current.scrollToPosition(0, height*0.15);
    }
  }, 250), []);

  const selectImage = useCallback(async () => {
    setLoadingImage(true);
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: DEFAULT_IMAGE_QUALITY,
      })
        .then(async(result) => {
          if (!result.cancelled) {
            const resized = await resizeImage(result);
            setImage(resized);
          }
        })
        .catch((error) => {
          console.log({ error });
        })
        .finally(() => {
          setLoadingImage(false);
        });
    } else {
      setPopupVisible(true);
      setLoadingImage(false);
    }
  }, []);

  const onSafeAreaLayout = (event) => {
    setSafeAreaHeight(event.nativeEvent.layout.height);
  }

  const onNameChanged = useCallback((value) => {
    setName(value);
  }, []);

  const onSignupEmailChanged = useCallback((value) => {
    setSignupEmail(value.trim());
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const updateChanges = useCallback(async () => {
    let attributes = {}
    if (name !== user.name) {
      if (name.trim().length === 0) {
        handleError(errors.enterName);
        return;
      }
      attributes.name = name;
    }
    if (signupEmail !== user.email) {
      if (!validateEmail(signupEmail)) {
        handleError(errors.invalidEmail);
        return;
      }
      attributes.email = signupEmail;
    }
    //
    setLoadingUpdate(true);
    uploadImage(image, async (fileName) => {
      if (fileName) {
        attributes.picture = fileName;
      }
      if (objectLength(attributes) === 0) {
        setLoadingUpdate(false);
        return;
      }
      try {
        let cognitoUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        let result = await Auth.updateUserAttributes(cognitoUser, attributes);
        if (result === 'SUCCESS') {
          let updatedCognitoUser = await Auth.currentAuthenticatedUser({
            bypassCache: true,
          });
          updateUser(cognitoToUser(updatedCognitoUser));
        } else {
          console.error("cant update details".toUpperCase(), result);
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoadingUpdate(false);
      }
    })
  }, [name, user, signupEmail, image])

  const logout = useCallback(() => {
    Auth.signOut().then(()=>{
      updateUser(null);
    }).catch((error)=>{
      console.error(error);
      updateUser(null);
    });
  }, [])

  const updateUser = (user) => {
    dispatch({
      type: SAVE_USER,
      payload: user
    });
    if (user === null) {
      dispatch({
        type: SAVE_TOKEN,
        payload: null
      });
    }
    navigation.navigate("Home")
  }

  const tapClose = useCallback((event) => {
    if (event.nativeEvent.state === State.END) {
      if (keyboardHeight > 0 ) {
        Keyboard.dismiss();
      } else {
        goBack();
      }
    }
  }, [keyboardHeight])

  const handleError = (error) => {
    if (error) {
      setErrorData(strings.popups.loginError(error.code));
      setErrorPopupVisible(true);
    }
    console.error(error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView onLayout={onSafeAreaLayout} ref={scrollRef} scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView}>

        <View style={styles.popupsContainer(safeAreaHeight)}>

          <TapGestureHandler onHandlerStateChange={tapClose}>
            <View style={StyleSheet.absoluteFill} />
          </TapGestureHandler>

          <ProfileView
            loading={loadingUpdate}
            image={image}
            loadingImage={loadingImage}
            setLoadingImage={setLoadingImage}
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
      </KeyboardAwareScrollView>
      <Popup textData={strings.popups.gallery} action={askSettings} popupVisible={popupVisible} setPopupVisible={setPopupVisible} />
      <Popup textData={errorData} popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    backgroundColor: colors.clear,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: "center",
  },

  popupsContainer: (height) => ({
    height,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
  })
});
