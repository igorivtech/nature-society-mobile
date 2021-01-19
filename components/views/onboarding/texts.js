import React, { useEffect, useRef } from "react";
import {
  View,
  Animated,
  Easing,
  StyleSheet} from "react-native";
import { strings } from "../../../values/strings";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";
import { colors } from "../../../values/colors";
import Highlighter from 'react-native-highlight-words';

export const TextsView = ({index}) => {
    const opacity_0 = useRef((new Animated.Value(1))).current;
    const opacity_1 = useRef((new Animated.Value(0))).current;
    const opacity_2 = useRef((new Animated.Value(0))).current;
    useEffect(()=>{
      Animated.parallel(
        [opacity_0, opacity_1, opacity_2].map((v, i) => Animated.timing(v, {
          useNativeDriver: true,
          toValue: i === index ? 1 : 0,
          easing: Easing.inOut(Easing.ease)
        }))
      ).start();
    }, [index])
    return (
      <View style={styles.textsContainer}>
        <Text1 opacity={opacity_0} />
        <Text2 opacity={opacity_1} />
        <Text3 opacity={opacity_2} />
      </View>
    )
  }
  
  const Highlight = ({regular, highlight, text, words, position = 'relative'}) => {
    return (
      <Highlighter
        style={[regular, {position, lineHeight: regular.fontSize}]}
        highlightStyle={highlight}
        searchWords={words}
        textToHighlight={text}
      />
    )
  }
  
  const Text1 = ({opacity}) => {
    return (
      <Animated.View style={{opacity, ...globalStyles.centerChildren}}>
        <Highlight 
          regular={textStyles.normalOfSize(24, colors.darkWithTone, 'center')}
          highlight={textStyles.boldOfSize(24, colors.darkWithTone, 'center')}
          text={strings.onboardingScreen.newItem1}
          words={['חפשו']}
        />
        <Highlight 
          position='absolute'
          regular={textStyles.normalOfSize(24, colors.clear, 'center')}
          highlight={textStyles.normalOfSize(24, colors.treeBlues, 'center')}
          text={strings.onboardingScreen.newItem1}
          words={[
            'נקיים',
            'ריקים מאדם'
          ]}
        />
        <Highlight 
          position='absolute'
          regular={textStyles.normalOfSize(24, colors.clear, 'center')}
          highlight={textStyles.normalOfSize(24, colors.desertRock, 'center')}
          text={strings.onboardingScreen.newItem1}
          words={[
            'מלוכלכים',
            'עמוסים במבקרים'
          ]}
        />
      </Animated.View>
    )
  }
  
  const Text2 = ({opacity}) => {
    return (
      <Animated.View style={{
        position: 'absolute',
        ...globalStyles.centerChildren,
        opacity
      }}>
        <Highlight 
          regular={textStyles.normalOfSize(24, colors.darkWithTone, 'center')}
          highlight={textStyles.boldOfSize(24, colors.darkWithTone, 'center')}
          text={strings.onboardingScreen.newItem2}
          words={['דווחו']}
        />
      </Animated.View>
    )
  }
  
  const Text3 = ({opacity}) => {
    return (
      <Animated.View style={{
        position: 'absolute',
        ...globalStyles.centerChildren,
        opacity
      }}>
        <Highlight 
          regular={textStyles.normalOfSize(24, colors.darkWithTone, 'center')}
          highlight={textStyles.boldOfSize(24, colors.darkWithTone, 'center')}
          text={strings.onboardingScreen.newItem3}
          words={['התקדמו']}
        />
      </Animated.View>
    )
  }

  const styles = StyleSheet.create({
    textsContainer: {
      ...globalStyles.shadow,
      justifyContent: 'center',
      alignItems: 'center',
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 15,
      paddingVertical: 16
    },
})