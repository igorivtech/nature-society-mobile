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
import { EmailSentView, ForgotPasswordView, LoginView, NewPasswordView, SignupView } from "../views/login/views";
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
import { resizeImage, validateEmail } from "../../hooks/helpers";
import { ATTRIBUTE_NUM_OF_REPORTS, ATTRIBUTE_POINTS, ATTRIBUTE_UNLOCKED_PLACES, cognitoToUser, getToken } from "../../hooks/useUser";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import _ from "lodash";

const PASSWORD_MIN_LENGTH = 8;
const DEFAULT_POINTS = 200;
const DEFAULT_NUM_OF_REPORTS = 0;
const DEFAULT_UNLOCKED_PLACES = {};

export const LoginScreen = ({ navigation }) => {

  const {state, dispatch} = useContext(UserContext);

  const [errorData, setErrorData] = useState(strings.popups.empty);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);
  const [loadingRestorePassword, setLoadingRestorePassword] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);

  const [loginVisible, setLoginVisible] = useState(true);
  const [signupVisible, setSignupVisible] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [emailSentVisible, setEmailSentVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);

  const [name, setName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [restoreEmail, setRestoreEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [code, onCodeChanged] = useState('');

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const [popupVisible, setPopupVisible] = useState(false);
  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const {uploadImage} = useUploadImage();

  const scrollRef = useRef();

  useEffect(() => {
    debounce.cancel();
    debounce(keyboardHeight);
  }, [keyboardHeight]);

  const debounce = useCallback(_.debounce((keyboardHeight) => {
    setScrollEnabled(keyboardHeight > 0);
    if (keyboardHeight === 0) {
      scrollRef.current.scrollToPosition(0, 0);
    } else {
      scrollRef.current.scrollToPosition(0, height*0.15);
    }
  }, 250), []);

  const selectImage = async () => {
    setLoadingImage(true);
    const { status, permissions } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === 'granted') {
      ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        // allowsEditing: true,
        // aspect: [4, 3],
        quality: DEFAULT_IMAGE_QUALITY,
      })
        .then(async (result) => {
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
  };

  const onSafeAreaLayout = (event) => {
    setSafeAreaHeight(event.nativeEvent.layout.height);
  }

  const onNameChanged = (value) => {
    setName(value);
  };

  const onLoginEmailChanged = (value) => {
    setLoginEmail(value);
  };

  const onLoginPasswordChanged = (value) => {
    setLoginPassword(value);
  };

  const onSignupEmailChanged = (value) => {
    setSignupEmail(value);
  };

  const onSignupPasswordChanged = (value) => {
    setSignupPassword(value);
  };

  const onNewPasswordChanged = (value) => {
    setNewPassword(value);
  };

  const goBack = () => {
    if (emailSentVisible || newPasswordVisible) {
      return;
    }
    if (forgotPasswordVisible || signupVisible) {
      login();
    } else {
      navigation.goBack();
    }
  };

  const login = () => {
    if (loginVisible) {
      if (validateEmail(loginEmail) && loginPassword.length >= PASSWORD_MIN_LENGTH) {
        setLoadingLogin(true);
        Auth.signIn(loginEmail.trim(), loginPassword).then((cognitoUser)=>{
          saveUser(cognitoToUser(cognitoUser));
          dispatch({
            type: SAVE_TOKEN,
            payload: getToken(cognitoUser),
          });
        }).catch((error)=>{
          handleError(error);
        }).finally(()=>setLoadingLogin(false));
      } else {
        if (!validateEmail(loginEmail)) {
          handleError(errors.invalidEmail);
        } else if (loginPassword.length < PASSWORD_MIN_LENGTH) {
          handleError(errors.shortPassword);
        }
      }
    } else {
      showLogin();
    }
  }

  // const res = await Auth.currentSession();
  // let accessToken = res.getAccessToken();
  // let jwt = accessToken.getJwtToken();

  const signup = () => {
    if (signupVisible) {
      if (name.trim() !== "" && validateEmail(signupEmail) && signupPassword.length >= PASSWORD_MIN_LENGTH) {
        setLoadingSignup(true);
        uploadImage(image, async (fileName) => {
          let attributes = {
            name: name.trim(),
          }
          attributes[ATTRIBUTE_POINTS] = `${DEFAULT_POINTS}`;
          attributes[ATTRIBUTE_NUM_OF_REPORTS] = `${DEFAULT_NUM_OF_REPORTS}`;
          attributes[ATTRIBUTE_UNLOCKED_PLACES] = JSON.stringify(DEFAULT_UNLOCKED_PLACES);
          if (fileName) {
            attributes.picture = fileName;
          }
          try {
            await Auth.signUp({
              username: signupEmail.trim(),
              password: signupPassword,
              attributes
            });
            const authUser = await Auth.signIn(signupEmail.trim(), signupPassword);
            saveUser(cognitoToUser(authUser));
            dispatch({
              type: SAVE_TOKEN,
              payload: getToken(authUser),
            });
          } catch (error) {
            handleError(error);
          } finally {
            setLoadingSignup(false);
          }
        })
      } else {
        if (name.trim() === "") {
          handleError(errors.enterName);
        } else if (!validateEmail(signupEmail)) {
          handleError(errors.invalidEmail);
        } else if (signupPassword.length < PASSWORD_MIN_LENGTH) {
          handleError(errors.shortPassword);
        }
      }
    } else {
      showSignup();
    }
  }

  const showLogin = () => {
    setLoginVisible(true);
    setSignupVisible(false);
    setForgotPasswordVisible(false);
    setNewPasswordVisible(false);
  }

  const showSignup = () => {
    setSignupVisible(true);
    setLoginVisible(false);
    setForgotPasswordVisible(false);
    setNewPasswordVisible(false);
  }

  const saveUser = (user) => {
    dispatch({
      type: SAVE_USER,
      payload: user
    })
    navigation.navigate("Progress");
  }

  const forgotPassword = () => {
    if (forgotPasswordVisible) {
      console.log("forgotPassword");
    } else {
      setRestoreEmail(loginEmail);
      setForgotPasswordVisible(true);
      setLoginVisible(false);
      setSignupVisible(false);
      setNewPasswordVisible(false);
    }
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

  const restorePassword = () => {
    if (restoreEmail.length > 0) {
      setLoadingRestorePassword(true);
      Auth.forgotPassword(restoreEmail)
        .then(data => {
          setEmailSentVisible(true);
          setForgotPasswordVisible(false);
        })
        .catch(err => {
          handleError(err);
        })
        .finally(()=>setLoadingRestorePassword(false));
    } else {
      console.log("no email");
    }
  }

  const gotIt = () => {
    setNewPasswordVisible(true);
    setEmailSentVisible(false);
  }

  const changePassword = () => {
    if (newPassword.length >= PASSWORD_MIN_LENGTH && code.length > 0) {
      setLoadingChangePassword(true);
      Auth.forgotPasswordSubmit(restoreEmail, code, newPassword)
        .then(() => {
          setLoginEmail(restoreEmail);
          setLoginPassword(newPassword);
          login();
        })
        .catch(err => {
          console.error(err)
          handleError(err);
        })
        .finally(()=>setLoadingChangePassword(false));
    } else {
      if (newPassword.length < PASSWORD_MIN_LENGTH) {
        handleError(errors.shortPassword);
      } else if (code.length === 0) {
        handleError(errors.enterCode);
      }
    }
  }

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

          <LoginView
            loading={loadingLogin}
            visible={loginVisible}
            email={loginEmail}
            onEmailChanged={onLoginEmailChanged}
            password={loginPassword}
            onPasswordChanged={onLoginPasswordChanged}
            forgotPassword={forgotPassword}
            login={login}
            signup={signup}
          />
          <SignupView
            loading={loadingSignup}
            image={image}
            loadingImage={loadingImage}
            selectImage={selectImage}
            visible={signupVisible}
            name={name}
            onNameChanged={onNameChanged}
            email={signupEmail}
            onEmailChanged={onSignupEmailChanged}
            password={signupPassword}
            onPasswordChanged={onSignupPasswordChanged}
            login={login}
            signup={signup}
          />

          <ForgotPasswordView 
            loading={loadingRestorePassword}
            visible={forgotPasswordVisible}
            email={restoreEmail}
            onEmailChanged={setRestoreEmail}
            restorePassword={restorePassword}
          />

          <EmailSentView visible={emailSentVisible} gotIt={gotIt} />
          
          <NewPasswordView
            loading={loadingChangePassword}
            code={code}
            onCodeChanged={onCodeChanged}
            visible={newPasswordVisible}
            newPassword={newPassword}
            onNewPasswordChanged={onNewPasswordChanged}
            changePassword={changePassword}
          />

        </View>
      </KeyboardAwareScrollView>
      <Popup textData={strings.popups.gallery} action={askSettings} popupVisible={popupVisible} setPopupVisible={setPopupVisible} />
      <Popup textData={errorData} single popupVisible={errorPopupVisible} setPopupVisible={setErrorPopupVisible} />
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
