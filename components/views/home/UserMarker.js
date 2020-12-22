import React, { useState, useCallback, useEffect } from "react";
import { Image, View } from "react-native";
import { Marker } from "react-native-maps";
import { markerStyles } from '../../views/progress/PathSegment'

export const UserMarker = ({ user, location }) => {
  const [trackChanges, setTrackChanges] = useState(0);
  const updateTrackChanged = useCallback(() => {
    setTrackChanges(v=>(v + 1));
  }, [setTrackChanges]);
  useEffect(()=>{
    setTrackChanges(0);
  }, [user])
  return (
    <Marker zIndex={4} tracksViewChanges={trackChanges < 2} coordinate={location}>
      <View style={markerStyles.markerContainer}>
        <Image
          onLoad={updateTrackChanged}
          style={markerStyles.markerIcon}
          source={require("../../../assets/images/path_marker.png")}
        />
        <Image
          onLoad={updateTrackChanged}
          source={(user !== null && user.image !==null) ? { uri: user.image } : require("../../../assets/images/default_profile_pic.png")}
          style={markerStyles.profilePic}
        />
      </View>
    </Marker>
  );
};
