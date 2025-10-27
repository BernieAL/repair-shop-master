import React, { useState } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Button,
  TextField, InputAdornment, IconButton, Grid, Chip, List,
  ListItem, ListItemText, ListItemIcon, Divider, useTheme,
  useMediaQuery, Snackbar, Alert,
} from '@mui/material';
import {
  ContentCopy, Share, WhatsApp, Facebook, Twitter,
  Email, CheckCircle, CardGiftcard, Person,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Referrals = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Generate referral code (in real app, this comes from backend)
  const referralCode = user?.id ? `REF${user.id.toString().padStart(6, '0')}` : 'REF000000';
  const referralLink = `https://repairshop.com/register?ref=${referralCode}`;

  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock data (replace with real API calls)
  const referralStats = {
    totalReferrals: 5,
    activeReferrals: 3,
    totalCredits: 75.00,
    pendingCredits: 25.00,
  };

  const referralHistory = [
    { name: 'John Smith', date: '2025-01-15', status: 'Active', credit: 15.00 },
    { name: 'Sarah Johnson', date: '2025-01-10', status: 'Active', credit: 15.00 },
    { name: 'Mike Wilson', date: '2025-01-05', status: 'Active', credit: 15.00 },
    { name: 'Emily Davis', date: '2024-12-28', status: 'Pending', credit: 15.00 },
    { name: 'Alex Brown', date: '2024-12-20', status: 'Pending', credit: 10.00 },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    if (navigator.vibrate) navigator.vibrate(50);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform) => {
    if (navigator.vibrate) navigator.vibrate(30);
    const text = `Join Repair Shop using my referral code ${referralCode} and get $10 off your first repair!`;
    const encodedText = encodeURIComponent(text);
    const encodedLink = encodeURIComponent(referralLink);

    let url = '';
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodedText}%20${encodedLink}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedLink}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedLink}`;
        break;
      case 'email':
        url = `mailto:?subject=Join Repair Shop&body=${encodedText}%20${encodedLink}`;
        break;
      default:
        break;
    }

    if (url) window.open(url, '_blank');
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: isMobile ? 2 : 4, mb: isMobile ? 10 : 4, px: isMobile ? 2 : 3 }}
    >
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="700" gutterBottom>
        Referrals & Credits
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Earn $15 credit for every friend who completes their first repair!
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Card elevation={isMobile ? 2 : 3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" color="primary.main" fontWeight="700">
                {referralStats.totalReferrals}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Referrals
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card elevation={isMobile ? 2 : 3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" color="success.main" fontWeight="700">
                {referralStats.activeReferrals}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card elevation={isMobile ? 2 : 3} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" color="white" fontWeight="700">
                ${referralStats.totalCredits.toFixed(2)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Total Credits
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={3}>
          <Card elevation={isMobile ? 2 : 3}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Typography variant="h4" color="warning.main" fontWeight="700">
                ${referralStats.pendingCredits.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Referral Code Card */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Your Referral Code
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Share your unique code with friends and earn credits!
          </Typography>

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
              border: '2px dashed',
              borderColor: 'primary.main',
              textAlign: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h3" fontWeight="700" color="primary.main" letterSpacing={2}>
              {referralCode}
            </Typography>
          </Box>

          <TextField
            fullWidth
            value={referralLink}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={copyToClipboard} edge="end">
                    <ContentCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" fontWeight="600" gutterBottom>
            Share via:
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<WhatsApp />}
                onClick={() => shareVia('whatsapp')}
                sx={{ justifyContent: 'flex-start' }}
              >
                WhatsApp
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                onClick={() => shareVia('facebook')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Facebook
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Twitter />}
                onClick={() => shareVia('twitter')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Twitter
              </Button>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Email />}
                onClick={() => shareVia('email')}
                sx={{ justifyContent: 'flex-start' }}
              >
                Email
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card sx={{ mb: 3 }} elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            How It Works
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.main',
                    fontWeight: 700,
                  }}
                >
                  1
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="Share your code"
                secondary="Send your unique referral code to friends"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.main',
                    fontWeight: 700,
                  }}
                >
                  2
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="They sign up"
                secondary="Your friend creates an account using your code"
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    bgcolor: 'secondary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'secondary.main',
                    fontWeight: 700,
                  }}
                >
                  3
                </Box>
              </ListItemIcon>
              <ListItemText
                primary="You both earn credits"
                secondary="Get $15 when they complete their first repair!"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Card elevation={isMobile ? 2 : 3}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Referral History
          </Typography>

          {referralHistory.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No referrals yet. Start sharing your code!
              </Typography>
            </Box>
          ) : (
            <List disablePadding>
              {referralHistory.map((referral, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <Divider />}
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Person color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={referral.name}
                      secondary={new Date(referral.date).toLocaleDateString()}
                    />
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" fontWeight="600" color="success.main">
                        +${referral.credit.toFixed(2)}
                      </Typography>
                      <Chip
                        label={referral.status}
                        size="small"
                        color={referral.status === 'Active' ? 'success' : 'warning'}
                        sx={{ mt: 0.5 }}
                      />
                    </Box>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: isMobile ? 76 : 24 }}
      >
        <Alert icon={<CheckCircle />} severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Referrals;