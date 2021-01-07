import AsyncStorage from "@react-native-community/async-storage";
import React, { useContext, useEffect, useRef, useState, memo } from "react";
import { Animated, Easing, Image } from "react-native";
import { UserContext } from "../../../context/context";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";
import useIsMounted from "ismounted";
import Portal from '@burstware/react-native-portal';

const HIDDEN_TRANSLATE_X = 130/2;
const TEXT_DURATION = 600;

const ALREADY_SHOWN = "ALREADY_SHOWN"

export const GrowthPoints = memo(({isFocused, popupVisible}) => {
  
  const {state} = useContext(UserContext);
  const {user} = state;

  const [points, setPoints] = useState(0);
  const [ready, setReady] = useState(false);

  const translateX = useRef(new Animated.Value(HIDDEN_TRANSLATE_X)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;

  const isMounted = useIsMounted();

  useEffect(()=>{
    setup();
  }, [])

  const setup = async () => {
    if (user !== null) {
      const shown = await AsyncStorage.getItem(ALREADY_SHOWN);
      if (shown === null) {
        await AsyncStorage.setItem(ALREADY_SHOWN, '1');
        if (!isMounted.current) {return}
        setReady(true);
      } else {
        if (!isMounted.current) {return}
        setPoints(user.points);
        show(true, 1000).start(()=>{
          show(false, 3500).start(()=>{
            if (!isMounted.current) {return}
            setReady(true);
          });
        })
      }
    } else {
      if (!isMounted.current) {return}
      setReady(true);
    }
  }

  useEffect(()=>{
    if (popupVisible || !ready) {
      return;
    }
    if (user && user.points !== points) {
      show(true, 1000).start(()=>{
        Animated.timing(textOpacity, {
          delay: 1000,
          toValue: 0,
          useNativeDriver: true,
          duration: TEXT_DURATION,
          easing: Easing.inOut(Easing.ease)
        }).start(()=>{
          if (isMounted.current) {
            setPoints(user.points);
            Animated.timing(textOpacity, {
              toValue: 1,
              useNativeDriver: true,
              duration: TEXT_DURATION,
              easing: Easing.inOut(Easing.ease)
            }).start(()=>{
              show(false, 3500).start();
            })
          }
        })
      })
    }
  }, [user, isFocused, popupVisible, ready]);

  const show = (show, delay) => {
    return Animated.parallel([
      Animated.timing(opacity, {
        delay,
        toValue: show ? 1 : 0,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(scale, {
        delay,
        toValue: show ? 1 : 0,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.inOut(Easing.ease)
      }),
      Animated.timing(translateX, {
        delay,
        toValue: show ? 0 : HIDDEN_TRANSLATE_X,
        useNativeDriver: true,
        duration: 800,
        easing: Easing.inOut(Easing.ease)
      })
    ])
  }

  return (
    <Portal>
      <Animated.View style={globalStyles.pointsGrowthContainer(opacity, scale, translateX)}>
        <Animated.Text
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          style={textStyles.pointsGrowthText(textOpacity)}
        >
          {points}
        </Animated.Text>
        <Image source={require("../../../assets/images/growth_icon.png")} />
      </Animated.View>
    </Portal>
  );
});

//

// import AsyncStorage from "@react-native-community/async-storage";
// import React, { useContext, useEffect, useRef, useState, memo } from "react";
// import { Animated, Easing, Image, StyleSheet, View, Modal } from "react-native";
// import { UserContext } from "../../../context/context";
// import { globalStyles } from "../../../values/styles";
// import { textStyles } from "../../../values/textStyles";
// import useIsMounted from "ismounted";
// import { height, SPLASH_HIDE_DELAY } from "../../../values/consts";

// const HIDDEN_TRANSLATE_X = 130/2;
// const TEXT_DURATION = 600;

// const ALREADY_SHOWN = "ALREADY_SHOWN"

// export const GrowthPoints = memo(({isFocused, popupVisible}) => {
  
//   const {state} = useContext(UserContext);
//   const {user} = state;

//   const [points, setPoints] = useState(0);
//   const [ready, setReady] = useState(false);

//   const translateX = useRef(new Animated.Value(HIDDEN_TRANSLATE_X)).current;
//   const opacity = useRef(new Animated.Value(0)).current;
//   const scale = useRef(new Animated.Value(0)).current;
//   const textOpacity = useRef(new Animated.Value(1)).current;

//   const isMounted = useIsMounted();
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(()=>{
//     setup();
//   }, [])

//   const setup = async () => {
//     if (user !== null) {
//       const shown = await AsyncStorage.getItem(ALREADY_SHOWN);
//       if (shown === null) {
//         await AsyncStorage.setItem(ALREADY_SHOWN, '1');
//         if (!isMounted.current) {return}
//         setReady(true);
//       } else {
//         setTimeout(() => {
//           if (!isMounted.current) {return}
//           setModalVisible(true);
//           setPoints(user.points);
//           show(true, 1000).start(()=>{
//             show(false, 3500).start(()=>{
//               if (!isMounted.current) {return}
//               setReady(true);
//               setModalVisible(false);
//             });
//           })  
//         }, 2*SPLASH_HIDE_DELAY);
//       }
//     } else {
//       if (!isMounted.current) {return}
//       setReady(true);
//     }
//   }

//   useEffect(()=>{
//     if (popupVisible || !ready) {
//       return;
//     }
//     if (user && user.points !== points) {
//       setModalVisible(true);
//       show(true, 1000).start(()=>{
//         Animated.timing(textOpacity, {
//           delay: 1000,
//           toValue: 0,
//           useNativeDriver: true,
//           duration: TEXT_DURATION,
//           easing: Easing.inOut(Easing.ease)
//         }).start(()=>{
//           if (isMounted.current) {
//             setPoints(user.points);
//             Animated.timing(textOpacity, {
//               toValue: 1,
//               useNativeDriver: true,
//               duration: TEXT_DURATION,
//               easing: Easing.inOut(Easing.ease)
//             }).start(()=>{
//               show(false, 3500).start(()=>{
//                 setModalVisible(false);
//               });
//             })
//           }
//         })
//       })
//     }
//   }, [user, popupVisible, ready]); // isFocused

//   const show = (show, delay) => {
//     return Animated.parallel([
//       Animated.timing(opacity, {
//         delay,
//         toValue: show ? 1 : 0,
//         useNativeDriver: true,
//         duration: 800,
//         easing: Easing.inOut(Easing.ease)
//       }),
//       Animated.timing(scale, {
//         delay,
//         toValue: show ? 1 : 0,
//         useNativeDriver: true,
//         duration: 800,
//         easing: Easing.inOut(Easing.ease)
//       }),
//       Animated.timing(translateX, {
//         delay,
//         toValue: show ? 0 : HIDDEN_TRANSLATE_X,
//         useNativeDriver: true,
//         duration: 800,
//         easing: Easing.inOut(Easing.ease)
//       })
//     ])
//   }

//   return (
//     <Modal pointerEvents='none' visible={modalVisible} transparent={true}>
//       <Animated.View style={globalStyles.pointsGrowthContainer(opacity, scale, translateX)}>
//         <Animated.Text
//           adjustsFontSizeToFit={true}
//           numberOfLines={1}
//           style={textStyles.pointsGrowthText(textOpacity)}
//         >
//           {points}
//         </Animated.Text>
//         <Image source={require("../../../assets/images/growth_icon.png")} />
//       </Animated.View>
//     </Modal>
//   );
// });
