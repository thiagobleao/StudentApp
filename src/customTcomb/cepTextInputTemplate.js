import TextInputMask from 'react-native-text-input-mask';

import React, { Component } from 'react';
import {
  View,
  Picker,
  Text
} from 'react-native';

//Styles
import stylesheet from './styles';

export const CustomCEPTemplate = (locals) => {
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
        //textStyle = stylesheet.textbox.errorMask;
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
                    //accessibilityLabel={locals.label} 
                    style={textStyle} 
                    //ref="input"
                    mask={"[00].[000]-[000]"} 
                    onChangeText={locals.onChange}
                    //help={locals.help}
                    //enabled={locals.enabled}
                    //mode={locals.mode}
                    //prompt={locals.prompt}
                    //itemStyle={locals.itemStyle}
                >
                {locals.value}
                </TextInputMask>
            </View>
        {help}
        {error}
        </View>
    );
}