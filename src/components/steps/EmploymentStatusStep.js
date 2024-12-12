import React from 'react';
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper
} from '@mui/material';

const EmploymentStatusStep = ({ formData, handleChange, error }) => {
  return (
    <>
      <Typography variant="h5" gutterBottom align="center">
        האם עבדת כשכיר בין השנים 2019 - 2024? (גם אם עבדת רק בחלק מהשנים)
      </Typography>

      {error && (
        <Typography color="error" align="center" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <FormControl component="fieldset">
          <RadioGroup
            value={formData.employmentStatus || ''}
            onChange={handleChange}
            name="employmentStatus"
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
              value="unemployed"
              control={<Radio />}
              label="לא עבדתי"
            />
            <FormControlLabel
              value="bothEmployedAndSelfEmployed"
              control={<Radio />}
              label="הייתי גם שכיר וגם עצמאי"
            />
          </RadioGroup>
        </FormControl>
      </Paper>
    </>
  );
};

export default EmploymentStatusStep;
