import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: '20px',
    '& .MuiFormLabel-root': {
      fontSize: '16px',
      color: '#333',
      marginBottom: '15px',
      display: 'block',
      marginTop: '5px',
    },
  },
  radioGroup: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  radioOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    '&:hover': {
      backgroundColor: '#f5f7fa',
      borderColor: '#1a237e',
    },
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    margin: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '15px',
      marginRight: '12px',
    },
    '& .MuiRadio-root': {
      color: '#1a237e',
      '&.Mui-checked': {
        color: '#1a237e',
      },
    },
  },
  selectedOption: {
    backgroundColor: '#f5f7fa',
    borderColor: '#1a237e',
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.75rem',
    marginTop: '8px',
  },
}));

const SeverancePayStep = ({ formData, handleChange, error }) => {
  const classes = useStyles();

  const options = [
    { value: 'yes', label: 'כן' },
    { value: 'no', label: 'לא' },
  ];

  return (
    <FormControl 
      component="fieldset" 
      className={classes.formControl}
      error={Boolean(error)}
      fullWidth
      sx={{ marginTop: '5px' }}
    >
      <FormLabel 
        component="legend"
        id="severance-pay-label"
      >
        האם במהלך 6 השנים האחרונות משכת כספי פיצויים / פנסיה ושילמת 35% מס?
      </FormLabel>
      <RadioGroup
        aria-labelledby="severance-pay-label"
        name="severancePay"
        value={formData.severancePay || ''}
        onChange={handleChange}
        className={classes.radioGroup}
      >
        {options.map((option) => (
          <motion.div
            key={option.value}
            className={`${classes.radioOption} ${
              formData.severancePay === option.value ? classes.selectedOption : ''
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FormControlLabel
              control={<Radio value={option.value} />}
              label={option.label}
              className={classes.radioLabel}
            />
          </motion.div>
        ))}
      </RadioGroup>
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default SeverancePayStep;
