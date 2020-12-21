import React, { useState, useCallback } from "react";
import { Image, View } from "react-native";
import { Marker } from "react-native-maps";
import { markerStyles } from '../../views/progress/PathSegment'

export const UserMarker = ({ user, location }) => {
  const [trackChanges, setTrackChanges] = useState(0);
  const updateTrackChanged = useCallback(() => {
    setTrackChanges(v=>(v + 1));
  }, [setTrackChanges]);
  return (
    <Marker tracksViewChanges={trackChanges < 2} coordinate={location}>
      <View style={markerStyles.markerContainer}>
        <Image
          onLoad={updateTrackChanged}
          style={markerStyles.markerIcon}
          source={require("../../../assets/images/path_marker.png")}
        />
        <Image
          onLoad={updateTrackChanged}
          source={user !== null ? { uri: user.image } : null}
          style={markerStyles.profilePic}
        />
      </View>
    </Marker>
  );
};
