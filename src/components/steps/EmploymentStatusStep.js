import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  employmentStatus: Yup.string().required('נא לבחור סטטוס תעסוקה')
});

const EmploymentStatusStep = ({ onNext, data }) => {
  const [showDialog, setShowDialog] = React.useState(false);
  const [dialogType, setDialogType] = React.useState('');

  const handleSubmit = (values) => {
    if (values.employmentStatus === 'notEmployed') {
      setDialogType('notEmployed');
      setShowDialog(true);
    } else if (values.employmentStatus === 'selfEmployed') {
      setDialogType('selfEmployed');
      setShowDialog(true);
    } else {
      onNext({ employmentStatus: values.employmentStatus });
    }
  };

  const initialValues = {
    employmentStatus: data.employmentStatus || ''
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom align="center">
            האם עבדת כשכיר בין השנים 2019 - 2024?
          </Typography>
          <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
            (גם אם עבדת רק בחלק מהשנים)
          </Typography>

          <FormControl component="fieldset" fullWidth error={touched.employmentStatus && Boolean(errors.employmentStatus)}>
            <RadioGroup
              name="employmentStatus"
              value={values.employmentStatus}
              onChange={handleChange}
            >
              <FormControlLabel
                value="employed"
                control={<Radio />}
                label="עבדתי כשכיר"
              />
              <FormControlLabel
                value="selfEmployed"
                control={<Radio />}
                label="עבדתי כעצמאי"
              />
              <FormControlLabel
                value="notEmployed"
                control={<Radio />}
                label="לא עבדתי"
              />
              <FormControlLabel
                value="bothEmployedAndSelfEmployed"
                control={<Radio />}
                label="הייתי גם שכיר וגם עצמאי"
              />
            </RadioGroup>
            
            {touched.employmentStatus && errors.employmentStatus && (
              <Typography color="error" variant="caption">
                {errors.employmentStatus}
              </Typography>
            )}
          </FormControl>

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

          <Dialog open={showDialog} onClose={() => setShowDialog(false)}>
            <DialogTitle>
              {dialogType === 'notEmployed' ? 'לא ניתן להמשיך' : 'שים לב'}
            </DialogTitle>
            <DialogContent>
              <Typography>
                {dialogType === 'notEmployed' 
                  ? 'במידה ולא עבדת כלל בין השנים 2019 - 2024 לא נוכה לך מס ולכן אין באפשרותנו לבצע החזר מס'
                  : 'אם עבדת כעצמאי בלבד בין השנים 2019 - 2024 סימן שאתה מחוייב בהגשת דוחות שנתיים. אין באפשרותנו לבצע עבורך החזר מס אך מרדנו מטפל גם בהגשת דוחות שנתיים. במידה והינך מעוניין ליצור איתנו קשר יש להשאיר פרטים באתר הבית שלנו'}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDialog(false)} color="primary">
                סגור
              </Button>
            </DialogActions>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
};

export default EmploymentStatusStep;
