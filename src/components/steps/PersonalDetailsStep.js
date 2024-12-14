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

const PersonalDetailsStep = ({ onSubmit, data = {}, setFormData, error }) => {
  const handleFieldChange = (field, value) => {
    setFormData(prevData => ({
      ...prevData,
      personalDetails: {
        ...prevData.personalDetails,
        [field]: value?.trim ? value.trim() : value
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
            onChange={(e) => handleFieldChange('idNumber', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            type="date"
            name="birthDate"
            label="תאריך לידה"
            value={data?.personalDetails?.birthDate || ''}
            onChange={(e) => handleFieldChange('birthDate', e.target.value)}
            error={Boolean(error)}
            helperText={error}
            InputLabelProps={{ shrink: true }}
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
            label="כתובת"
            value={data?.personalDetails?.address || ''}
            onChange={(e) => handleFieldChange('address', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            onChange={(e) => handleFieldChange('phone', e.target.value)}
            error={Boolean(error)}
            helperText={error}
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
            label="אימייל"
            value={data?.personalDetails?.email || ''}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            error={Boolean(error)}
            helperText={error}
            sx={{
              '& .MuiInputBase-root': {
                height: { xs: '45px', sm: '56px' }
              }
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalDetailsStep;
