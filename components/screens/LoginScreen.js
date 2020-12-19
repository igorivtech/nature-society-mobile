import React, { useContext, useEffect, useRef, useState } from "react";
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
import { DEFAULT_IMAGE_QUALITY, DEFAULT_USER, height, width } from "../../values/consts";
import { UserContext } from "../../context/context";
import { SAVE_USER } from "../../context/userReducer";
import * as Permissions from "expo-permissions";
import { Popup } from "../views/Popup";
import { strings } from "../../values/strings";
import { askSettings } from "../../hooks/usePermissions";
import { Auth } from 'aws-amplify';
import { uploadImage } from "../../hooks/aws";
import { resizeImage } from "../../hooks/helpers";

const scrollZero = {
  y: 0,
  animated: true,
}

const yael = {
  name: "יעל השכנה",
  email: "yael@nextdoor",
  image: "https://cdn.iconscout.com/icon/premium/png-256-thumb/woman-avatar-1543937-1371628.png"
}

export const LoginScreen = ({ navigation }) => {

  const {state, dispatch} = useContext(UserContext);

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
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const [popupVisible, setPopupVisible] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    setPaddingBottom(Math.max(keyboardHeight - 100, 0));
    setScrollEnabled(keyboardHeight > 0);
    if (keyboardHeight === 0) {
      scrollRef.current.scrollTo(scrollZero);
    } else {
      setTimeout(() => {
        scrollRef.current.scrollTo({
          y: height*0.15,
          animated: true,
        });  
      }, 100);
    }
  }, [keyboardHeight]);

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
      if (loginEmail.trim() && loginPassword.length > 0) {
        setLoadingLogin(true);
        Auth.signIn(loginEmail.trim(), loginPassword).then(({user})=>{
          console.log("LOGGED IN");
          saveUser({
            name: name.trim() !== "" ? name.trim() : yael.name,
            email: loginEmail.trim(),
            image: image ? image.uri : yael.image
          });
        }).catch((error)=>{
          setLoadingLogin(false);
          console.error(error);
        });
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
      if (name.trim() !== "" && signupEmail.trim() && signupPassword.length > 0) {
        setLoadingSignup(true);
        uploadImage(image, (fileName) => {
          let attributes = {
            name: name.trim(),
            "custom:points": "0",
            "custom:numOfReports": "0"
          }
          if (fileName) {
            attributes.picture = fileName;
          }
          Auth.signUp({
            username: signupEmail.trim(),
            password: signupPassword,
            attributes
          }).then(({user})=>{
            saveUser({
              name: name.trim(),
              email: signupEmail.trim(),
              image: image ? image.uri : 'https://m.media-amazon.com/images/M/MV5BMjM2OTkyNTY3N15BMl5BanBnXkFtZTgwNzgzNDc2NjE@._V1_CR132,0,761,428_AL_UY268_CR82,0,477,268_AL_.jpg'
            });
          }).catch((error)=>{
            console.log("USER ERROR");
            console.error(error);
          }).finally(()=>{
            setLoadingSignup(false);
          })
        })
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
      payload: {
        ...DEFAULT_USER,
        ...user
      }
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
        .catch(err => console.error(err))
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
    if (newPassword.length >= 8 && code.length > 0) {
      setLoadingChangePassword(true);
      Auth.forgotPasswordSubmit(restoreEmail, code, newPassword)
        .then(() => {
          setLoginEmail(restoreEmail);
          setLoginPassword(newPassword);
          login();
        })
        .catch(err => console.error(err))
        .finally(()=>setLoadingChangePassword(false));
    } else {
      console.log("password or code error");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView onLayout={onSafeAreaLayout} ref={scrollRef} scrollEnabled={scrollEnabled} contentContainerStyle={styles.scrollView(paddingBottom)}>

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
      </ScrollView>
      <Popup textData={strings.popups.gallery} action={askSettings} popupVisible={popupVisible} setPopupVisible={setPopupVisible} />
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
