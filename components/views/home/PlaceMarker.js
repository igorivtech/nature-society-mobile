import React, { useState, useCallback } from "react";
import { Image } from "react-native";
import { Marker } from "react-native-maps";

export const PlaceMarker = ({place}) => {
    const [trackChanges, setTrackChanges] = useState(true)
  
    const turnOffTrackChanged = useCallback(()=>{
      setTrackChanges(false);
    }, [setTrackChanges])
    
    return (
      <Marker coordinate={place.position} tracksViewChanges={trackChanges}>
        <Image onLoad={turnOffTrackChanged} source={place.cleanness > 3 ? require("../../../assets/images/marker_good.png") : require("../../../assets/images/marker_bad.png")} />
      </Marker>
    )
  }