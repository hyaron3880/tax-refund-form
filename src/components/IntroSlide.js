import React from 'react';
import {
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { motion } from 'framer-motion';
import MoneyIcon from '@mui/icons-material/Money';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const useStyles = makeStyles((theme) => ({
  introContainer: {
    padding: '40px',
    textAlign: 'center',
    '@media (max-width: 600px)': {
      padding: '20px',
    },
  },
  title: {
    color: '#1a237e',
    marginBottom: '30px',
    fontSize: '24px',
    fontWeight: 600,
    '@media (max-width: 600px)': {
      fontSize: '20px',
    },
  },
  subtitle: {
    color: '#333',
    marginBottom: '40px',
    fontSize: '16px',
  },
  benefitsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '40px',
    alignItems: 'center',
  },
  benefit: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    fontSize: '16px',
    color: '#444',
  },
  icon: {
    color: '#1a237e',
    fontSize: '24px',
  },
  startButton: {
    padding: '12px 40px',
    fontSize: '16px',
    borderRadius: '25px',
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  },
}));

const IntroSlide = ({ onStart }) => {
  const classes = useStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={0} className={classes.introContainer}>
        <Typography variant="h1" className={classes.title}>
          בדיקת זכאות להחזר מס
        </Typography>
        
        <Typography variant="body1" className={classes.subtitle}>
          תהליך קצר ופשוט לבדיקת זכאותך להחזר מס. מלא את הפרטים ונבדוק עבורך האם מגיע לך החזר.
        </Typography>

        <Box className={classes.benefitsList}>
          <div className={classes.benefit}>
            <MoneyIcon className={classes.icon} />
            <Typography>אפשרות לחסוך אלפי שקלים בשנה</Typography>
          </div>
          <div className={classes.benefit}>
            <AccessTimeIcon className={classes.icon} />
            <Typography>תהליך קצר של מספר דקות</Typography>
          </div>
          <div className={classes.benefit}>
            <CheckCircleIcon className={classes.icon} />
            <Typography>בדיקה מקיפה של כל אפשרויות ההחזר</Typography>
          </div>
        </Box>

        <Button
          variant="contained"
          color="primary"
          className={classes.startButton}
          onClick={onStart}
        >
          לבדיקת הזכאות
        </Button>
      </Paper>
    </motion.div>
  );
};

export default IntroSlide;
