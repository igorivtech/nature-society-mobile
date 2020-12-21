import React, { useState, useCallback } from "react";
import { Image, View } from "react-native";
import { Marker } from "react-native-maps";
import { markerStyles } from '../../views/progress/PathSegment'

export const UserMarker = ({ user, location }) => {
  const [trackChanges, setTrackChanges] = useState(0);
  const turnOffTrackChanged = useCallback(() => {
    setTrackChanges((v) => v + 1);
  }, [setTrackChanges]);
  return (
    <Marker tracksViewChanges={true} coordinate={location}>
      <View style={markerStyles.markerContainer}>
        <Image
          onLoad={turnOffTrackChanged}
          style={markerStyles.markerIcon}
          source={require("../../../assets/images/path_marker.png")}
        />
        <Image
          onLoad={turnOffTrackChanged}
          source={user !== null ? { uri: user.image } : null}
          style={markerStyles.profilePic}
        />
      </View>
    </Marker>
  );
};
