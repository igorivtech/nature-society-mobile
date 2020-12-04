import React, { memo, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Animated,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { height, width } from "../../../values/consts";
import { EXIT_SIZE } from "../../screens/ExploreScreen";
var path = require("svg-path-properties");

const pathPadding = 0;
const animationPadding = height * 0.4;
const animationCenterExtra = 70;
//
const pathWidth = width - EXIT_SIZE;
const pathXCenter = pathWidth*0.3
//
const topMarkerPosition = 0.15;
const userProgress = 0.5;
const bottomMarkerPosition = 0.8;
//
const markerHeight = 72;
const markerWidth = 65;

export const PathSegment = memo(({ scrollY, index, current = false, done = false, pathHeight }) => {

    const markerImage = done ? require("../../../assets/images/path_marker_big.png") : require("../../../assets/images/path_marker_small.png");

    const markerRef = useRef();
    const markerSmallRef = useRef();
    const markerBigRef = useRef();

  //   const line = `
  //   M${pathWidth / 2},0
  //   C${pathWidth - pathPadding},${pathHeight * 0.25}
  //   ${pathPadding},${pathHeight * 0.75}
  //   ${pathWidth / 2},${pathHeight}
  // `;

    const line = `
    M${pathXCenter},0
    C${pathXCenter + 100},${pathHeight * 0.25}
    ${pathXCenter - 100},${pathHeight * 0.75}
    ${pathXCenter},${pathHeight}
  `;

    const properties = path.svgPathProperties(line);
    const lineLength = properties.getTotalLength();

    const inputRange = pathHeight > 0 ? [
      (index - 1) * pathHeight + animationPadding, 
      index * pathHeight - animationCenterExtra, 
      index * pathHeight, 
      index * pathHeight + animationCenterExtra, 
      (index + 1) * pathHeight - animationPadding
    ] : [0, 0, 0, 0, 0]

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0, 1, 1, 1, 0],
      extrapolate: 'clamp'
    })

    useEffect(() => {
      if (current && pathHeight > 0) {
        const { x, y } = properties.getPointAtLength(lineLength * userProgress);
        markerRef.current.setNativeProps({
          top: y,
          left: x,
          transform: [
            { translateY: -markerHeight },
            { translateX: (-markerWidth / 2) + 4 },
          ],
        });
      }
    }, [pathHeight]);

    useEffect(() => {
      if (pathHeight > 0) {
        // small
        const pSmall = properties.getPointAtLength(lineLength * topMarkerPosition);
        markerSmallRef.current.setNativeProps({
          top: pSmall.y,
          left: pSmall.x,
          transform: [
            { translateY: -(current ? 34 : done ? 76 : 34) / 2 },
            { translateX: -(current ? 34 : done ? 76 : 34) / 2 },
          ],
        });
        // big
        const pBig = properties.getPointAtLength(lineLength * bottomMarkerPosition);
        markerBigRef.current.setNativeProps({
          top: pBig.y,
          left: pBig.x,
          transform: [
            { translateY: -(current ? 76 : done ? 76 : 34) / 2 },
            { translateX: -(current ? 76 : done ? 76 : 34) / 2 },
          ],
        });
      }
    }, [pathHeight]);

    if (pathHeight === 0) {
      return <View />;
    }

    return (
      <View style={styles.pathContainer(pathHeight, pathWidth)}>
        {current ? (
          <Svg width={pathWidth} height={pathHeight} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
            <Path d={line} stroke="black" strokeWidth={1} />
            <Path
              d={line}
              stroke="black"
              strokeWidth={2}
              strokeDasharray={lineLength}
              strokeDashoffset={-userProgress * lineLength + markerHeight / 2}
            />
          </Svg>
        ) : (
          <Svg width={pathWidth} height={pathHeight} viewBox={`0 0 ${pathWidth} ${pathHeight}`}>
            <Path d={line} stroke="black" strokeWidth={done ? 2 : 1} />
          </Svg>
        )}

        {current ? (
          <View style={StyleSheet.absoluteFill}>
            <Image style={styles.marker} ref={markerRef} source={require("../../../assets/images/path_marker.png")} />
            <Image style={styles.marker} ref={markerSmallRef} source={require("../../../assets/images/path_marker_small.png")} />
            <Image style={styles.marker} ref={markerBigRef} source={require("../../../assets/images/path_marker_big.png")} />
          </View>
        ) : (
          <View style={StyleSheet.absoluteFill}>
            <Image style={styles.marker} ref={markerSmallRef} source={markerImage} />
            <Image style={styles.marker} ref={markerBigRef} source={markerImage} />
          </View>
        )}

        {pathWidth*pathHeight > 0 && (
          <Animated.Image style={styles.trees(pathHeight, pathWidth, opacity, opacity)} source={require("../../../assets/images/trees.png")} />
        )}
        
      </View>
    );
  }
);

// path_marker - 65 × 72
// trees - 52 × 82

const styles = StyleSheet.create({

  trees: (pathHeight, pathWidth, opacity, scale) => ({
    position: 'absolute',
    top: pathHeight/2,
    left: pathWidth / 2 + 52/2,
    opacity,
    transform: [ {scale} ]
  }),

  marker: {
    position: "absolute",
  },

  pathContainer: (height, width) => ({
    height,
    width,
  }),

});
