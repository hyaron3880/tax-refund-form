import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
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
  Box,
  LinearProgress,
  Link
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion, AnimatePresence } from 'framer-motion';
import InfoIcon from '@mui/icons-material/Info';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';
import MaritalStatusStep from './steps/MaritalStatusStep';
import EmploymentStatusStep from './steps/EmploymentStatusStep';
import IncomeStep from './steps/IncomeStep';
import JobHistoryStep from './steps/JobHistoryStep';
import AdditionalCriteriaStep from './steps/AdditionalCriteriaStep';
import PersonalDetailsStep from './steps/PersonalDetailsStep';

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
    '& .MuiStepLabel-label': {
      fontSize: '0.9rem',
      '@media (max-width: 600px)': {
        fontSize: '0.8rem',
      },
    },
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
    color: '#e0e0e0',
    '&.Mui-active': {
      color: '#1a237e',
    },
    '&.Mui-completed': {
      color: '#1a237e',
    },
  },
  completed: {
    color: '#1a237e',
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
  const [showSelfEmployedDialog, setShowSelfEmployedDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showNoEligibilityDialog, setShowNoEligibilityDialog] = useState(false);

  const [formData, setFormData] = useState({
    maritalStatus: '',
    employmentStatus: '',
    income: '',
    jobHistory: '',
    additionalCriteria: [],
    personalDetails: {}
  });

  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [score, setScore] = useState(0);
  const [leadQuality, setLeadQuality] = useState('');
  const [triggerSubmit, setTriggerSubmit] = useState(false);

  const handleInputChange = (event) => {
    if (typeof event === 'function') {
      // Handle function updates (for personal details)
      setFormData(prevData => ({
        ...prevData,
        ...event(prevData)
      }));
    } else if (event.target && event.target.name) {
      // Handle regular input changes
      const { name, value } = event.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    } else {
      // Handle personal details updates
      setFormData(prevData => ({
        ...prevData,
        personalDetails: {
          ...prevData.personalDetails,
          ...event
        }
      }));
    }
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

  useEffect(() => {
    emailjs.init("7ggM2WNflMbliCnaP");
  }, []);

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
      pensionWithdrawal: ['משיכת כספי פנסיה', 3],
      unemployment: ['קבלת דמי אבטלה', 3],
      propertyTax: ['מכירת נכס', 3],
      securities: ['מסחר בניירות ערך', 3],
      rentalIncome: ['הכנסה משכר דירה', 3],
      over60: ['גיל 60 ומעלה', 3],
      lifeInsurance: ['ביטוח חיים', 3],
      pensionDeposit: ['הפקדה לקופת גמל', 3]
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
        return Boolean(formData.income);
      case 3:
        return Boolean(formData.jobHistory);
      case 4:
        return true; // No validation required for additional criteria
      case 5:
        const { personalDetails } = formData;
        if (!personalDetails) return false;
        
        return Boolean(
          personalDetails.firstName?.trim() &&
          personalDetails.lastName?.trim() &&
          personalDetails.phone?.trim() &&
          personalDetails.email?.trim() &&
          personalDetails.idNumber?.trim() &&
          personalDetails.birthDate &&
          personalDetails.address?.trim()
        );
      default:
        return false;
    }
  };;

  const checkEligibilityForLowIncome = () => {
    console.log('Checking eligibility with:', {
      income: formData.income,
      jobHistory: formData.jobHistory,
      additionalCriteria: formData.additionalCriteria
    });

    // אם החליף מקום עבודה - תמיד זכאי
    if (formData.jobHistory === 'changed') {
      return true;
    }

    // אם ההכנסה מתחת ל-7000 ולא החליף עבודה - צריך לבדוק קריטריונים מהרשימה
    if (formData.income === 'below7000' && formData.jobHistory === 'same') {
      const relevantCriteria = [
        'pensionWithdrawal',
        'unemployment',
        'propertyTax',
        'securities',
        'rentalIncome',
        'over60'
      ];
      
      return formData.additionalCriteria?.some(criteria => 
        relevantCriteria.includes(criteria)
      ) || false;
    }

    // אם ההכנסה מעל 7000 ולא החליף עבודה - מספיק קריטריון אחד כלשהו
    if (formData.income === 'above7000' && formData.jobHistory === 'same') {
      return (formData.additionalCriteria?.length > 0) || false;
    }

    return false;
  };

  const handleNext = () => {
    // בדיקת תקינות השלב הנוכחי
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
          errorMessage = 'נא לבחור טווח הכנסה';
          break;
        case 3:
          errorMessage = 'נא לבחור האם החלפת מקום עבודה';
          break;
        case 5:
          errorMessage = 'נא למלא את כל פרטי הקשר';
          break;
      }
      
      if (errorMessage) {
        setErrors(prev => ({
          ...prev,
          [Object.keys(formData)[activeStep]]: errorMessage
        }));
        return;
      }
    }

    // בדיקת זכאות להחזר מס אחרי שלב הקריטריונים
    if (activeStep === 4 && !checkEligibilityForLowIncome()) {
      setShowNoEligibilityDialog(true);
      return;
    }

    // Check employment status logic
    if (activeStep === 1 && formData.employmentStatus === 'selfEmployed') {
      setShowSelfEmployedDialog(true);
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      // Trigger the form submission in PersonalDetailsStep
      setTriggerSubmit(true);
      
      const { personalDetails } = formData;
      
      const requiredFields = ['firstName', 'lastName', 'phone', 'email', 'idNumber', 'birthDate', 'address'];
      const missingFields = requiredFields.filter(field => !personalDetails?.[field]);
      
      if (missingFields.length > 0) {
        setErrors(prev => ({
          ...prev,
          personalDetails: 'אנא מלא את כל פרטי הקשר'
        }));
        return;
      }

      setIsSubmitting(true);
      
      // Calculate score
      const scoreResult = calculateScore(formData);
      
      const emailContent = `
      שם מלא: ${formData.personalDetails?.firstName} ${formData.personalDetails?.lastName}
      טלפון: ${formData.personalDetails?.phone}
      אימייל: ${formData.personalDetails?.email}
      תעודת זהות: ${formData.personalDetails?.idNumber}
      תאריך לידה: ${formData.personalDetails?.birthDate}
      כתובת: ${formData.personalDetails?.address}
      אישור הוצאת מסלקה פנסיונית: ${formData.personalDetails?.pensionClearance ? 'כן' : 'לא'}

      מצב משפחתי: ${formData.maritalStatus === 'married' ? 'נשוי/אה' : 'רווק/ה'}
      סטטוס תעסוקה: ${formData.employmentStatus === 'employed' ? 'שכיר' : 
                      formData.employmentStatus === 'selfEmployed' ? 'עצמאי' : 
                      formData.employmentStatus === 'bothEmployedAndSelfEmployed' ? 'שכיר + עצמאי' : 'לא עובד'}
      הכנסה חודשית: ${formData.income === 'above7000' ? 'מעל 7,000 ש"ח' : 'מתחת ל-7,000 ש"ח'}
      החלפת עבודה: ${formData.jobHistory === 'changed' ? 'כן' : 'לא'}
      
      קריטריונים נוספים:
      ${formData.additionalCriteria?.map(criteria => {
        const criteriaLabels = {
          unemployment: 'קבלת דמי אבטלה / כספים אחרים מביטוח לאומי',
          propertyTax: 'מכרתי נכס ושילמתי מס שבח',
          securities: 'סחרתי בניירות ערך סחירים',
          lifeInsurance: 'ביטוח חיים פרטי / ביטוח משכנתא',
          pensionDeposit: 'הפקדה באופן עצמאי לקופת גמל',
          donations: 'תרומות למוסדות מוכרים',
          disability: 'נכות מעל 90%',
          militaryService: 'שחרור מצה"ל / שירות לאומי',
          newImmigrant: 'עלייה חדשה',
          pensionWithdrawal: 'משיכת כספי פנסיה / פיצויים ושילמתי 35% מס',
          rentalIncome: 'אני מקבל הכנסה משכר דירה',
          over60: 'אני בן 60 ומעלה',
          jobChange: 'החלפתי מקום עבודה'
        };
        return `- ${criteriaLabels[criteria] || criteria}`;
      }).join('\n  ')}
      
      ציון: ${scoreResult.score}
      איכות הליד: ${scoreResult.quality}

      פירוט הניקוד:
      ${scoreResult.details.join('\n  ')}
      
      `;
      
      const templateParams = {
        subject: 'ליד חדש מטופס החזרי מס',
        message: emailContent
      };
  
      // Send the email
      await emailjs.send(
        'service_mg36429',
        'template_isk33ym',
        templateParams,
        '7ggM2WNflMbliCnaP'
      );
  
      // Show success dialog only after email is sent
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Failed to submit form:', error);
      setErrors(prev => ({
        ...prev,
        formSubmission: 'אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.'
      }));
    } finally {
      // Always reset the submitting state
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      maritalStatus: '',
      employmentStatus: '',
      income: '',
      jobHistory: '',
      additionalCriteria: [],
      personalDetails: {}
    });
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
          data={{ ...formData, triggerSubmit }}
          setFormData={setFormData}
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

      <Dialog
        open={showSelfEmployedDialog}
        onClose={() => setShowSelfEmployedDialog(false)}
        aria-labelledby="self-employed-dialog-title"
        aria-describedby="self-employed-dialog-description"
      >
        <DialogTitle id="self-employed-dialog-title">
          {"לא ניתן להמשיך בתהליך"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="self-employed-dialog-description">
            אם עבדת כעצמאי בלבד בין השנים 2019 - 2024 סימן שאתה מחוייב בהגשת דוחות שנתיים. אין באפשרותנו לבצע עבורך החזר מס אך משרדנו מטפל גם בהגשת דוחות שנתיים. במידה והינך מעוניין ליצור איתנו קשר יש להשאיר פרטיך.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSelfEmployedDialog(false)} color="primary" autoFocus>
            הבנתי
          </Button>
        </DialogActions>
      </Dialog>

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
        open={showNoEligibilityDialog}
        onClose={() => setShowNoEligibilityDialog(false)}
        aria-labelledby="no-eligibility-dialog-title"
        aria-describedby="no-eligibility-dialog-description"
      >
        <DialogTitle id="no-eligibility-dialog-title">
          {"אין זכאות להחזר מס"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="no-eligibility-dialog-description">
            על פי הנתונים שהזנת, נראה שאין לך זכאות להחזר מס. אם ברצונך להתייעץ עם צוות המומחים שלנו, אנא השאר את פרטיך.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setShowNoEligibilityDialog(false);
              setActiveStep(prevStep => prevStep + 1);
            }}
            color="primary"
          >
            המשך למילוי פרטים
          </Button>
          <Button 
            onClick={() => setShowNoEligibilityDialog(false)} 
            color="primary"
          >
            חזור
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: '100%', mb: 4 }}>
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
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" align="center" sx={{ mb: 1 }}>
            שלב {activeStep + 1} מתוך {steps.length}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(activeStep / (steps.length - 1)) * 100} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#1a237e',
                borderRadius: 4,
              }
            }}
          />
        </Box>
      </Box>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
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
                * השאלון נכתב בלשון זכר אך מתייחס לשני המינים
              </Typography>
            </div>
          </div>

          {getStepContent(activeStep)}
        </motion.div>
      </AnimatePresence>
      
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            disabled={isSubmitting}
          >
            חזור
          </Button>
        )}
        {activeStep === steps.length - 1 ? (
          <>
            {console.log('Form Data:', formData)}
            {console.log('Personal Details:', formData.personalDetails)}
            {console.log('Is Step Valid:', isStepValid())}
            {console.log('Validation Results:', {
              hasFirstName: Boolean(formData.personalDetails?.firstName?.trim()),
              hasLastName: Boolean(formData.personalDetails?.lastName?.trim()),
              hasPhone: Boolean(formData.personalDetails?.phone?.trim()),
              hasEmail: Boolean(formData.personalDetails?.email?.trim()),
              hasIdNumber: Boolean(formData.personalDetails?.idNumber?.trim()),
              hasBirthDate: Boolean(formData.personalDetails?.birthDate),
              hasAddress: Boolean(formData.personalDetails?.address?.trim())
            })}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!isStepValid() || isSubmitting}
              sx={{
                width: '200px',
                height: '50px',
                fontSize: '18px',
                '&.Mui-disabled': {
                  background: '#1976d2',
                  opacity: 0.7,
                  color: 'white'
                }
              }}
            >
              {isSubmitting ? 'שולח...' : 'שלח טופס'}
            </Button>
          </>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid() || isSubmitting}
          >
            הבא
          </Button>
        )}
      </Box>
    </div>
  );
};

export default TaxRefundForm;
