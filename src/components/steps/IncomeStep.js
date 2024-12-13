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
      fontSize: '17px',
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

  const severancePayOptions = [
    { value: 'yes', label: 'כן' },
    { value: 'no', label: 'לא' },
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
          מה הייתה ההכנסה החודשית הממוצעת שלך?
        </FormLabel>
        <RadioGroup
          aria-labelledby="income-label"
          name="income"
          value={formData.income || ''}
          onChange={handleChange}
          className={classes.radioGroup}
        >
          {incomeOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              className={`${classes.radioOption} ${
                formData.income === option.value ? classes.selectedOption : ''
              }`}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                }
                className={classes.radioLabel}
              />
            </motion.div>
          ))}
        </RadioGroup>
      </FormControl>

      <FormControl 
        component="fieldset" 
        className={`${classes.formControl} ${classes.questionContainer}`}
        error={Boolean(error)}
        fullWidth
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
          {severancePayOptions.map((option) => (
            <motion.div
              key={option.value}
              className={`${classes.radioOption} ${
                formData.severancePay === option.value ? classes.selectedOption : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={option.label}
                className={classes.radioLabel}
              />
            </motion.div>
          ))}
        </RadioGroup>
      </FormControl>
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </>
  );
};

export default IncomeStep;
