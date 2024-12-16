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
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: '20px',
    '& .MuiFormLabel-root': {
      fontSize: '18px',
      color: '#333',
      marginBottom: '15px',
      display: 'block',
    },
    width: '100%',
    padding: '0 16px',
  },
  radioGroup: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: 'calc(100% - 32px)',
    margin: '0 auto',
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
      fontSize: '17px',
      marginRight: '12px',
      flex: 1,
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
  questionContainer: {
    marginTop: '40px',
  },
  genderNote: {
    textAlign: 'right',
    color: '#666',
    fontSize: '14px',
    marginTop: '5px',
    marginBottom: '20px',
    fontStyle: 'italic',
  },
}));

const IncomeStep = ({ formData, handleChange, error }) => {
  const classes = useStyles();

  const incomeOptions = [
    { value: 'above7000', label: 'מעל 7,000 ש"ח', icon: <ArrowUpwardIcon sx={{ color: '#1a237e' }} /> },
    { value: 'below7000', label: 'מתחת ל-7,000 ש"ח', icon: <ArrowDownwardIcon sx={{ color: '#1a237e' }} /> },
  ];

  return (
    <>
      <FormControl 
        component="fieldset" 
        className={classes.formControl}
        error={Boolean(error)}
        fullWidth
      >
        <FormLabel 
          component="legend"
          id="income-label"
        >
          מה ההכנסה החודשית הממוצעת שלך?
        </FormLabel>
        <RadioGroup
          aria-label="income"
          name="income"
          value={formData.income}
          onChange={handleChange}
          className={classes.radioGroup}
        >
          {incomeOptions.map((option) => (
            <motion.div
              key={option.value}
              className={`${classes.radioOption} ${formData.income === option.value ? classes.selectedOption : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    {option.icon}
                    {option.label}
                  </div>
                }
                className={classes.radioLabel}
              />
            </motion.div>
          ))}
        </RadioGroup>
        {error && <FormHelperText error>{error}</FormHelperText>}
      </FormControl>
    </>
  );
};

export default IncomeStep;
