import React, { useState } from 'react';
import {
  Container, Typography, Box, Accordion, AccordionSummary,
  AccordionDetails, TextField, InputAdornment, Card, CardContent,
  Grid, Button, useTheme, useMediaQuery, Chip,
} from '@mui/material';
import {
  ExpandMore, Search, Phone, Email, Schedule,
  AttachMoney, Build, CalendarToday,
} from '@mui/icons-material';

const FAQ = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const faqs = [
    {
      category: 'General',
      icon: <Build />,
      color: 'primary',
      questions: [
        {
          question: 'What types of devices do you repair?',
          answer: 'We repair smartphones, tablets, laptops, desktop computers, and gaming consoles. Our technicians are certified to work on all major brands including Apple, Samsung, Dell, HP, Lenovo, and more.',
        },
        {
          question: 'How long does a typical repair take?',
          answer: 'Most repairs are completed within 1-3 business days. Simple repairs like screen replacements can often be done same-day. Complex issues or repairs requiring parts may take 3-7 business days.',
        },
        {
          question: 'Do you offer on-site repair services?',
          answer: 'Yes! We offer on-site repair services for businesses and homes. Contact us to schedule an on-site visit. Additional charges may apply based on location.',
        },
      ],
    },
    {
      category: 'Pricing & Payment',
      icon: <AttachMoney />,
      color: 'success',
      questions: [
        {
          question: 'How much do repairs cost?',
          answer: 'Repair costs vary depending on the device and issue. After diagnosis, we provide a detailed estimate before starting any work. Common repairs: Screen replacement ($79-$299), Battery replacement ($49-$149), Water damage repair ($99-$199).',
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), debit cards, PayPal, Apple Pay, Google Pay, and cash. Payment is due upon completion of repair.',
        },
        {
          question: 'Do you offer any warranties?',
          answer: 'Yes! All repairs come with a 90-day warranty on parts and labor. If the same issue occurs within 90 days, we'll fix it free of charge.',
        },
        {
          question: 'What is the no-show appointment fee?',
          answer: 'If you schedule an appointment and don't show up without 24-hour notice, a $10 fee will be added to your next repair. This helps us maintain quality service for all customers.',
        },
      ],
    },
    {
      category: 'Scheduling & Appointments',
      icon: <CalendarToday />,
      color: 'info',
      questions: [
        {
          question: 'How do I schedule an appointment?',
          answer: 'You can schedule through our online portal by clicking "New Service Request" and selecting your preferred date and time. You'll receive a confirmation email within 2 hours.',
        },
        {
          question: 'Can I drop off my device without an appointment?',
          answer: 'Yes, walk-ins are welcome! However, scheduled appointments receive priority service. We recommend booking ahead to minimize wait times.',
        },
        {
          question: 'What if I need to cancel or reschedule?',
          answer: 'You can cancel or reschedule up to 24 hours before your appointment without penalty. After that, the $10 no-show fee applies. Contact us at (555) 123-4567 or through the customer portal.',
        },
        {
          question: 'What are your hours of operation?',
          answer: 'Monday-Friday: 9 AM - 7 PM, Saturday: 10 AM - 6 PM, Sunday: Closed. We offer extended hours during peak seasons.',
        },
      ],
    },
    {
      category: 'Repair Process',
      icon: <Build />,
      color: 'warning',
      questions: [
        {
          question: 'What should I bring when I drop off my device?',
          answer: 'Please bring: 1) Your device and charger, 2) A valid ID, 3) Any accessories related to the issue. Remember to backup your data before drop-off.',
        },
        {
          question: 'Will my data be safe?',
          answer: 'We take data security seriously. Technicians only access what's necessary for repairs. However, we strongly recommend backing up all data before service as we cannot guarantee data preservation in all cases.',
        },
        {
          question: 'How will I know when my device is ready?',
          answer: 'You'll receive email and SMS notifications throughout the repair process: when we receive your device, after diagnosis, when work begins, and when it's ready for pickup.',
        },
        {
          question: 'What if the repair costs more than estimated?',
          answer: 'We'll always contact you before proceeding if additional work is needed. You can approve or decline the extra work. If you decline, you only pay the diagnosis fee.',
        },
      ],
    },
    {
      category: 'Contact & Support',
      icon: <Phone />,
      color: 'secondary',
      questions: [
        {
          question: 'How can I contact customer support?',
          answer: 'Phone: (555) 123-4567, Email: support@repairshop.com, Live Chat: Available 9 AM - 6 PM on our website, or through the "Contact" page in the customer portal.',
        },
        {
          question: 'Do you offer remote support?',
          answer: 'Yes! For software issues, we offer remote diagnostic and repair services. Schedule a remote session through the customer portal.',
        },
        {
          question: 'Where are you located?',
          answer: 'Main Location: 123 Tech Street, Suite 100, Your City, ST 12345. We also have mobile repair vans serving the greater metro area.',
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: isMobile ? 2 : 4, 
        mb: isMobile ? 10 : 4,
        px: isMobile ? 2 : 3,
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant={isMobile ? 'h4' : 'h3'} fontWeight="700" gutterBottom>
          Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Find answers to common questions about our repair services
        </Typography>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search for answers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600, mx: 'auto' }}
        />
      </Box>

      {/* Quick Contact Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent>
              <Phone color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="600">
                Call Us
              </Typography>
              <Typography variant="caption" color="text.secondary">
                (555) 123-4567
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent>
              <Email color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="600">
                Email Us
              </Typography>
              <Typography variant="caption" color="text.secondary">
                support@repair.com
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent>
              <Schedule color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="600">
                Hours
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Mon-Fri 9AM-7PM
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ textAlign: 'center', cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}>
            <CardContent>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="subtitle2" fontWeight="600">
                Book Now
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Schedule Service
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FAQ Sections */}
      {filteredFaqs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            No results found for "{searchQuery}"
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSearchQuery('')}
            sx={{ mt: 2 }}
          >
            Clear Search
          </Button>
        </Box>
      ) : (
        filteredFaqs.map((category, categoryIndex) => (
          <Box key={categoryIndex} sx={{ mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ mr: 1 }}>{category.icon}</Box>
              <Typography variant="h5" fontWeight="600">
                {category.category}
              </Typography>
              <Chip
                label={category.questions.length}
                size="small"
                color={category.color}
                sx={{ ml: 2 }}
              />
            </Box>
            
            {category.questions.map((faq, faqIndex) => (
              <Accordion
                key={faqIndex}
                expanded={expanded === `panel-${categoryIndex}-${faqIndex}`}
                onChange={handleChange(`panel-${categoryIndex}-${faqIndex}`)}
                elevation={1}
                sx={{ mb: 1 }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography fontWeight="500">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        ))
      )}

      {/* Still have questions */}
      <Card sx={{ mt: 4, bgcolor: 'primary.light' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Still have questions?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Our support team is here to help you
          </Typography>
          <Button variant="contained" size="large" startIcon={<Phone />}>
            Contact Support
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default FAQ;