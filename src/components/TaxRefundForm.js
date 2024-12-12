import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Container, 
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import MaritalStatusStep from './steps/MaritalStatusStep';
import EmploymentStatusStep from './steps/EmploymentStatusStep';
import IncomeStep from './steps/IncomeStep';
import JobHistoryStep from './steps/JobHistoryStep';
import AdditionalCriteriaStep from './steps/AdditionalCriteriaStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';

// Initialize EmailJS with your public key
emailjs.init("7ggM2WNflMbliCnaP"); // Replace with your public key from EmailJS

const TaxRefundForm = () => {
  const initialFormData = {
    maritalStatus: '',
    employmentStatus: '',
    income: '',
    severancePay: '',
    jobHistory: '',
    additionalCriteria: [],
    personalDetails: {}
  };

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [score, setScore] = useState(0);
  const [leadQuality, setLeadQuality] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Function to adjust iframe height
  useEffect(() => {
    const updateIframeHeight = () => {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage({ type: 'setHeight', height }, '*');
    };

    updateIframeHeight();
    window.addEventListener('resize', updateIframeHeight);
    return () => window.removeEventListener('resize', updateIframeHeight);
  }, [activeStep]);

  const calculateScore = (newData) => {
    let newScore = 0;
    let scoreDetails = [];
    
    // מצב משפחתי
    if (newData.maritalStatus === 'married') {
      newScore += 3;
      scoreDetails.push('נשוי/אה: 3 נקודות');
    } else if (newData.maritalStatus) {
      newScore += 2;
      scoreDetails.push('רווק/ה / גרוש/ה / אלמן/ה: 2 נקודות');
    }
    
    // סטטוס תעסוקה
    if (newData.employmentStatus === 'employed') {
      newScore += 5;
      scoreDetails.push('שכיר: 5 נקודות');
    } else if (newData.employmentStatus === 'bothEmployedAndSelfEmployed') {
      newScore += 3;
      scoreDetails.push('שכיר + עצמאי: 3 נקודות');
    }
    
    // הכנסה חודשית
    if (newData.income === 'above7000') {
      newScore += 5;
      scoreDetails.push('הכנסה מעל 7,000 ש"ח: 5 נקודות');
    }
    
    // החלפת עבודה
    if (newData.jobHistory === 'changed') {
      newScore += 4;
      scoreDetails.push('החלפת עבודה: 4 נקודות');
    } else if (newData.jobHistory === 'same') {
      newScore += 2;
      scoreDetails.push('לא החליף עבודה: 2 נקודות');
    }
    
    // קריטריונים נוספים
    const additionalCriteriaPoints = {
      unemployment: ['קבלת דמי אבטלה', 3],
      propertyTax: ['מכירת נכס', 3],
      securities: ['מסחר בניירות ערך', 3],
      lifeInsurance: ['ביטוח חיים', 3],
      pensionDeposit: ['הפקדה לקופת גמל', 3],
      donations: ['תרומות', 3],
      disability: ['נכות', 3],
      militaryService: ['שחרור מצה"ל', 3],
      education: ['סיום לימודים', 3],
      rentalIncome: ['הכנסה משכר דירה', 3],
      newImmigrant: ['עלייה חדשה', 3]
    };
    
    newData.additionalCriteria?.forEach(criteria => {
      if (additionalCriteriaPoints[criteria]) {
        newScore += additionalCriteriaPoints[criteria][1];
        scoreDetails.push(`${additionalCriteriaPoints[criteria][0]}: ${additionalCriteriaPoints[criteria][1]} נקודות`);
      }
    });

    setScore(newScore);
    
    // קביעת דירוג הליד
    let quality = '';
    if (newScore >= 30) {
      quality = 'ליד איכותי מאוד';
    } else if (newScore >= 20) {
      quality = 'ליד איכותי';
    } else if (newScore >= 15) {
      quality = 'ליד בינוני';
    } else {
      quality = 'ליד חלש';
    }
    
    setLeadQuality(quality);
    return { score: newScore, quality, details: scoreDetails };
  };

  const handleNext = (stepData) => {
    const newData = { ...formData, ...stepData };
    setFormData(newData);
    calculateScore(newData);
    
    if (activeStep === steps.length - 1) {
      handleSubmit(newData);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const formatDataForEmail = (data, scoreData) => {
    const criteriaLabels = {
      unemployment: 'קבלת דמי אבטלה',
      propertyTax: 'מכירת נכס',
      securities: 'מסחר בניירות ערך',
      lifeInsurance: 'ביטוח חיים',
      pensionDeposit: 'הפקדה לקופת גמל',
      donations: 'תרומות',
      disability: 'נכות',
      militaryService: 'שחרור מצה"ל',
      education: 'סיום לימודים',
      rentalIncome: 'הכנסה משכר דירה',
      newImmigrant: 'עלייה חדשה'
    };

    const employmentStatusLabels = {
      employed: 'שכיר',
      selfEmployed: 'עצמאי',
      bothEmployedAndSelfEmployed: 'שכיר + עצמאי',
      unemployed: 'לא עובד'
    };

    return `
      פרטי הליד:
      
      פרטים אישיים:
      שם מלא: ${data.personalDetails.fullName || 'לא צוין'}
      טלפון: ${data.personalDetails.phone || 'לא צוין'}
      אימייל: ${data.personalDetails.email || 'לא צוין'}
      
      פרטי השאלון:
      מצב משפחתי: ${data.maritalStatus === 'married' ? 'נשוי/אה' : 'רווק/ה / גרוש/ה / אלמן/ה'}
      סטטוס תעסוקה: ${employmentStatusLabels[data.employmentStatus] || 'לא צוין'}
      הכנסה חודשית: ${data.income === 'above7000' ? 'מעל 7,000 ש"ח' : 'מתחת ל-7,000 ש"ח'}
      משיכת פיצויים: ${data.severancePay === 'yes' ? 'כן' : 'לא'}
      החלפת מקום עבודה: ${data.jobHistory === 'changed' ? 'כן' : 'לא'}
      
      קריטריונים נוספים:
      ${data.additionalCriteria?.map(criteria => criteriaLabels[criteria]).join('\n')}
      
      ניקוד וסיווג:
      סה"כ ניקוד: ${scoreData.score} נקודות
      דירוג הליד: ${scoreData.quality}
      
      פירוט הניקוד:
      ${scoreData.details.join('\n')}
      
      תאריך שליחה: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
    `;
  };

  const handleSubmit = async (finalData) => {
    try {
      const scoreData = calculateScore(finalData);
      const emailContent = formatDataForEmail(finalData, scoreData);

      const templateParams = {
        to_email: 'omerh@yuvalim-ins.co.il',
        subject: `ליד חדש מטופס החזרי מס - ${scoreData.quality}`,
        message: emailContent
      };

      await emailjs.send(
        'service_mg36429',
        'template_isk33ym',
        templateParams
      );

      setShowSuccessDialog(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Add error handling logic here
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setActiveStep(0);
    setScore(0);
    setLeadQuality('');
    setShowSuccessDialog(false);
  };

  const steps = ['מצב משפחתי', 'סטטוס תעסוקה', 'הכנסה חודשית', 'החלפת מקום עבודה', 'קריטריונים נוספים', 'פרטים אישיים'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <MaritalStatusStep onNext={handleNext} data={formData} />;
      case 1:
        return <EmploymentStatusStep onNext={handleNext} data={formData} />;
      case 2:
        return <IncomeStep onNext={handleNext} data={formData} />;
      case 3:
        return <JobHistoryStep onNext={handleNext} data={formData} />;
      case 4:
        return <AdditionalCriteriaStep onNext={handleNext} data={formData} />;
      case 5:
        return <PersonalDetailsStep onNext={handleNext} data={formData} />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 4 }}>
      <Box sx={{ width: '100%', mt: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          {activeStep > 0 && (
            <Button onClick={handleBack} sx={{ float: 'right' }}>
              חזור
            </Button>
          )}
        </Box>

        <Typography variant="body2" align="center" sx={{ mb: 4 }}>
          השאלון כתוב בלשון זכר אך מתייחס לכל המינים.
        </Typography>

        {getStepContent(activeStep)}

        <Dialog
          open={showSuccessDialog}
          onClose={resetForm}
        >
          <DialogTitle>הטופס נשלח בהצלחה!</DialogTitle>
          <DialogContent>
            <DialogContentText>
              תודה על מילוי הטופס. נציג שלנו ייצור איתך קשר בהקדם.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={resetForm}>סגור</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default TaxRefundForm;
