import React, { memo, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
} from "react-native";
import Svg, { Path } from "react-native-svg";
var path = require("svg-path-properties");

const pathPadding = 0;

export const PathSegment = memo(({ current = false, done = false, pathHeight, pathWidth }) => {
    const markerImage = done ? require("../../../assets/images/path_marker_big.png") : require("../../../assets/images/path_marker_small.png");

    const topMarkerPosition = 0.2;
    const userProgress = 0.5;
    const bottomMarkerPosition = 0.8;

    const markerRef = useRef();
    const markerSmallRef = useRef();
    const markerBigRef = useRef();
    const [markerHeight, setMarkerHeight] = useState(0);
    const [markerWidth, setMarkerWidth] = useState(0);

    const line = `
    M${pathWidth / 2},0
    C${pathWidth - pathPadding},${pathHeight * 0.25}
    ${pathPadding},${pathHeight * 0.75}
    ${pathWidth / 2},${pathHeight}
  `;
    const properties = path.svgPathProperties(line);
    const lineLength = properties.getTotalLength();

    useEffect(() => {
      if (pathHeight > 0 && markerHeight > 0 && markerWidth > 0) {
        const { x, y } = properties.getPointAtLength(lineLength * userProgress);
        markerRef.current.setNativeProps({
          top: y,
          left: x,
          transform: [
            { translateY: -markerHeight },
            { translateX: -markerWidth / 2 },
          ],
        });
      }
    }, [pathHeight, markerHeight, markerWidth]);

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
          <Svg>
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
          <Svg>
            <Path d={line} stroke="black" strokeWidth={done ? 2 : 1} />
          </Svg>
        )}

        {current ? (
          <View style={StyleSheet.absoluteFill}>
            <Image
              style={styles.marker}
              onLayout={(e) => {
                setMarkerHeight(e.nativeEvent.layout.height);
                setMarkerWidth(e.nativeEvent.layout.width);
              }}
              ref={markerRef}
              source={require("../../../assets/images/path_marker.png")}
            />
            <Image style={styles.marker} ref={markerSmallRef} source={require("../../../assets/images/path_marker_small.png")} />
            <Image style={styles.marker} ref={markerBigRef} source={require("../../../assets/images/path_marker_big.png")} />
          </View>
        ) : (
          <View style={StyleSheet.absoluteFill}>
            <Image style={styles.marker} ref={markerSmallRef} source={markerImage} />
            <Image style={styles.marker} ref={markerBigRef} source={markerImage} />
          </View>
        )}
      
      </View>
    );
  }
);

const styles = StyleSheet.create({
  marker: {
    position: "absolute",
  },

  pathContainer: (height, width) => ({
    height,
    width,
  }),

});
