import React, { useState, useCallback, useEffect } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";

const isAndroid = Platform.OS === 'android'

export const UserMarker = ({ user, location }) => {
  const [trackChanges, setTrackChanges] = useState(0);
  const updateTrackChanged = useCallback(() => {
    setTrackChanges(v=>(v + 1));
  }, [setTrackChanges]);
  useEffect(()=>{
    setTrackChanges(0);
  }, [user])
  return (
    <Marker style={markerStyles.markerContainer} zIndex={4} tracksViewChanges={isAndroid ? true : trackChanges < 2} coordinate={location}>
      <View style={markerStyles.markerInnerContainer}>
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

export const markerStyles = StyleSheet.create({

  markerContainer: {
    height: 72,
    width: 65,
  },

  markerIcon: {
    position: 'absolute'
  },

  profilePic: {
    marginTop: 11,
    backgroundColor: 'white',
    width: 31.2,
    height: 31.2,
    borderRadius: 31.2/2
  },

  markerInnerContainer: {
    zIndex: 2,
    ...StyleSheet.absoluteFill,
    alignItems: 'center'
  },
})