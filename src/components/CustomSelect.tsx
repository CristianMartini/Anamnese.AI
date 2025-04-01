import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectProps } from '@mui/material';

// Substituímos "interface" por "type" com interseção
type CustomSelectProps = SelectProps & {
  label: string;
};

const CustomSelect: React.FC<CustomSelectProps> = ({ label, ...props }) => {
  return (
    <FormControl fullWidth variant="outlined" sx={{ backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...props}
        label={label}
        sx={{
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#e0e0e0',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a90e2',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4a90e2',
          },
        }}
      >
        <MenuItem value="Não">Não</MenuItem>
        <MenuItem value="Sim">Sim</MenuItem>
      </Select>
    </FormControl>
  );
};

export default CustomSelect;