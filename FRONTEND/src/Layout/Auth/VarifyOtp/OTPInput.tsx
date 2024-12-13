import React, { useRef, useState } from 'react';
import { InputGroup, FormControl } from 'react-bootstrap';

// declare type for the props
type InputProps = {
  length?: number;
  onComplete: (pin: string) => void;
};

const OTPInput = ({ length = 4, onComplete }: InputProps) => {
  // Define the type for inputRef
  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));
  const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

  const handleTextChange = (input: string, index: number) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    if (newPin.every(digit => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  return (
    <InputGroup>
      {Array.from({ length }, (_, index) => (
        <FormControl
          key={index}
          type="text"
          maxLength={1}
          value={OTP[index]}
          onChange={e => handleTextChange(e.target.value, index)}
          ref={(ref: HTMLInputElement) => (inputRef.current[index] = ref)}
          style={{ marginRight: index === length - 1 ? '0' : '10px' }}
        />
      ))}
    </InputGroup>
  );
};

export default OTPInput;
