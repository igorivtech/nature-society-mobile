import React, { useContext, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Image, Easing, TouchableOpacity } from "react-native";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { DetailsView } from "./DetailsView";
import { Pagination } from "./Slider";
import { TakePicView, GoBackButton, FinishButton } from "./views";
import {UserContext} from "../../../context/context"
import { colors } from "../../../values/colors";

export const Report = ({goBack, image, setImage, finishReport, details, iHelped}) => {

  const points = 30;

  const {state} = useContext(UserContext);
  const {user} = state;

  const firstContainerOpacity = useRef(new Animated.Value(1)).current;
  const secondContainerOpacity = useRef(new Animated.Value(0)).current;
  const [secondContainerZIndex, setSecondContainerZIndex] = useState(-1);

  const submitReport = () => {
    Animated.parallel([
      Animated.timing(firstContainerOpacity, {
        toValue: 0,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false
      }),
      Animated.timing(secondContainerOpacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false
      }),
    ]).start(()=>{
      setSecondContainerZIndex(1);
    });
  }

  const share = () => {
    console.log("share");
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
        <TakePicView image={image} setImage={setImage} />

        <DetailsView details={details} iHelped={iHelped} />
        <FinishButton finishReport={submitReport} points={points} />

      </Animated.View>
      <Animated.View style={styles.secondContainer(secondContainerOpacity, secondContainerZIndex)}>
        <View style={styles.imageContainer}>
          <Image resizeMode='contain' style={styles.doneImage} resizeMode='center' source={require("../../../assets/images/report_done_image.png")} />
        </View>
        
        <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.doneTitle(user)}</Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>{`+${points}`}</Text>
          <Image source={require("../../../assets/images/report_done_icon.png")} />
        </View>
        <Button title={strings.reportScreen.share} filled={true} onPress={share} />
        <Button title={strings.reportScreen.done} filled={false} onPress={finishReport} />
      </Animated.View>
    </View>
  );
};

const Button = ({filled, title, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer(filled)}>
        <Text style={styles.buttonTitle(filled)}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({

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
    ...textStyles.normalOfSize(18),
    color: filled ? 'white' : colors.treeBlues,
    textAlign: 'center'
  }),

  buttonContainer: (filled) => ({
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.treeBlues,
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

  pointsContainer: {
    marginTop: 12,
    marginBottom: 26,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: "center"
  },

  titlesContainer: {
    marginTop: 23
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