import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from "react-native";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";

export const DetailsView = ({details, iHelped}) => {
    return (
      <View style={detailsStyles.container}>
        <Text style={textStyles.normalOfSize(18)}>{strings.reportScreen.additionalInfo}</Text>
        <View style={detailsStyles.checkboxesContainer}>
          {details.map(detail => <Checkbox key={detail.id} detail={detail} />)}
        </View>
        <View style={{
          alignItems: 'flex-end',
          marginVertical: 8,
        }}>
          <Checkbox large={true} detail={iHelped} />
        </View>
      </View>
    )
  }
  
  const CHECKBOX_SIZE = 22.5;
  const CHECKBOX_SIZE_LARGE = 44;
  
  export const Checkbox = ({detail, large = false}) => {
  
    const image = large ? require("../../../assets/images/leaf_big.png") : require("../../../assets/images/leaf_small.png")
  
    const scale = useRef(new Animated.Value(0)).current;
  
    const [checked, setChecked] = useState(detail.on);
    useEffect(()=>{
      Animated.timing(scale, {
        useNativeDriver: true,
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
      <View style={detailsStyles.itemContainer(large)}>
        <Text style={textStyles.normalOfSize(large ? 18 : 16)}>{detail.title}</Text>
        <TouchableOpacity onPress={toggleValue}>
          <View style={detailsStyles.checkboxContainer(large)}>
            <Animated.Image style={detailsStyles.leaf(scale)} source={image} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  
  const detailsStyles = StyleSheet.create({
  
    checkboxesContainer: {
      marginTop: 8,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end'
    },
  
    itemContainer: (large) => ({
      marginVertical: 7,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      backgroundColor: 'white',
      width: large ? '100%' : '50%'
    }),
    leaf: (scale) => ({
      transform: [ {scale} ]
    }),
    checkboxContainer: (large) => ({
      marginLeft: large ? 12 : 8,
      height: large ? CHECKBOX_SIZE_LARGE : CHECKBOX_SIZE,
      width: large ? CHECKBOX_SIZE_LARGE : CHECKBOX_SIZE,
      borderRadius: large ? 10 : 5,
      borderWidth: 1,
      borderColor: colors.treeBlues,
      justifyContent: 'center',
      alignItems: 'center'
    }),
    container: {
      marginVertical: 16,
      flex: 1,
      alignItems: 'stretch'
    }
  })