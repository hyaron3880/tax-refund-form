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
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

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
    width: '100%',
    margin: 0,
    padding: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '17px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    '& .MuiRadio-root': {
      color: '#1a237e',
      '&.Mui-checked': {
        color: '#1a237e',
      },
    },
  },
  icon: {
    color: '#1a237e',
    marginRight: '5px',
    marginLeft: '5px',
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

const JobHistoryStep = ({ formData, handleChange, error }) => {
  const classes = useStyles();

  const options = [
    { value: 'changed', label: 'כן, החלפתי מקום עבודה', icon: <ChangeCircleIcon /> },
    { value: 'same', label: 'לא, נשארתי באותו מקום עבודה', icon: <HomeWorkIcon /> },
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
          id="job-history-label"
        >
          האם החלפת מקום עבודה בשנים האחרונות?
        </FormLabel>
        
        <RadioGroup
          aria-labelledby="job-history-label"
          name="jobHistory"
          value={formData.jobHistory || ''}
          onChange={handleChange}
          className={classes.radioGroup}
        >
          {options.map((option) => (
            <div 
              key={option.value}
              className={`${classes.radioOption} ${
                formData.jobHistory === option.value ? classes.selectedOption : ''
              }`}
            >
              <FormControlLabel
                value={option.value}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    {React.cloneElement(option.icon, { className: classes.icon })}
                    <span>{option.label}</span>
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
    </motion.div>
  );
};

export default JobHistoryStep;
