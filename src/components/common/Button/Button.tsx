import React from 'react';
import { MantineColor, Button as MantineButton, ButtonProps } from '@mantine/core';

interface CustomButtonProps extends ButtonProps {
  color?: MantineColor;
  variant?: 'filled' | 'outline' | 'light' | 'default' | 'subtle' | 'transparent';
}

const Button: React.FC<CustomButtonProps> = (props) => {
  return <MantineButton {...props} />;
};

export default Button;