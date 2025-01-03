import React from 'react';
import {
  TextField,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  FormControlLabel,
  Checkbox
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
    .required('שדה חובה')
    .test('valid-israeli-id', 'מספר תעודת זהות לא תקין', (value) => {
      if (!value) return false;
      value = String(value).trim();
      if (value.length > 9 || isNaN(value)) return false;
      value = value.length < 9 ? ("00000000" + value).slice(-9) : value;
      return Array.from(value, Number).reduce((counter, digit, i) => {
        const step = digit * ((i % 2) + 1);
        return counter + (step > 9 ? step - 9 : step);
      }) % 10 === 0;
    }),
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
    .required('שדה חובה'),
  pensionClearance: Yup.boolean(),
  marketingApproval: Yup.boolean()
});

const PersonalDetailsStep = ({ onSubmit, data = {}, setFormData, error }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        align="center"
        sx={{
          fontSize: { xs: '1.2rem', sm: '1.5rem' },
          mb: { xs: 2, sm: 3 }
        }}
      >
        מלאו שאלון עכשיו וגלו האם מגיע לכם החזרי מס
      </Typography>
      
      <Formik
        initialValues={{
          ...data?.personalDetails || {},
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
          <Form style={{ width: '100%' }}>
            <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="firstName"
                  label="שם פרטי"
                  value={values.firstName || ''}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        firstName: e.target.value.trim()
                      }
                    }));
                  }}
                  onBlur={handleBlur}
                  error={touched.firstName && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  inputProps={{
                    'aria-label': 'שם פרטי',
                    maxLength: 50,
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="lastName"
                  label="שם משפחה"
                  value={values.lastName || ''}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        lastName: e.target.value.trim()
                      }
                    }));
                  }}
                  onBlur={handleBlur}
                  error={touched.lastName && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  inputProps={{
                    'aria-label': 'שם משפחה',
                    maxLength: 50
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="idNumber"
                  label="תעודת זהות"
                  value={values.idNumber || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (value.length <= 9) {
                      handleChange({ target: { name: 'idNumber', value } });
                      setFormData(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          idNumber: value
                        }
                      }));
                    }
                  }}
                  onBlur={handleBlur}
                  error={touched.idNumber && Boolean(errors.idNumber)}
                  helperText={touched.idNumber && errors.idNumber}
                  inputProps={{
                    'aria-label': 'תעודת זהות',
                    pattern: '[0-9]{9}',
                    inputMode: 'numeric'
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="phone"
                  label="טלפון נייד"
                  value={values.phone || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '');
                    if (value.length <= 10) {
                      handleChange({ target: { name: 'phone', value } });
                      setFormData(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          phone: value
                        }
                      }));
                    }
                  }}
                  onBlur={handleBlur}
                  error={touched.phone && Boolean(errors.phone)}
                  helperText={touched.phone && errors.phone}
                  inputProps={{
                    'aria-label': 'טלפון נייד',
                    pattern: '05[0-9]{8}',
                    inputMode: 'numeric'
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="email"
                  type="email"
                  label="דוא״ל"
                  value={values.email || ''}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        email: e.target.value.trim()
                      }
                    }));
                  }}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  inputProps={{
                    'aria-label': 'דואר אלקטרוני'
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  name="birthDate"
                  label="תאריך לידה"
                  type="date"
                  value={values.birthDate || ''}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        birthDate: e.target.value
                      }
                    }));
                  }}
                  onBlur={handleBlur}
                  error={touched.birthDate && Boolean(errors.birthDate)}
                  helperText={touched.birthDate && errors.birthDate}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    'aria-label': 'תאריך לידה',
                    max: new Date().toISOString().split('T')[0],
                    min: '1923-01-01'
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="address"
                  label="כתובת מגורים"
                  value={values.address || ''}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData(prev => ({
                      ...prev,
                      personalDetails: {
                        ...prev.personalDetails,
                        address: e.target.value.trim()
                      }
                    }));
                  }}
                  onBlur={handleBlur}
                  error={touched.address && Boolean(errors.address)}
                  helperText={touched.address && errors.address}
                  inputProps={{
                    'aria-label': 'כתובת מגורים',
                    maxLength: 100
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      height: { xs: '45px', sm: '56px' }
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              width: '100%',
              gap: 1,
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.pensionClearance || false}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          pensionClearance: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="אני מאשר/ת הוצאת מסלקה פנסיונית עבורי לצורך בדיקת זכאות להחזר מס"
                sx={{ 
                  marginTop: 2,
                  width: '100%',
                  margin: '0 auto',
                  justifyContent: 'center',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.marketingApproval || false}
                    onChange={(e) => {
                      handleChange(e);
                      setFormData(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          marketingApproval: e.target.checked
                        }
                      }));
                    }}
                  />
                }
                label="מסכימ.ה שייאסף מידע אודותיי, שהחברה תחזור אלי באמצעות הודעות WhatsApp מייל, שיחה טלפונית, סמס וכן לאמור במדיניות הפרטיות ותנאי השימוש באתר"
                sx={{ 
                  width: '100%',
                  margin: '0 auto',
                  justifyContent: 'center',
                  '& .MuiFormControlLabel-label': {
                    fontSize: '0.9rem',
                    textAlign: 'center'
                  }
                }}
              />
            </Box>

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default PersonalDetailsStep;
