import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Checkbox,
  Typography,
  FormLabel,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginBottom: '20px',
    width: '100%',
    padding: '0 16px',
    '& .MuiFormLabel-root': {
      fontSize: '18px',
      color: '#333',
      marginBottom: '15px',
      display: 'block',
    },
  },
  checkboxGroup: {
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
  },
  checkboxOption: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    backgroundColor: '#fff',
    width: 'calc(100% - 32px)',
    margin: '0 auto',
    '&:hover': {
      backgroundColor: '#f5f7fa',
      borderColor: '#1a237e',
    },
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    margin: 0,
    '& .MuiFormControlLabel-label': {
      fontSize: '17px',
      marginRight: '12px',
    },
    '& .MuiCheckbox-root': {
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
}));

const criteriaOptions = [
  {
    value: 'unemployment',
    label: 'קיבלתי אבטלה / כספים אחרים מביטוח לאומי'
  },
  {
    value: 'propertyTax',
    label: 'מכרתי נכס ושילמתי מס שבח'
  },
  {
    value: 'securities',
    label: 'סחרתי בניירות ערך סחירים'
  },
  {
    value: 'lifeInsurance',
    label: 'יש לי ביטוח חיים פרטי / ביטוח משכנתא'
  },
  {
    value: 'pensionDeposit',
    label: 'הפקדתי באופן עצמאי לקופת גמל'
  },
  {
    value: 'donations',
    label: 'תרמתי למוסדות מוכרים בסכום העולה על 190 שח בשנה'
  },
  {
    value: 'disability',
    label: 'אני או אחד מבני משפחתי מדרגה ראשונה בעל נכות מעל 90%'
  },
  {
    value: 'militaryService',
    label: 'השתחררתי מצה״ל / שירות לאומי ב-8 השנים האחרונות'
  },
  {
    value: 'education',
    label: 'סיימתי תואר / לימודי תעודה ב-7 השנים האחרונות'
  },
  {
    value: 'rentalIncome',
    label: 'אני מקבל הכנסה משכר דירה'
  },
  {
    value: 'newImmigrant',
    label: 'עליתי לארץ ב-10 השנים האחרונות'
  }
];

const AdditionalCriteriaStep = ({ formData, handleChange, error }) => {
  const classes = useStyles();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const currentCriteria = formData.additionalCriteria || [];
    
    const updatedCriteria = checked
      ? [...currentCriteria, value]
      : currentCriteria.filter(item => item !== value);
    
    handleChange({
      target: {
        name: 'additionalCriteria',
        value: updatedCriteria
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <FormControl component="fieldset" className={classes.formControl}>
        <FormLabel component="legend" focused={false}>
          בחרו ברשימה הבאה את כל מה שנכון לגביכם ב-6 שנים האחרונות
        </FormLabel>
        <div className={classes.checkboxGroup}>
          {criteriaOptions.map((option) => (
            <motion.div
              key={option.value}
              className={`${classes.checkboxOption} ${
                formData.additionalCriteria?.includes(option.value) ? classes.selectedOption : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FormControlLabel
                className={classes.checkboxLabel}
                control={
                  <Checkbox
                    checked={formData.additionalCriteria?.includes(option.value) || false}
                    onChange={handleCheckboxChange}
                    value={option.value}
                    name="additionalCriteria"
                  />
                }
                label={option.label}
              />
            </motion.div>
          ))}
        </div>
        {error && (
          <FormHelperText error>{error}</FormHelperText>
        )}
      </FormControl>
    </motion.div>
  );
};

export default AdditionalCriteriaStep;
