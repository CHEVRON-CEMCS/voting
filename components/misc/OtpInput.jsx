import React, { memo, useState } from "react";
import { useCallback } from "react";
import SingleInput from "@/components/misc/SingleInputbutton";

const OtpInputField = ({
  inputLength,
  isNumberedArray,
  autoFocus,
  disabled,
  onChangeOtp,
}) => {
  const [activeInput, setActiveInput] = useState(0);
  const [otpValues, setOtpValues] = useState(Array(inputLength).fill(""));

  const handleOtpChange = useCallback(
    (otp) => {
      const otpValue = otp.join("");
      onChangeOtp(otpValue);
    },
    [onChangeOtp]
  );

  const getRightValue = useCallback(
    (str) => {
      let changedValue = str;

      if (!isNumberedArray || !changedValue) {
        return changedValue;
      }

      return Number(changedValue) >= 0 ? changedValue : "";
    },
    [isNumberedArray]
  );

  const changeCodeAtFocus = useCallback(
    (str) => {
      const updatedOTPValues = [...otpValues];
      updatedOTPValues[activeInput] = str[0] || "";
      setOtpValues(updatedOTPValues);
      handleOtpChange(updatedOTPValues);
    },
    [activeInput, handleOtpChange, otpValues]
  );

  const focusInput = useCallback(
    (inputIndex) => {
      const selectedIndex = Math.max(Math.min(inputLength - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [inputLength]
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  // Handle onFocus input
  const handleOnFocus = useCallback(
    (index) => () => {
      focusInput(index);
    },
    [focusInput]
  );

  const handleOnChange = useCallback(
    (e) => {
      const val = getRightValue(e.currentTarget.value);
      if (!val) {
        e.preventDefault();
        return;
      }
      changeCodeAtFocus(val);
      focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue]
  );

  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  const handleOnKeyDown = useCallback(
    (e) => {
      const pressedKey = e.key;
      switch (pressedKey) {
        case "Backspace":
        case "Delete": {
          e.preventDefault();
          if (otpValues[activeInput]) {
            changeCodeAtFocus("");
          } else {
            focusPrevInput();
          }
          break;
        }
        case "ArrowLeft": {
          e.preventDefault();
          focusPrevInput();
          break;
        }
        case "ArrowRight": {
          e.preventDefault();
          focusNextInput();
          break;
        }
        default: {
          if (pressedKey.match(/^[^a-zA-Z0-9]$/)) {
            e.preventDefault();
          }
          break;
        }
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, otpValues]
  );

  const handleOnPaste = useCallback(
    (e) => {
      e.preventDefault();
      const pastedData = e.clipboardData
        .getData("text/plain")
        .trim()
        .slice(0, inputLength - activeInput)
        .split("");
      if (pastedData) {
        let nextFocusIndex = 0;
        const updatedOTPValues = [...otpValues];
        updatedOTPValues.forEach((val, index) => {
          if (index >= activeInput) {
            const changedValue = getRightValue(pastedData.shift() || val);
            if (changedValue) {
              updatedOTPValues[index] = changedValue;
              nextFocusIndex = index;
            }
          }
        });
        setOtpValues(updatedOTPValues);
        setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
        handleOtpChange(updatedOTPValues);
      }
    },
    [activeInput, getRightValue, inputLength, otpValues, handleOtpChange]
  );

  return (
    <div className="flex items-center justify-center mt-8 gap-x-3">
      {Array(inputLength)
        .fill("")
        .map((_, index) => (
          <SingleInput
          focus={activeInput === index}
          key={`input-${index}`}
          type={"text"}
          value={otpValues && otpValues[index]}
          autoFocus={autoFocus}
          onFocus={handleOnFocus(index)}
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          onBlur={onBlur}
          onPaste={handleOnPaste}
          disabled={disabled}
          placeholder={0}
          inputMode="numeric" // Add inputMode here to specify numeric keyboard
          className="w-10 h-10 xl:w-20 xl:h-20 text-4xl font-medium text-center border rounded-lg outline-none border-[#272E3F] border-opacity-20 font-sora text-primary focus:shadow-sm focus:shadow-[#272E3F] placeholder:text-gray-300 placeholder:text-4xl selection:text-[#272E3F] overflow-y-hidden" // Add the overflow-x-hidden class
        />
        
          
        ))}
    </div>
  );
};

const OtpInput = memo(OtpInputField);

export default OtpInput;
