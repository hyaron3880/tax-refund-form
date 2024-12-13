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
import WorkIcon from '@mui/icons-material/Work';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

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
}));

const EmploymentStatusStep = ({ formData, handleChange, error }) => {
  const classes = useStyles();

  const options = [
    { value: 'employed', label: 'עבדתי כשכיר', icon: <WorkIcon sx={{ color: '#1a237e' }} /> },
    { value: 'selfEmployed', label: 'עבדתי כעצמאי', icon: <BusinessCenterIcon sx={{ color: '#1a237e' }} /> },
    { value: 'unemployed', label: 'לא עבדתי', icon: <DoNotDisturbIcon sx={{ color: '#1a237e' }} /> },
    { value: 'bothEmployedAndSelfEmployed', label: 'הייתי גם שכיר וגם עצמאי', icon: <WorkHistoryIcon sx={{ color: '#1a237e' }} /> },
  ];

  return (
    <FormControl 
      component="fieldset" 
      className={classes.formControl}
      error={Boolean(error)}
      fullWidth
    >
      <FormLabel 
        component="legend"
        id="employment-status-label"
      >
        האם עבדת כשכיר בין השנים 2019 - 2024? (גם אם עבדת רק בחלק מהשנים)
      </FormLabel>
      <RadioGroup
        aria-labelledby="employment-status-label"
        name="employmentStatus"
        value={formData.employmentStatus || ''}
        onChange={handleChange}
        className={classes.radioGroup}
      >
        {options.map((option) => (
          <motion.div
            key={option.value}
            whileHover={{ scale: 1.02 }}
            className={`${classes.radioOption} ${
              formData.employmentStatus === option.value ? classes.selectedOption : ''
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
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </FormControl>
  );
};

export default EmploymentStatusStep;
