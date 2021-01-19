import React, { useState, useCallback, useEffect, useRef, memo } from "react";
import { Animated, Easing, Image, StyleSheet, View } from "react-native";
import { Marker } from "react-native-maps";
import { isAndroid } from "../../../values/consts";
import { ITEM_WIDTH } from "./PlaceCard";

export const PlaceMarker = memo(({keepMarkerAlive, globalShow, place, onPress, scrollX, index, selected}) => {

  const [image, setImage] = useState(null);
  const [loadingImage, setLoadingImage] = useState(true);
  const [loadingScale, setLoadingScale] = useState(true);

  const firstTime = useRef(true);

  const scale = useRef(new Animated.Value(0)).current;
  const opacity = scale.interpolate({
    inputRange: [0, 0.6, 0.8],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  })  
  const translateY = scale.interpolate({
    inputRange: [0, 0.8],
    outputRange: [64*0.8/2, 0],
    extrapolate: 'clamp'
  });

  useEffect(()=>{
    if (loadingImage) {
      return;
    }
    const delay = firstTime.current ? index * 100 : 0;
    firstTime.current = false;
    setLoadingScale(true);
    Animated.timing(scale, {
      toValue: selected ? 0.8 : 0.6,
      useNativeDriver: true,
      easing: Easing.inOut(Easing.ease),
      duration: 300,
      delay,
    }).start(()=>{
      setLoadingScale(false);
    });
  }, [selected, loadingImage])

  // useEffect(()=>{
  //   if (globalShow !== null) {
  //     if (!globalShow && keepMarkerAlive.current[place._id] != null) {
  //       return;
  //     }
  //     setTrackChanges(v=>v-1);
  //     Animated.timing(scale, {
  //       delay: index * (globalShow ? 100 : 50),
  //       duration: 300,
  //       useNativeDriver: true,
  //       toValue: globalShow ? 0.8 : 0,
  //       easing: Easing.inOut(Easing.ease)
  //     }).start(()=>{
  //       setTrackChanges(v=>v+1);
  //     })
  //   }
  // }, [globalShow])

  const p = useCallback(()=>{
    onPress(place);
  }, [place, onPress])

  useEffect(()=>{
    if (place) {
      const newImage = place.cleanness >= 3 ? require("../../../assets/images/marker_good.png") : require("../../../assets/images/marker_bad.png");
      if (image !== newImage) {
        setImage(newImage)
      }
    }
  }, [place])

  return (
    <Marker
      // key={`key_${place.position.longitude}_${place.position.latitude}`} 
      zIndex={selected ? 2 : 1} 
      tracksViewChanges={isAndroid ? true : loadingImage || loadingScale}
      onPress={p} 
      coordinate={place.position}
    >
      <View style={styles.container}>
        <Animated.Image onLoadStart={()=>setLoadingImage(true)} onLoadEnd={()=>setLoadingImage(false)} style={styles.marker(scale, translateY, opacity)} source={image} />
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
  marker: (scale, translateY, opacity)=>({
    opacity,
    position: 'absolute',
    bottom: 0,
    transform: [{translateY}, {scale}]
  })
})

//

// import React, { useState, useCallback, useEffect, useRef, memo } from "react";
// import { Animated, Easing, Image, StyleSheet, View } from "react-native";
// import { Marker } from "react-native-maps";
// import { ITEM_WIDTH } from "./PlaceCard";

// export const PlaceMarker = memo(({keepMarkerAlive, globalShow, place, onPress, scrollX, index, selectedPlace}) => {
//   const [trackChanges, setTrackChanges] = useState(0)
//   const [image, setImage] = useState(null);

//   // const scale = scrollX.interpolate({
//   //   inputRange: [ (index - 1) * ITEM_WIDTH, index*ITEM_WIDTH, (index+1)*ITEM_WIDTH ],
//   //   // outputRange: [0.75, 1, 0.75],
//   //   outputRange: [0.75, 0.75, 0.75],
//   //   extrapolate: 'clamp'
//   // })

//   const scale = useRef(new Animated.Value(0)).current;
//   const translateY = scale.interpolate({
//     inputRange: [0, 1],
//     outputRange: [64*0.8/2, 0]
//   });

//   // useEffect(()=>{
//   //   if (globalShow !== null) {
//   //     if (!globalShow && keepMarkerAlive.current[place._id] != null) {
//   //       return;
//   //     }
//   //     setTrackChanges(v=>v-1);
//   //     Animated.timing(scale, {
//   //       delay: index * (globalShow ? 100 : 50),
//   //       duration: 300,
//   //       useNativeDriver: true,
//   //       toValue: globalShow ? 0.8 : 0,
//   //       easing: Easing.inOut(Easing.ease)
//   //     }).start(()=>{
//   //       setTrackChanges(v=>v+1);
//   //     })
//   //   }
//   // }, [globalShow])

//   useEffect(()=>{
//     if (trackChanges === 1) {
//       Animated.timing(scale, {
//         delay: index * 100,
//         duration: 300,
//         useNativeDriver: true,
//         toValue: 0.8,
//         easing: Easing.inOut(Easing.ease)
//       }).start(()=>{
//         setTrackChanges(2);
//       })
//     }
//   }, [trackChanges])
  
//   const opacity = scrollX.interpolate({
//     inputRange: [ (index - 1) * ITEM_WIDTH, index*ITEM_WIDTH, (index+1)*ITEM_WIDTH ],
//     outputRange: [0.6, 1, 0.6],
//     extrapolate: 'clamp'
//   })

//   const turnOffTrackChanged = useCallback(()=>{
//     setTrackChanges(1);
//   }, []);

//   const p = useCallback(()=>{
//     onPress(place);
//   }, [place, onPress])

//   useEffect(()=>{
//     if (place) {
//       setTrackChanges(0);
//       setImage(place.cleanness >= 3 ? require("../../../assets/images/marker_good.png") : require("../../../assets/images/marker_bad.png"))
//     }
//   }, [place])

//   return (
//     <Marker
//       // key={`key_${place.position.longitude}_${place.position.latitude}`} 
//       zIndex={selectedPlace != null ? (selectedPlace.key === place.key ? 2 : 1) : 1} 
//       tracksViewChanges={trackChanges < 2} 
//       onPress={p} 
//       coordinate={place.position}
//     >
//       <View style={styles.container}>
//         <Animated.Image style={styles.marker(scale, translateY)} onLoad={turnOffTrackChanged} source={image} />
//       </View>
//     </Marker>
//   )
// })

// // trackChanges || globalTracksViewChanges
// // tracksViewChanges={trackChanges}

// const styles = StyleSheet.create({
//   container: {
//     width: 66.11,
//     height: 63.12,
//     alignItems: 'center',
//     justifyContent: 'flex-end',
//   },
//   marker: (scale, translateY)=>({
//     position: 'absolute',
//     bottom: 0,
//     transform: [{translateY}, {scale}]
//   })
// })