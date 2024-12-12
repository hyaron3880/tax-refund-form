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
  maritalStatus: Yup.string().required('נא לבחור מצב משפחתי')
});

const MaritalStatusStep = ({ onNext, data }) => {
  const initialValues = {
    maritalStatus: data.maritalStatus || ''
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onNext({ maritalStatus: values.maritalStatus });
      }}
    >
      {({ values, handleChange, errors, touched }) => (
        <Form>
          <Typography variant="h5" gutterBottom align="center">
            מהו מצבך המשפחתי?
          </Typography>

          <FormControl component="fieldset" fullWidth error={touched.maritalStatus && Boolean(errors.maritalStatus)}>
            <RadioGroup
              name="maritalStatus"
              value={values.maritalStatus}
              onChange={handleChange}
            >
              <FormControlLabel
                value="single"
                control={<Radio />}
                label="רווק או ידוע בציבור"
              />
              <FormControlLabel
                value="married"
                control={<Radio />}
                label="נשוי (במידה ובחרת באופציה זו השאלון מופנה לשני בני הזוג)"
              />
              <FormControlLabel
                value="divorced"
                control={<Radio />}
                label="גרוש או אלמן"
              />
            </RadioGroup>
            
            {touched.maritalStatus && errors.maritalStatus && (
              <Typography color="error" variant="caption">
                {errors.maritalStatus}
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

export default MaritalStatusStep;
