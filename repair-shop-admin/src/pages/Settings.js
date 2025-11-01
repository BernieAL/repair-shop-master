import React from 'react';
import {
  Container, Typography, Box, Card, CardContent, List,
  ListItem, ListItemText, ListItemIcon, Switch, Button,
  useTheme, useMediaQuery, Divider,
} from '@mui/material';
import {
  Notifications, Security, Palette, Language, Backup,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md" sx={{ mt: isMobile ? 2 : 4, mb: 4, px: isMobile ? 1.5 : 3 }}>
      <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight="600" gutterBottom>
        Settings
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Account Information
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Name"
                secondary={user?.name}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Email"
                secondary={user?.email}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Role"
                secondary={user?.role}
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            Preferences
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Notifications /></ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive email alerts for new orders"
              />
              <Switch defaultChecked />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><Palette /></ListItemIcon>
              <ListItemText
                primary="Dark Mode"
                secondary="Enable dark theme"
              />
              <Switch />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><Language /></ListItemIcon>
              <ListItemText
                primary="Language"
                secondary="English (US)"
              />
              <Button size="small">Change</Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="600" gutterBottom>
            System
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><Security /></ListItemIcon>
              <ListItemText
                primary="Change Password"
                secondary="Update your account password"
              />
              <Button size="small" variant="outlined">Change</Button>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon><Backup /></ListItemIcon>
              <ListItemText
                primary="Backup Data"
                secondary="Export all system data"
              />
              <Button size="small" variant="outlined">Export</Button>
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Settings;