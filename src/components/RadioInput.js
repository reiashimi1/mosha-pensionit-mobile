import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const RadioInput = ({ options, selectedValue, onSelect, disabled }) => (
  <StyledView className="flex flex-row justify-between items-center w-full">
    {options.map((option) => (
      <StyledTouchableOpacity
        key={option.value}
        className="flex basis-1/2 items-center"
        onPress={() => onSelect(option.value)}
        disabled={disabled}
      >
        <StyledText>{option.label}</StyledText>
        <RadioButton
          value={option.label}
          status={option.value === selectedValue ? "checked" : "unchecked"}
          onPress={() => onSelect(option.value)}
          color="blue"
        />
      </StyledTouchableOpacity>
    ))}
  </StyledView>
);

export default RadioInput;
