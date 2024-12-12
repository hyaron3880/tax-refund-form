import React from 'react';
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Button,
  Box,
  Paper
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  additionalCriteria: Yup.array().min(1, 'נא לבחור לפחות קריטריון אחד')
});

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
  const initialValues = {
    additionalCriteria: formData.additionalCriteria || []
  };

  const handleSubmit = (values) => {
    handleChange({
      target: {
        name: 'additionalCriteria',
        value: values.additionalCriteria
      }
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, handleSubmit }) => (
        <Form onSubmit={handleSubmit}>
          <Typography variant="h5" gutterBottom align="center">
            בחרו ברשימה הבאה את כל מה שנכון לגביכם ב-6 שנים האחרונות
          </Typography>

          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <FormGroup>
              {criteriaOptions.map((option) => (
                <FormControlLabel
                  key={option.value}
                  control={
                    <Checkbox
                      checked={values.additionalCriteria.includes(option.value)}
                      onChange={(e) => {
                        const newCriteria = e.target.checked
                          ? [...values.additionalCriteria, option.value]
                          : values.additionalCriteria.filter(
                              (value) => value !== option.value
                            );
                        setFieldValue('additionalCriteria', newCriteria);
                        handleSubmit();
                      }}
                    />
                  }
                  label={option.label}
                />
              ))}
            </FormGroup>
          </Paper>
        </Form>
      )}
    </Formik>
  );
};

export default AdditionalCriteriaStep;
