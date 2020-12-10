import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";
import { Pagination } from "./Slider";
import { TakePicView, GoBackButton } from "./views";

export const Report = ({goBack}) => {

  const [image, setImage] = useState(null);

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

        <DetailsView />

      </View>
    </View>
  );
};

const DetailsView = ({}) => {
  return (
    <View style={{
      flex: 1,
      // backgroundColor: 'cyan'
    }}>

    </View>
  )
}

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