import React, { useContext, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Image, Easing, TouchableOpacity } from "react-native";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { DetailsView } from "./DetailsView";
import { Pagination } from "./Slider";
import { TakePicView, GoBackButton, FinishButton } from "./views";
import {UserContext} from "../../../context/context"
import { colors } from "../../../values/colors";
import { useEffect } from "react";
import { smallScreen } from "../../../values/consts";
import { globalStyles } from "../../../values/styles";
import {ActivityIndicator} from "../ActivityIndicator";

export const Report = ({goBack, useImageData, finishReport, details, iHelped, loadingSendReport, sharePressed}) => {

  const {state} = useContext(UserContext);
  const {user, settings} = state;

  const firstContainerOpacity = useRef(new Animated.Value(1)).current;
  const secondContainerOpacity = firstContainerOpacity.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });
  const [secondContainerZIndex, setSecondContainerZIndex] = useState(-1);

  const submitReport = () => {
    Animated.timing(firstContainerOpacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start(()=>{
      setSecondContainerZIndex(1);
    });
  }

  return (
    <View style={styles.container}>
      <Animated.View style={styles.firstContainer(firstContainerOpacity)}>
        <GoBackButton goBack={goBack} />    
        <View style={styles.titlesContainer}>
          <View style={styles.pagContainer}>
            <Pagination index={2} />
          </View>
          <Text style={textStyles.normalOfSize(12)}>{strings.reportScreen.takePic1}</Text>
          <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.takePic2}</Text>
        </View>
        <TakePicView useImageData={useImageData} />

        <View style={styles.bottomContainer}>
          <DetailsView details={details} iHelped={iHelped} />
          <FinishButton finishReport={submitReport} points={settings.reportPoints} />

        </View>
        
      </Animated.View>
      <Animated.View style={styles.secondContainer(secondContainerOpacity, secondContainerZIndex)}>
        <View style={styles.imageContainer}>
          <Image resizeMode='contain' style={styles.doneImage} resizeMode='center' source={require("../../../assets/images/report_done_image.png")} />
        </View>
        
        <View style={styles.pointsContainer(user)}>
          <Text style={styles.pointsText}>{`+${settings.reportPoints}`}</Text>
          <Image style={globalStyles.imageJustContain} source={require("../../../assets/images/report_done_icon.png")} />
        </View>

        <Text style={styles.doneTitle}>{strings.reportScreen.doneTitle(user)}</Text>
        <Button title={user != null ? strings.reportScreen.share : strings.reportScreen.gladToJoin} filled={true} onPress={sharePressed} />
        <Button title={user != null ? strings.reportScreen.done : strings.reportScreen.nextTime} filled={false} onPress={finishReport} loading={loadingSendReport} />
      </Animated.View>
    </View>
  );
};

const Button = ({filled, title, onPress, loading = false}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(()=>{
    Animated.timing(opacity, {
      toValue: loading ? 0.5 : 1,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true
    }).start();
  }, [loading])
  return (
    <TouchableOpacity disabled={loading} onPress={onPress}>
      <Animated.View style={styles.buttonContainer(filled, loading)}>
        <View>
          <View style={styles.indicatorContainer}>
            <ActivityIndicator animating={loading} style={styles.indicator} color={colors.treeBlues} />
          </View>
          <Text style={styles.buttonTitle(filled)}>{title}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({

  doneTitle: {
    lineHeight: 17,
    ...textStyles.normalOfSize(18),
    marginBottom: smallScreen ? 8 : 24
  },

  indicatorContainer: {
    ...StyleSheet.absoluteFill, 
    flexDirection: 'row', 
    alignItems: 'center'
  },

  indicator: {
    transform: [{translateX: -12}]
  },

  bottomContainer: {
    flexGrow: 1,
    justifyContent: 'space-around'
  },

  imageContainer: {
    flexGrow: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },


  doneImage: {
    resizeMode: 'contain',
    flex: 1,
  },


  buttonTitle: (filled) => ({
    ...(filled ? textStyles.boldOfSize(18) : textStyles.normalOfSize(18)),
    color: filled ? 'white' : colors.treeBlues,
    textAlign: 'center'
  }),

  buttonContainer: (filled, loading) => ({
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    opacity: loading ? 0.5 : 1,
    marginTop: 12,
    backgroundColor: filled ? colors.treeBlues : 'white',
    height: 45,
    width: '100%',
  }),

  pointsText: {
    marginRight: 8,
    ...textStyles.normalOfSize(40),
    color: colors.treeBlues
  },

  pointsContainer: (user) => ({
    opacity: user == null ? 0.5 : 1,
    marginTop: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "center"
  }),

  titlesContainer: {
    marginTop: smallScreen ? 10 : 23
  },

  secondContainer: (opacity, zIndex) => ({
    zIndex,
    ...StyleSheet.absoluteFill,
    opacity,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    paddingVertical: 35,
    paddingHorizontal: 30
  }),

  firstContainer: (opacity) => ({
    flexShrink: 1,
    opacity,
    flex: 1,
    alignItems: 'stretch'
  }),

  container: {
    height: "33.3333333333333%",
    width: "100%",
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingTop: 13,
    paddingBottom: 21,
    paddingHorizontal: 30
  },
  pagContainer: {
    position: 'absolute',
  },

});