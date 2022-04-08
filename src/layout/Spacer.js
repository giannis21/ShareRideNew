import React from "react";
import { View } from "react-native";

export function Spacer ({width,height}){
    return <View style={{height: height || 1, width:width || '100%'}}/>
}