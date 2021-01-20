import React, { useContext, useEffect, useState, memo, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../../context/context";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { globalStyles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";
import { TapView } from "../general";

export const UserHeader = memo(({restartApp}) => {

    const {state} = useContext(UserContext);
    const {user, settings, offlineUser} = state;

    const [lastAchievement, setLastAchievement] = useState('');
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(()=>{
      if (lastAchievement.length > 0) {
        Animated.timing(opacity, {
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
          toValue: 1
        }).start();
      }
    }, [lastAchievement])

    useEffect(()=>{
      const numOfReports = user != null ? user.numOfReports : offlineUser.numOfReports
      let last = ''
      settings.achievements.forEach(achievement => {
        if (numOfReports >= achievement.score) {
          last = achievement.title;
        }
      });
      if (last.length > 0) {
        setLastAchievement(last)
      }
    }, [user, offlineUser])
  
    return (
      <View style={styles.userHeader}>
  
        <View style={styles.headerNameContainer}>
          <View style={styles.headerTextsContainer}>
            <Text style={textStyles.boldOfSize(24)}>{user ? user.name : strings.guest}</Text>
            <Animated.Text style={headerDetailsStyles.title(opacity)}>{lastAchievement}</Animated.Text>
          </View>
          {user != null && user.image != null ? (
            <Image style={headerDetailsStyles.userPic} source={{ uri: user.image }} />
          ) : (
            <Image style={globalStyles.imageJustContain} source={require("../../../assets/images/flag_icon.png")} />
          )}
        </View>
  
        <View style={{
          marginTop: 24
        }}>
          <HeaderDetail value={user ? user.numOfReports : offlineUser.numOfReports} title={strings.progressScreen.reportsTitle} icon={require("../../../assets/images/header_reports_icon.png")} />
          <HeaderDetail value={user ? user.points : offlineUser.points} title={strings.progressScreen.pointsTitle} icon={require("../../../assets/images/header_points_icon.png")} />
        </View>

        <TapView numberOfTaps={12} onPress={restartApp} />
        
      </View>
    )
  })
  
  export const HeaderDetail = ({icon, value, title}) => {
    return (
      <View style={headerDetailsStyles.container}>
        <View style={headerDetailsStyles.topContainer}>
          <Text style={headerDetailsStyles.valueText}>{value}</Text>
          <Image style={headerDetailsStyles.icon} source={icon} />
        </View>
        <Text style={headerDetailsStyles.bottomText}>{title}</Text>
      </View>
    )
  }
  
  const headerDetailsStyles = StyleSheet.create({

    userPic: {
      resizeMode: 'cover',
      height: 41,
      width: 41,
      borderRadius: 41/2,
      backgroundColor: colors.imageBg
    },

    title: (opacity) => ({
      ...textStyles.normalOfSize(18),
      opacity
    }),
  
    topContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    },
  
    container: {
      marginBottom: 12,
      alignItems: 'flex-end'
    },
  
    valueText: {
      ...textStyles.normalOfSize(24),
      color: colors.userHeader,
      paddingRight: 4,
    },
  
    icon: {
      height: 20,
      width: 20,
      resizeMode: 'contain'
    },
    bottomText: {
      marginTop: 4,
      ...textStyles.normalOfSize(14),
      color: colors.userHeader
    }
  })


const styles = StyleSheet.create({

    headerNameContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
  
    headerTextsContainer: {
      justifyContent: 'space-between',
      marginRight: 12
    },
  
    userHeader: {
      top: 30,
      right: 30,
      position: 'absolute',
      alignItems: 'flex-end',
      justifyContent: 'space-between'
    },
})  