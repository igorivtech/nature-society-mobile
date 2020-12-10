import React, { useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { DetailsView } from "./DetailsView";
import { Pagination } from "./Slider";
import { TakePicView, GoBackButton, FinishButton } from "./views";

export const Report = ({goBack, image, setImage, finishReport, details, iHelped}) => {

  const firstContainerOpacity = useRef(new Animated.Value(1)).current;
  const secondContainerOpacity = useRef(new Animated.Value(0)).current;

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
        <FinishButton finishReport={finishReport} points={30} />

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({

  titlesContainer: {
    marginTop: 23
  },

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