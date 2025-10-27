import React from 'react';
import {
  Container, Typography, Box, Accordion, AccordionSummary,
  AccordionDetails, useTheme, useMediaQuery,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const FAQ = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const faqs = [
    {
      question: 'How do I submit a repair request?',
      answer: 'Click on the "New Request" button from the dashboard or bottom navigation. Fill in the details about your device and the issue, then submit.',
    },
    {
      question: 'How long does a repair take?',
      answer: 'Repair times vary depending on the issue and parts availability. You\'ll receive an estimated completion date when your request is processed.',
    },
    {
      question: 'Can I track my repair status?',
      answer: 'Yes! Go to "My Repairs" to see real-time updates on all your repair requests.',
    },
    {
      question: 'What if I need to cancel a repair?',
      answer: 'You can cancel a pending repair request from the "My Repairs" page. Once work has started, please contact support.',
    },
    {
      question: 'How do I add a new device?',
      answer: 'Go to "My Devices" and click "Add Device". Fill in your device information and save.',
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 10 : 4, px: isMobile ? 2 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700" gutterBottom>
        FAQ
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Frequently asked questions
      </Typography>

      <Box>
        {faqs.map((faq, index) => (
          <Accordion key={index} elevation={2} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography fontWeight="600">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Container>
  );
};

export default FAQ;