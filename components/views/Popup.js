import React, { useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Text,
  TouchableOpacity,
  Easing,
} from "react-native";
import Modal from 'react-native-modal';
import { colors } from "../../values/colors";
import { emptyFunc, height, smallScreen, width } from "../../values/consts";
import { strings } from "../../values/strings";
import { globalStyles } from "../../values/styles";
import { textStyles } from "../../values/textStyles";
import {useAppState} from "../../hooks/useAppState"
import useIsMounted from "ismounted";

const DURATION = 300;

export const Popup = ({ website = false, permissions = false, textData, popupVisible, setPopupVisible, actionRef, action = emptyFunc, reverseActions = false }) => {

  const applyAction = useRef(false);
  const isMounted = useIsMounted();

  useAppState(()=>{
    if (!isMounted.current) {return}
    setPopupVisible(false);
  });
  
  const close = () => {
    setPopupVisible(false);
  };

  const doAction = () => {
    if (permissions || website) {
      applyAction.current = true;
    } else {
      if (actionRef && actionRef?.current) {
        actionRef?.current();
      } else {
        action();
      }
    }
    setPopupVisible(false);
  };

  const onModalHide = useCallback(() => {
    if ((permissions || website) && applyAction.current) {
      applyAction.current = false;
      if (actionRef && actionRef?.current) {
        actionRef?.current();
      } else {
        action();
      }
    }
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        useNativeDriver: true,
        duration: DURATION,
        toValue: popupVisible ? 1 : 0.5,
        easing: Easing.inOut(Easing.ease),
      }),
      // Animated.timing(opacity, {
      //   useNativeDriver: true,
      //   duration: DURATION,
      //   toValue: popupVisible ? 1 : 0,
      //   easing: Easing.inOut(Easing.ease),
      // }),
    ]).start();
  }, [popupVisible]);

  const scale = useRef(new Animated.Value(0.8)).current;
  // const opacity = useRef(new Animated.Value(0)).current;

  return (
    <Modal 
      style={{margin: 0}} 
      backdropColor={colors.clear}
      onModalHide={onModalHide}
      onBackButtonPress={onModalHide}
      animationIn='fadeIn' 
      animationOut='fadeOut' 
      isVisible={popupVisible}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      backdropTransitionOutTiming={0}
    >
      <View style={popupStyles.bg}>
        <TouchableWithoutFeedback
          disabled={permissions}
          style={StyleSheet.absoluteFill}
          onPress={close}
        >
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <Animated.View style={popupStyles.cardContainer(scale, 1)}>
          <Text style={popupStyles.title}>{textData.title}</Text>
          <PopupButton
            title={textData.yes}
            onPress={reverseActions ? close : doAction}
            filled={true}
          />

          {(textData.no != null && textData.no.length > 0) && (
            <PopupButton
              title={textData.no}
              onPress={reverseActions ? doAction : close}
              filled={false}
            />
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const PopupButton = ({ filled, title, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={popupStyles.buttonContainer(filled)}>
        <Text style={popupStyles.buttonTitle(filled)}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const popupStyles = StyleSheet.create({
  title: {
    textAlign: 'right',
    marginBottom: 20,
    ...textStyles.normalOfSize(18),
    color: colors.treeBlues,
  },

  cardContainer: (scale, opacity) => ({
    opacity,
    transform: [{ scale }],
    marginHorizontal: 30,
    backgroundColor: "white",
    borderRadius: 24,
    ...globalStyles.shadow,
    paddingHorizontal: smallScreen ? 30 : 40,
    width: 314,
    maxWidth: width - 2 * 30,
    alignSelf: "center",
    paddingVertical: 34,
  }),

  bg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(196, 224, 85, 0.5)",
    justifyContent: "center",
    alignItems: "stretch",
  },

  buttonTitle: (filled) => ({
    ...(filled ? textStyles.boldOfSize(24) : textStyles.normalOfSize(24)),
    color: filled ? "white" : colors.treeBlues,
    textAlign: "center",
  }),

  buttonContainer: (filled) => ({
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    marginTop: 12,
    backgroundColor: filled ? colors.treeBlues : "white",
    height: 45,
    width: "100%",
  }),
});
