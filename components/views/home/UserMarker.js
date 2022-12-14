import React, { useState, useCallback, useEffect, memo } from "react";
import { Image, Platform, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { colors } from "../../../values/colors";

const isAndroid = Platform.OS === 'android'

export const UserMarker = memo(({ user, location }) => {
  const [trackNumber, setTrackNumber] = useState(0);
  const [trackChanges, setTrackChanges] = useState(0);

  const updateTrackChanged = useCallback(() => {
    setTrackChanges(v=>(v + 1));
  }, [setTrackChanges]);
  useEffect(()=>{
    setTrackChanges(0);
    setTrackNumber(user !== null && user.image != null ? 3 : 2);
  }, [user])

  return (
    <Marker style={markerStyles.markerContainer} zIndex={4} tracksViewChanges={isAndroid ? true : trackChanges < trackNumber} coordinate={location}>
      <View style={markerStyles.markerInnerContainer}>
        <Image
          onLoad={updateTrackChanged}
          style={markerStyles.markerIcon}
          source={require("../../../assets/images/path_marker.png")}
        />
        <Image
          resizeMode='contain'
          onLoad={updateTrackChanged}
          source={require("../../../assets/images/default_profile_pic.png")}
          style={markerStyles.avatar}
        />
        {user !== null && user.image != null ? (
          <Image
            onLoad={updateTrackChanged}
            source={{ uri: user.image }}
            style={markerStyles.profilePic}
          />
        ) : null}
      </View>
    </Marker>
  );
});

export const markerStyles = StyleSheet.create({

  markerContainer: {
    height: 51,
    width: 51,
  },

  markerIcon: {
    position: 'absolute'
  },

  avatar: {
    resizeMode: 'contain',
    position: 'absolute',
    top: 10,
  },

  profilePic: {
    marginTop: 7.5,
    backgroundColor: colors.clear,
    transform: [{translateX: -0.05}, {translateY: 0.2}],
    width: 31,
    height: 31,
    borderRadius: 31/2
  },

  markerInnerContainer: {
    zIndex: 2,
    ...StyleSheet.absoluteFill,
    alignItems: 'center'
  },
})