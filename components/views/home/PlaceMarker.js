import React, { useState, useCallback } from "react";
import { Animated, Image } from "react-native";
import { Marker } from "react-native-maps";
import { ITEM_WIDTH } from "./PlaceCard";

export const PlaceMarker = ({globalTracksViewChanges, place, onPress, scrollX, index, selectedPlace}) => {
    const [trackChanges, setTrackChanges] = useState(true)

    const scale = scrollX.interpolate({
      inputRange: [ (index - 1) * ITEM_WIDTH, index*ITEM_WIDTH, (index+1)*ITEM_WIDTH ],
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp'
    })

    const opacity = scrollX.interpolate({
      inputRange: [ (index - 1) * ITEM_WIDTH, index*ITEM_WIDTH, (index+1)*ITEM_WIDTH ],
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp'
    })
  
    const turnOffTrackChanged = useCallback(()=>{
      setTrackChanges(false);
    }, [setTrackChanges])

    const p = useCallback(()=>{
      onPress(place);
    }, [place])
    
    return (
      <Marker zIndex={selectedPlace != null ? (selectedPlace.key === place.key ? 2 : 1) : 1} tracksViewChanges={trackChanges || globalTracksViewChanges} onPress={p} coordinate={place.position}>
        <Animated.View style={{
            opacity,
            transform: [{scale}]
          }}>
          <Image onLoad={turnOffTrackChanged} source={place.cleanness > 3 ? require("../../../assets/images/marker_good.png") : require("../../../assets/images/marker_bad.png")} />
        </Animated.View>
      </Marker>
    )
  }

  // tracksViewChanges={trackChanges}