import React from 'react';
import {
  TextField,
  Typography,
  Button,
  Box,
  Grid,
  Paper
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, 'שם פרטי חייב להכיל לפחות 2 תווים')
    .required('שדה חובה'),
  lastName: Yup.string()
    .min(2, 'שם משפחה חייב להכיל לפחות 2 תווים')
    .required('שדה חובה'),
  idNumber: Yup.string()
    .matches(/^\d{9}$/, 'מספר תעודת זהות חייב להכיל 9 ספרות')
    .test('valid-israeli-id', 'מספר תעודת זהות לא תקין', (value) => {
      if (!value) return false;
      // Israeli ID validation algorithm
      const id = String(value).trim();
      if (id.length !== 9 || isNaN(id)) return false;
      
      const sum = id
        .split('')
        .map((num, idx) => {
          const digit = Number(num);
          let calc = digit * ((idx % 2) + 1);
          calc = calc > 9 ? calc - 9 : calc;
          return calc;
        })
        .reduce((acc, curr) => acc + curr, 0);
      
      return sum % 10 === 0;
    })
    .required('שדה חובה'),
  birthDate: Yup.date()
    .max(new Date(), 'תאריך לא יכול להיות עתידי')
    .test('minimum-age', 'גיל מינימלי הוא 18', function(value) {
      if (!value) return false;
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      return value <= cutoff;
    })
    .required('שדה חובה'),
  address: Yup.string()
    .min(5, 'כתובת חייבת להכיל לפחות 5 תווים')
    .required('שדה חובה'),
  phone: Yup.string()
    .matches(/^05\d{8}$/, 'מספר טלפון לא תקין')
    .required('שדה חובה'),
  email: Yup.string()
    .email('כתובת אימייל לא תקינה')
    .required('שדה חובה')
});

const PersonalDetailsStep = ({ onNext, onSubmit, data = {} }) => {
  const initialValues = {
    firstName: data?.personalDetails?.firstName || '',
    lastName: data?.personalDetails?.lastName || '',
    idNumber: data?.personalDetails?.idNumber || '',
    birthDate: data?.personalDetails?.birthDate || '',
    address: data?.personalDetails?.address || '',
    phone: data?.personalDetails?.phone || '',
    email: data?.personalDetails?.email || ''
  };

  const handleFormSubmit = (values) => {
    // Update all form data at once with all fields
    onNext({
      target: {
        name: 'personalDetails',
        value: {
          firstName: values.firstName || '',
          lastName: values.lastName || '',
          idNumber: values.idNumber || '',
          birthDate: values.birthDate || '',
          address: values.address || '',
          phone: values.phone || '',
          email: values.email || ''
        }
      }
    });
    // Then submit the form
    onSubmit();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom align="center">
            מלאו שאלון עכשיו וגלו האם מגיע לכם החזרי מס
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
            נא למלא את פרטי הטופס בצורה נכונה
          </Typography>

          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="שם פרטי"
                  value={values.firstName}
                  onChange={(e) => {
                    setFieldValue('firstName', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.firstName',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="שם משפחה"
                  value={values.lastName}
                  onChange={(e) => {
                    setFieldValue('lastName', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.lastName',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="idNumber"
                  label="תעודת זהות"
                  value={values.idNumber}
                  onChange={(e) => {
                    setFieldValue('idNumber', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.idNumber',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.idNumber && Boolean(errors.idNumber)}
                  helperText={touched.idNumber && errors.idNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  name="birthDate"
                  label="תאריך לידה"
                  value={values.birthDate}
                  onChange={(e) => {
                    setFieldValue('birthDate', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.birthDate',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.birthDate && Boolean(errors.birthDate)}
                  helperText={touched.birthDate && errors.birthDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="address"
                  label="כתובת מלאה"
                  value={values.address}
                  onChange={(e) => {
                    setFieldValue('address', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.address',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="טלפון נייד"
                  value={values.phone}
                  onChange={(e) => {
                    setFieldValue('phone', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.phone',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="דואר אלקטרוני"
                  value={values.email}
                  onChange={(e) => {
                    setFieldValue('email', e.target.value);
                    onNext({
                      target: {
                        name: 'personalDetails.email',
                        value: e.target.value
                      }
                    });
                  }}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              שלח טופס
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalDetailsStep;
