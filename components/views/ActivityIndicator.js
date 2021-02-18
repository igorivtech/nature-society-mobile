import React from 'react';
import {ActivityIndicator as AI} from 'react-native';

export const ActivityIndicator = ({style = {}, animating = true, color}) => {
    return <AI style={style} color={color} animating={animating} />
}