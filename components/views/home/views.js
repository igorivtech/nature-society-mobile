import React from "react";
import { View, TouchableOpacity, Image, Text } from "react-native";
import { styles } from "../../../values/styles";
import { textStyles } from "../../../values/textStyles";

const images = {
  0: require("../../../assets/images/Explore.png"),
  1: require("../../../assets/images/Report.png"),
  2: require("../../../assets/images/Progress.png"),
};

export const HomeButton = ({ index, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={images[index]} />
    </TouchableOpacity>
  );
};

export const RecentVisitor = ({ title, details, image, large = false }) => {
  return (
    <View
      style={{ ...styles.cardLocationContainer, marginLeft: large ? 30 : 0 }}
    >
      <View
        style={{
          marginRight: large ? 12 : 8,
        }}
      >
        <Text style={textStyles.cardTitle}>{title}</Text>
        <Text style={textStyles.cardDetail}>{details}</Text>
      </View>
      <Image style={styles.cardVisitorPic(large)} source={{ uri: image }} />
    </View>
  );
};

export const RatingView = ({ rating, color, image }) => {
  return (
    <View style={styles.ratingContainer}>
      <Text style={textStyles.rating(color)}>{rating}</Text>

      <Image source={image} />
    </View>
  );
};
