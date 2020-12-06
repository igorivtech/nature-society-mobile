import React, { useContext } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { UserContext } from "../../../context/context";
import { colors } from "../../../values/colors";
import { strings } from "../../../values/strings";
import { textStyles } from "../../../values/textStyles";

export const UserHeader = ({}) => {

    const {state} = useContext(UserContext);
    const {user} = state;
  
    return (
      <View style={styles.userHeader}>
  
        <View style={styles.headerNameContainer}>
          <View style={styles.headerTextsContainer}>
            <Text style={textStyles.boldOfSize(24)}>{user ? user.name : strings.guest}</Text>
            <Text style={textStyles.normalOfSize(18)}>{user ? user.lastAchievement : ""}</Text>
          </View>
          <Image source={require("../../../assets/images/flag_icon.png")} />
        </View>
  
        <View style={{
          marginTop: 24
        }}>
          <HeaderDetail value={user ? user.numOfReports : 0} title={strings.progressScreen.reportsTitle} icon={require("../../../assets/images/header_reports_icon.png")} />
          <HeaderDetail value={user ? user.points : 0} title={strings.progressScreen.pointsTitle} icon={require("../../../assets/images/header_points_icon.png")} />
        </View>
        
      </View>
    )
  }
  
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
      color: colors.userHeader
    },
  
    icon: {
      marginLeft: 4,
      height: 19,
      width: 19,
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
      flexDirection: 'row'
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