import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Pagination } from "./Slider";
import { TakePicView, GoBackButton, FinishButton } from "./views";

export const Report = ({goBack, image, setImage, finishReport, details}) => {

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <GoBackButton goBack={goBack} />    
        <View style={styles.titlesContainer}>
          <View style={styles.pagContainer}>
            <Pagination index={2} />
          </View>
          <Text style={textStyles.normalOfSize(12)}>{strings.reportScreen.takePic1}</Text>
          <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.takePic2}</Text>
        </View>
        <TakePicView image={image} setImage={setImage} />

        <DetailsView details={details} />
        <FinishButton finishReport={finishReport} points={30} />

      </View>
    </View>
  );
};

const DetailsView = ({details}) => {
  return (
    <View style={detailsStyles.container}>
      <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.additionalInfo}</Text>
      <View style={detailsStyles.checkboxesContainer}>
        {details.map(detail => <Checkbox key={detail.id} detail={detail} />)}
      </View>
    </View>
  )
}

const CHECKBOX_SIZE = 22.5;

const Checkbox = ({detail}) => {

  const scale = useRef(new Animated.Value(0)).current;

  const [checked, setChecked] = useState(detail.on);
  useEffect(()=>{
    Animated.timing(scale, {
      useNativeDriver: false,
      duration: 200,
      toValue: checked ? 1 : 0,
      timing: Easing.inOut(Easing.ease)
    }).start();
  }, [checked])

  const toggleValue = () => {
    setChecked(v=>!v);
    detail.on = !detail.on;
  }

  return (
    <View style={detailsStyles.itemContainer}>
      <Text style={textStyles.normalOfSize(16)}>{detail.title}</Text>
      <TouchableOpacity onPress={toggleValue}>
        <View style={detailsStyles.checkboxContainer}>
          <Animated.Image style={detailsStyles.leaf(scale)} source={require("../../../assets/images/leaf_small.png")} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const detailsStyles = StyleSheet.create({

  checkboxesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end'
  },

  itemContainer: {
    marginVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    width: '50%'
  },
  leaf: (scale) => ({
    transform: [ {scale} ]
  }),
  checkboxContainer: {
    marginLeft: 8,
    height: CHECKBOX_SIZE,
    width: CHECKBOX_SIZE,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.treeBlues,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    marginVertical: 16,
    flex: 1,
    alignItems: 'stretch'
  }
})

const styles = StyleSheet.create({

  titlesContainer: {
    marginTop: 23
  },

  firstContainer: {
    flex: 1,
    alignItems: 'stretch'
  },

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