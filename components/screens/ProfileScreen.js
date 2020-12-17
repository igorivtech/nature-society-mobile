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
import { ProfileView } from "../views/login/views";
import * as ImagePicker from 'expo-image-picker';
import { DEFAULT_IMAGE_QUALITY, height, width } from "../../values/consts";
import { UserContext } from "../../context/context";
import { SAVE_USER } from "../../context/userReducer";
import * as Permissions from "expo-permissions";
import { Popup } from "../views/Popup";
import { strings } from "../../values/strings";
import { askSettings } from "../../hooks/usePermissions";
import { Auth } from 'aws-amplify';
import { uploadImage } from "../../hooks/aws";

const scrollZero = {
  y: 0,
  animated: true,
}

export const ProfileScreen = ({ navigation }) => {

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const {state, dispatch} = useContext(UserContext);
  const {user} = state;

  const [name, setName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);
  
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [keyboardHeight] = useKeyboard();
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [safeAreaHeight, setSafeAreaHeight] = useState(height);

  const [popupVisible, setPopupVisible] = useState(false);

  const scrollRef = useRef();

  useEffect(()=>{
    if (user) {
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
    }
  }, [])

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
        .then((result) => {
          if (!result.cancelled) {
            setImage(result);
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

  const onSignupEmailChanged = (value) => {
    setSignupEmail(value);
  };

  const goBack = () => {
    navigation.goBack();
  };

  const updateChanges = async () => {
    let attributes = {

    }
    if (name !== user.name) {
      user.name = name;
      attributes.name = name;
    }
    if (signupEmail !== user.email) {
      user.email = email;
      attributes.email = email;
    }
    if (image !== null && image.uri !== null && image.uri.length > 0) {
      user.image = image.uri;
    }
    //
    setLoadingUpdate(true);
    uploadImage(image, async (fileName) => {
      if (fileName) {
        attributes.picture = fileName;
      }
      if (attributes.length === 0) {
        return;
      }
      try {
        let cognitoUser = await Auth.currentAuthenticatedUser({
          bypassCache: true,
        });
        let result = await Auth.updateUserAttributes(cognitoUser, attributes);
        console.log({result});
        setLoadingUpdate(false);
        updateUser(user);
      } catch (error) {
        console.error(error);
      }
    })
  }

  const logout = () => {
    Auth.signOut().then(()=>{
      updateUser(null);
    }).catch((error)=>{
      console.error(error);
      updateUser(null);
    });
  }

  const updateUser = (user) => {
    dispatch({
      type: SAVE_USER,
      payload: user
    });
    navigation.navigate("Progress")
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
            loading={loadingUpdate}
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
