import React, { useState, useEffect } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  useMediaQuery,
  CircularProgress,
  Box
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion, AnimatePresence } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import emailjs from '@emailjs/browser';
import MaritalStatusStep from './steps/MaritalStatusStep';
import EmploymentStatusStep from './steps/EmploymentStatusStep';
import IncomeStep from './steps/IncomeStep';
import JobHistoryStep from './steps/JobHistoryStep';
import AdditionalCriteriaStep from './steps/AdditionalCriteriaStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';

// Initialize EmailJS with your public key
emailjs.init("7ggM2WNflMbliCnaP");

const useStyles = makeStyles((theme) => ({
  formContainer: {
    maxWidth: '800px',
    margin: '20px auto',
    padding: '30px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    '@media (max-width: 600px)': {
      margin: '10px',
      padding: '15px',
      borderRadius: '8px',
      maxWidth: '100%',
    },
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
    marginTop: '-5px',
    flexWrap: 'wrap',
    '@media (max-width: 600px)': {
      marginBottom: '20px',
      gap: '5px',
    },
  },
  title: {
    textAlign: 'center',
    color: '#1a237e',
    fontSize: '24px',
    fontWeight: 500,
    paddingBottom: '20px',
    '@media (max-width: 600px)': {
      fontSize: '20px',
      paddingBottom: '15px',
    },
  },
  infoIcon: {
    color: '#1a237e',
    cursor: 'pointer',
    fontSize: '20px',
    '&:hover': {
      color: '#303f9f',
    },
  },
  stepProgress: {
    textAlign: 'center',
    color: '#666',
    fontSize: '16px',
    marginTop: '-15px',
    marginBottom: '20px',
    '@media (max-width: 600px)': {
      fontSize: '14px',
      marginTop: '-10px',
      marginBottom: '15px',
    },
  },
  stepper: {
    backgroundColor: 'transparent',
    padding: '20px 0',
    '@media (max-width: 600px)': {
      padding: '10px 0',
      '& .MuiStepConnector-root': {
        display: 'none',
      },
      '& .MuiStep-root': {
        padding: '0 4px',
      },
    },
  },
  stepLabel: {
    '& .MuiStepLabel-label': {
      fontSize: '16px',
      '@media (max-width: 600px)': {
        fontSize: '12px',
      },
    },
    '& .MuiStepLabel-completed': {
      color: '#4caf50',
    },
  },
  stepIcon: {
    color: '#1a237e',
  },
  completed: {
    color: '#1a237e !important',
  },
  genderNote: {
    textAlign: 'center',
    color: '#666',
    fontSize: '14px',
    marginTop: '10px',
    marginBottom: '20px',
    fontStyle: 'italic'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
    borderRadius: '12px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '30px',
    gap: '16px',
    '@media (max-width: 600px)': {
      flexDirection: 'column-reverse',
      gap: '10px',
    },
  },
  button: {
    minWidth: '120px',
    '@media (max-width: 600px)': {
      width: '100%',
      minHeight: '44px',
    },
  },
}));

const TaxRefundForm = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInfoDialog, setShowInfoDialog] = useState(false);
  const [showUnemployedDialog, setShowUnemployedDialog] = useState(false);
  const [showSelfEmployedDialog, setShowSelfEmployedDialog] = useState(false);
  const [showLowIncomeDialog, setShowLowIncomeDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
  const [errors, setErrors] = useState({});
  const [score, setScore] = useState(0);
  const [leadQuality, setLeadQuality] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => {
      if (name === 'personalDetails') {
        // Handle the entire personalDetails object update
        return {
          ...prevData,
          personalDetails: {
            ...prevData.personalDetails,
            ...value
          }
        };
      } else if (name.startsWith('personalDetails.')) {
        // Handle individual personalDetails field updates
        const field = name.split('.')[1];
        return {
          ...prevData,
          personalDetails: {
            ...prevData.personalDetails,
            [field]: value
          }
        };
      }
      return {
        ...prevData,
        [name]: value
      };
    });
    // Clear error when user makes a change
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

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

  const validateStep = () => {
    const newErrors = {};
    
    switch (activeStep) {
      case 0:
        if (!formData.maritalStatus) {
          newErrors.maritalStatus = 'נא לבחור מצב משפחתי';
        }
        break;
      // Add validation for other steps here
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = () => {
    switch (activeStep) {
      case 0:
        return Boolean(formData.maritalStatus);
      case 1:
        return Boolean(formData.employmentStatus);
      case 2:
        return Boolean(formData.income) && Boolean(formData.severancePay);
      case 3:
        return Boolean(formData.jobHistory);
      case 4:
        return true; // No validation required for additional criteria
      case 5:
        const { firstName, lastName, phone, email } = formData.personalDetails || {};
        return Boolean(firstName && lastName && phone && email);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) {
      let errorMessage = '';
      switch (activeStep) {
        case 0:
          errorMessage = 'נא לבחור מצב משפחתי';
          break;
        case 1:
          errorMessage = 'נא לבחור סטטוס תעסוקה';
          break;
        case 2:
          if (!formData.income) {
            errorMessage = 'נא לבחור טווח הכנסה';
          } else if (!formData.severancePay) {
            errorMessage = 'נא לענות על שאלת כספי הפיצויים';
          }
          break;
        case 3:
          errorMessage = 'נא לבחור האם החלפת מקום עבודה';
          break;
        case 4:
          errorMessage = 'נא לבחור לפחות קריטריון אחד';
          break;
        case 5:
          errorMessage = 'נא למלא את כל פרטי הקשר';
          break;
      }
      
      setErrors(prev => ({
        ...prev,
        [Object.keys(formData)[activeStep]]: errorMessage
      }));
      return;
    }

    // Check employment status logic
    if (activeStep === 1) {
      if (formData.employmentStatus === 'unemployed') {
        setShowUnemployedDialog(true);
        return;
      } else if (formData.employmentStatus === 'selfEmployed') {
        setShowSelfEmployedDialog(true);
        return;
      }
    }

    // Check income and severance pay logic
    if (activeStep === 2) {
      if (formData.income === 'below7000' && formData.severancePay === 'no') {
        setShowLowIncomeDialog(true);
        return;
      }
    }

    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      console.log('Form data before submit:', formData); // Debug log
      const scoreResult = calculateScore(formData);
      
      // Create template params for email
      const templateParams = {
        fullName: `${formData.personalDetails?.firstName || ''} ${formData.personalDetails?.lastName || ''}`,
        phone: formData.personalDetails?.phone || '',
        email: formData.personalDetails?.email || '',
        idNumber: formData.personalDetails?.idNumber || '',
        birthDate: formData.personalDetails?.birthDate || '',
        address: formData.personalDetails?.address || '',
        maritalStatus: formData.maritalStatus === 'married' ? 'נשוי/אה' : 'רווק/ה / גרוש/ה / אלמן/ה',
        employmentStatus: formData.employmentStatus === 'employed' ? 'שכיר' : 
                         formData.employmentStatus === 'selfEmployed' ? 'עצמאי' : 
                         formData.employmentStatus === 'bothEmployedAndSelfEmployed' ? 'שכיר + עצמאי' : 'לא עובד',
        income: formData.income === 'above7000' ? 'מעל 7,000 ש"ח' : 'מתחת ל-7,000 ש"ח',
        severancePay: formData.severancePay === 'yes' ? 'כן' : 'לא',
        jobHistory: formData.jobHistory === 'changed' ? 'כן' : 'לא',
        additionalCriteria: formData.additionalCriteria?.map(criteria => {
          const labels = {
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
          return labels[criteria];
        }).join('\n') || 'אין',
        score: scoreResult.score.toString(),
        quality: scoreResult.quality,
        scoreDetails: scoreResult.details.join('\n'),
        message: `
שם מלא: ${formData.personalDetails?.firstName || ''} ${formData.personalDetails?.lastName || ''}
טלפון: ${formData.personalDetails?.phone || ''}
אימייל: ${formData.personalDetails?.email || ''}
תעודת זהות: ${formData.personalDetails?.idNumber || ''}
תאריך לידה: ${formData.personalDetails?.birthDate || ''}
כתובת: ${formData.personalDetails?.address || ''}

מצב משפחתי: ${formData.maritalStatus === 'married' ? 'נשוי/אה' : 'רווק/ה / גרוש/ה / אלמן/ה'}
סטטוס תעסוקה: ${formData.employmentStatus === 'employed' ? 'שכיר' : 
                formData.employmentStatus === 'selfEmployed' ? 'עצמאי' : 
                formData.employmentStatus === 'bothEmployedAndSelfEmployed' ? 'שכיר + עצמאי' : 'לא עובד'}
הכנסה חודשית: ${formData.income === 'above7000' ? 'מעל 7,000 ש"ח' : 'מתחת ל-7,000 ש"ח'}
קיבל פיצויים: ${formData.severancePay === 'yes' ? 'כן' : 'לא'}
החליף עבודה: ${formData.jobHistory === 'changed' ? 'כן' : 'לא'}

קריטריונים נוספים:
${formData.additionalCriteria?.map(criteria => {
  const labels = {
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
  return '- ' + labels[criteria];
}).join('\n') || 'אין'}

ציון: ${scoreResult.score}
איכות הליד: ${scoreResult.quality}

פירוט הניקוד:
${scoreResult.details.join('\n')}

תאריך שליחה: ${new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })}
`
      };

      console.log('Template params:', templateParams); // Debug log

      // Send email
      const response = await emailjs.send(
        'service_mg36429',
        'template_isk33ym',
        templateParams
      );

      if (response.status === 200) {
        setShowSuccessDialog(true);
      } else {
        console.error('Failed to send email:', response);
        alert('אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.');
    } finally {
      setIsSubmitting(false);
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
        return (
          <MaritalStatusStep
            formData={formData}
            handleChange={handleInputChange}
            error={errors.maritalStatus}
          />
        );
      case 1:
        return <EmploymentStatusStep formData={formData} handleChange={handleInputChange} error={errors.employmentStatus} />;
      case 2:
        return <IncomeStep formData={formData} handleChange={handleInputChange} error={errors.income} />;
      case 3:
        return <JobHistoryStep formData={formData} handleChange={handleInputChange} error={errors.jobHistory} />;
      case 4:
        return <AdditionalCriteriaStep formData={formData} handleChange={handleInputChange} error={errors.additionalCriteria} />;
      case 5:
        return <PersonalDetailsStep 
          data={formData} 
          onNext={handleInputChange} 
          onSubmit={handleSubmit}
          error={errors.personalDetails} 
        />;
      default:
        return 'Unknown step';
    }
  };

  const isLastStep = activeStep === steps.length - 1;

  return (
    <div className={classes.formContainer}>
      {isSubmitting && (
        <div className={classes.loadingOverlay}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#1a237e' }} />
        </div>
      )}
      <Dialog
        open={showSuccessDialog}
        onClose={resetForm}
        aria-labelledby="success-dialog-title"
      >
        <DialogTitle id="success-dialog-title">
          הטופס נשלח בהצלחה!
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            תודה על מילוי הטופס. נציג שלנו ייצור איתך קשר בהקדם.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetForm}>סגור</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showUnemployedDialog}
        onClose={() => setShowUnemployedDialog(false)}
        aria-labelledby="unemployed-dialog-title"
        aria-describedby="unemployed-dialog-description"
      >
        <DialogTitle id="unemployed-dialog-title">
          {"לא ניתן להמשיך בתהליך"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="unemployed-dialog-description">
            במידה ולא עבדת כלל בין השנים 2019 - 2024 לא נוכה לך מס ולכן אין באפשרותנו לבצע החזר מס
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowUnemployedDialog(false)} color="primary" autoFocus>
            הבנתי
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showSelfEmployedDialog}
        onClose={() => setShowSelfEmployedDialog(false)}
        aria-labelledby="self-employed-dialog-title"
      >
        <DialogTitle id="self-employed-dialog-title">
          {"לא ניתן להמשיך בתהליך"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            אם עבדת כעצמאי בלבד בין השנים 2019 - 2024 סימן שאתה מחוייב בהגשת דוחות שנתיים. אין באפשרותנו לבצע עבורך החזר מס אך מרדנו מטפל גם בהגשת דוחות שנתיים. במידה והינך מעוניין ליצור איתנו קשר יש להשאיר פרטים באתר הבית שלנו
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSelfEmployedDialog(false)} color="primary" autoFocus>
            הבנתי
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showLowIncomeDialog}
        onClose={() => setShowLowIncomeDialog(false)}
        aria-labelledby="low-income-dialog-title"
      >
        <DialogTitle id="low-income-dialog-title">
          {"שגיאה"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            לא ניתן להתקדם מכיוון שאין זכאות להחזר מס
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowLowIncomeDialog(false)} color="primary" autoFocus>
            הבנתי
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showInfoDialog}
        onClose={() => setShowInfoDialog(false)}
        aria-labelledby="info-dialog-title"
      >
        <DialogTitle id="info-dialog-title">
          מידע על החזרי מס
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography paragraph>
              החזר מס הוא תהליך שבו רשות המיסים מחזירה לכם כסף במקרים בהם שילמתם מס ביתר.
            </Typography>
            <Typography paragraph>
              ישנם מקרים רבים בהם ניתן לקבל החזר מס, למשל:
            </Typography>
            <ul>
              <li>עבודה במשמרות</li>
              <li>תרומות למוסדות מוכרים</li>
              <li>נקודות זיכוי בגין ילדים</li>
              <li>הוצאות רפואיות חריגות</li>
              <li>ועוד...</li>
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInfoDialog(false)}>סגור</Button>
        </DialogActions>
      </Dialog>

      <div className={classes.progressContainer}>
        <Stepper activeStep={activeStep} alternativeLabel className={classes.stepper}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                className={classes.stepLabel}
                StepIconProps={{
                  classes: {
                    root: classes.stepIcon,
                    completed: classes.completed,
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography className={classes.stepProgress}>
          שלב {activeStep + 1} מתוך {steps.length}
        </Typography>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={classes.formContent}
      >
        <div className={classes.titleContainer}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Typography 
              variant="h6" 
              component="h1" 
              align="center"
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: 500,
                marginBottom: 0,
                paddingBottom: 0
              }}
            >
              בדיקת זכאות להחזר מס
              <Tooltip title="מילוי השאלון אורך כ-2 דקות">
                <InfoIcon 
                  sx={{ 
                    fontSize: '1rem',
                    marginRight: '8px',
                    color: 'rgba(0, 0, 0, 0.54)',
                    verticalAlign: 'middle'
                  }} 
                />
              </Tooltip>
            </Typography>

            <Typography 
              sx={{ 
                textAlign: 'center',
                color: '#666',
                fontSize: '14px',
                margin: 0,
                fontStyle: 'italic'
              }}
            >
              * השאלון נכתב בלשון זכר אך מתייחס לכל המינים
            </Typography>
          </div>
        </div>

        {getStepContent(activeStep)}
        
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              variant="outlined"
            >
              חזור
            </Button>
          )}
          {!isLastStep && (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              הבא
            </Button>
          )}
        </Box>
      </motion.div>
    </div>
  );
};

export default TaxRefundForm;
