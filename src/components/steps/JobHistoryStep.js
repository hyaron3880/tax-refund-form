import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Button,
  Box
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  jobHistory: Yup.string().required('נא לבחור היסטוריית תעסוקה')
});

const JobHistoryStep = ({ onNext, data }) => {
  const initialValues = {
    jobHistory: data.jobHistory || ''
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onNext({ jobHistory: values.jobHistory });
      }}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom align="center">
            האם במהלך 6 השנים האחרונות החלפת עבודה?
          </Typography>

          <FormControl component="fieldset" fullWidth error={touched.jobHistory && Boolean(errors.jobHistory)}>
            <RadioGroup
              name="jobHistory"
              value={values.jobHistory}
              onChange={handleChange}
            >
              <FormControlLabel
                value="same"
                control={<Radio />}
                label="עבדתי באותו מקום עבודה"
              />
              <FormControlLabel
                value="changed"
                control={<Radio />}
                label="החלפתי מקומות עבודה"
              />
            </RadioGroup>
            
            {touched.jobHistory && errors.jobHistory && (
              <Typography color="error" variant="caption">
                {errors.jobHistory}
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
        </Form>
      )}
    </Formik>
  );
};

export default JobHistoryStep;
