import TextInputMask from 'react-native-text-input-mask';

import React, { Component } from 'react';
import {
  View,
  Picker,
  Text
} from 'react-native';

//Styles
import stylesheet from './styles';

export const CustomCPFTemplate = (locals) => {
    if (locals.hidden) {
        return null;
    }

    let formGroupStyle = stylesheet.formGroup.normal;
    let controlLabelStyle = stylesheet.controlLabel.normal;

    let textStyle = Object.assign(
        {},
        stylesheet.textbox.normal
    );

    let helpBlockStyle = stylesheet.helpBlock.normal;
    let errorBlockStyle = stylesheet.errorBlock;


    if (locals.hasError) {
        formGroupStyle = stylesheet.formGroup.error;
        controlLabelStyle = stylesheet.controlLabel.error;
        //textStyle = stylesheet.textbox.error;
        helpBlockStyle = stylesheet.helpBlock.error;
    }

    let label = locals.label ? (
        <Text style={controlLabelStyle}>{locals.label}</Text>
    ) : null;
    let help = locals.help ? (
        <Text style={helpBlockStyle}>{locals.help}</Text>
    ) : null;
    let error =
        locals.hasError && locals.error ? (
        <Text accessibilityLiveRegion="polite" style={errorBlockStyle}>
            {locals.error}
        </Text>
    ) : null;
    
    return (
        <View style={formGroupStyle}>
        {label}
            <View>
                <TextInputMask 
                    style={textStyle} 
                    mask={"[000].[000].[000]-[00]"} 
                    onChangeText={locals.onChange}
                >
                {locals.value}
                </TextInputMask>
            </View>
        {help}
        {error}
        </View>
    );
}