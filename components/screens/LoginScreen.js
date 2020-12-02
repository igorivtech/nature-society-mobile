import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from "react-native";
import { colors } from "../../values/colors";

export const LoginScreen = ({navigation}) => {

  const goBack = () => {
    navigation.goBack();
  }    

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity onPress={goBack}>
            <Text>Login</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.grass,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
