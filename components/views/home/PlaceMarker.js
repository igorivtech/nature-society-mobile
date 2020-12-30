import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { ITEM_WIDTH } from "./PlaceCard";

export const PlaceMarker = memo(({globalTracksViewChanges, place, onPress, scrollX, index, selectedPlace}) => {
  const [trackChanges, setTrackChanges] = useState(0)
  const [image, setImage] = useState(null);

  // const scale = scrollX.interpolate({
  //   inputRange: [ (index - 1) * ITEM_WIDTH, index*ITEM_WIDTH, (index+1)*ITEM_WIDTH ],
  //   // outputRange: [0.75, 1, 0.75],
  //   outputRange: [0.75, 0.75, 0.75],
  //   extrapolate: 'clamp'
  // })

  const scale = useRef(new Animated.Value(0)).current;
  
  useEffect(()=>{
    if (trackChanges === 1) {
      Animated.timing(scale, {
        delay: index * 100,
        duration: 300,
        useNativeDriver: true,
        toValue: 0.8,
        easing: Easing.inOut(Easing.ease)
      }).start(()=>{
        setTrackChanges(2);
      })
    }
  }, [trackChanges])

  const opacity = scrollX.interpolate({
    inputRange: [ (index - 1) * ITEM_WIDTH, index*ITEM_WIDTH, (index+1)*ITEM_WIDTH ],
    outputRange: [0.6, 1, 0.6],
    extrapolate: 'clamp'
  })

  const turnOffTrackChanged = useCallback(()=>{
    setTrackChanges(1);
  }, []);

  const p = useCallback(()=>{
    onPress(place);
  }, [place, onPress])

  useEffect(()=>{
    if (place) {
      setTrackChanges(0);
      setImage(place.cleanness >= 3 ? require("../../../assets/images/marker_good.png") : require("../../../assets/images/marker_bad.png"))
    }
  }, [place])

  return (
    <Marker reuseIdentifier={place.key} zIndex={selectedPlace != null ? (selectedPlace.key === place.key ? 2 : 1) : 1} tracksViewChanges={trackChanges < 2} onPress={p} coordinate={place.position}>
      <View style={styles.container}>
        <Animated.Image style={styles.marker(scale)} onLoad={turnOffTrackChanged} source={image} />
      </View>
    </Marker>
  )
})

// trackChanges || globalTracksViewChanges
// tracksViewChanges={trackChanges}

const styles = StyleSheet.create({
  container: {
    width: 66.11,
    height: 63.12,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  marker: (scale)=>({
    position: 'absolute',
    bottom: 0,
    transform: [{scale}]
  })
})