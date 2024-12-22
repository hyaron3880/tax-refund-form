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
    .matches(/^\d{9}$/, 'מספר תעודת זהות חייב להכיל 9 ספרות')
    .test('valid-israeli-id', 'מספר תעודת זהות לא תקין', (value) => {
      if (!value) return false;
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
    .required('שדה חובה'),
  pensionClearance: Yup.boolean(),
  marketingApproval: Yup.boolean()
});

const PersonalDetailsStep = ({ onSubmit, data = {}, setFormData, error }) => {
  const handleFieldChange = (field, value) => {
    const shouldTrim = ['firstName', 'lastName', 'idNumber', 'phone', 'email'].includes(field);
    const processedValue = shouldTrim && value?.trim ? value.trim() : value;
    
    setFormData(prevData => ({
      ...prevData,
      personalDetails: {
        ...prevData.personalDetails,
        [field]: processedValue
      }
    }));
  };

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
      
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mb: { xs: 2, sm: 3 } }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            required
            name="firstName"
            label="שם פרטי"
            value={data?.personalDetails?.firstName || ''}
            onChange={(e) => handleFieldChange('firstName', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            value={data?.personalDetails?.lastName || ''}
            onChange={(e) => handleFieldChange('lastName', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            name="phone"
            label="טלפון נייד"
            value={data?.personalDetails?.phone || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '');
              if (value.length <= 10) {
                handleFieldChange('phone', value);
              }
            }}
            error={Boolean(error)}
            helperText={error}
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
            value={data?.personalDetails?.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            name="idNumber"
            label="תעודת זהות"
            value={data?.personalDetails?.idNumber || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^\d]/g, '');
              if (value.length <= 9) {
                handleFieldChange('idNumber', value);
              }
            }}
            error={Boolean(error)}
            helperText={error}
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
            name="birthDate"
            label="תאריך לידה"
            type="date"
            value={data?.personalDetails?.birthDate || ''}
            onChange={(e) => handleFieldChange('birthDate', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            value={data?.personalDetails?.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
              checked={data?.personalDetails?.pensionClearance || false}
              onChange={(e) => handleFieldChange('pensionClearance', e.target.checked)}
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
              checked={data?.personalDetails?.marketingApproval || false}
              onChange={(e) => handleFieldChange('marketingApproval', e.target.checked)}
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
    </Box>
  );
};

export default PersonalDetailsStep;
