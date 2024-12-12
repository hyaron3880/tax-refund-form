import React, { useState } from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  income: Yup.string().required('נא לבחור טווח הכנסה'),
  severancePay: Yup.string().required('נא לענות על השאלה לגבי כספי פיצויים')
});

const IncomeStep = ({ onNext, data }) => {
  const [showDialog, setShowDialog] = useState(false);

  const initialValues = {
    income: data.income || '',
    severancePay: data.severancePay || ''
  };

  const handleSubmit = (values) => {
    if (values.income === 'below7000' && values.severancePay === 'no') {
      setShowDialog(true);
    } else {
      onNext(values);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              האם אתה מרוויח מעל 7,000 ש״ח בחודש?
            </Typography>

            <FormControl component="fieldset" fullWidth error={touched.income && Boolean(errors.income)}>
              <RadioGroup
                name="income"
                value={values.income}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="above7000"
                  control={<Radio />}
                  label="כן"
                />
                <FormControlLabel
                  value="below7000"
                  control={<Radio />}
                  label="לא"
                />
              </RadioGroup>
              
              {touched.income && errors.income && (
                <Typography color="error" variant="caption">
                  {errors.income}
                </Typography>
              )}
            </FormControl>
          </Paper>

          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom align="center">
              האם במהלך 6 השנים האחרונות משכת כספי פיצויים / פנסיה ושילמת 35% מס?
            </Typography>

            <FormControl component="fieldset" fullWidth error={touched.severancePay && Boolean(errors.severancePay)}>
              <RadioGroup
                name="severancePay"
                value={values.severancePay}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="כן"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="לא"
                />
              </RadioGroup>
              
              {touched.severancePay && errors.severancePay && (
                <Typography color="error" variant="caption">
                  {errors.severancePay}
                </Typography>
              )}
            </FormControl>
          </Paper>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              המשך
            </Button>
          </Box>

          <Dialog 
            open={showDialog} 
            onClose={() => setShowDialog(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle align="center">
              לא ניתן להמשיך
            </DialogTitle>
            <DialogContent>
              <Typography align="center">
                מכיוון שהכנסתך נמוכה מ-7,000 ש"ח ולא משכת כספי פיצויים/פנסיה, 
                לא נוכל לבצע עבורך החזר מס כרגע.
              </Typography>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                onClick={() => setShowDialog(false)} 
                variant="contained" 
                color="primary"
              >
                הבנתי
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default IncomeStep;
