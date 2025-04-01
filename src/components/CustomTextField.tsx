// CustomTextField.tsx
import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

const CustomTextField: React.FC<TextFieldProps> = (props) => {
  return (
    <TextField
      {...props}
      variant="outlined"
      fullWidth
      sx={{
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#e0e0e0',
          },
          '&:hover fieldset': {
            borderColor: '#4a90e2',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#4a90e2',
          },
        },
      }}
    />
  );
};

export default CustomTextField;