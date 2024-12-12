import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  FormLabel,
  FormHelperText,
  Paper,
  Box
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: '20px',
    '& .MuiFormLabel-root': {
      fontSize: '16px',
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
  icon: {
    color: '#666',
    marginRight: '8px',
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

const IncomeStep = ({ formData, handleChange, error }) => {
  const classes = useStyles();

  const incomeOptions = [
    { value: 'above7000', label: 'מעל 7,000 ש"ח', icon: <AttachMoneyIcon /> },
    { value: 'below7000', label: 'מתחת ל-7,000 ש"ח', icon: <MoneyOffIcon /> },
  ];

  const severancePayOptions = [
    { value: 'yes', label: 'כן' },
    { value: 'no', label: 'לא' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
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
            <div 
              key={option.value}
              className={`${classes.radioOption} ${
                formData.income === option.value ? classes.selectedOption : ''
              }`}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {React.cloneElement(option.icon, { className: classes.icon })}
                    {option.label}
                  </div>
                }
                className={classes.radioLabel}
              />
            </div>
          ))}
        </RadioGroup>
        
        {error && (
          <FormHelperText className={classes.error}>
            {error}
          </FormHelperText>
        )}
      </FormControl>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center">
          האם במהלך 6 השנים האחרונות משכת כספי פיצויים / פנסיה ושילמת 35% מס?
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <FormControl component="fieldset">
            <RadioGroup
              value={formData.severancePay || ''}
              onChange={handleChange}
              name="severancePay"
            >
              {severancePayOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default IncomeStep;
