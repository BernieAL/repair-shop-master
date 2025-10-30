
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Card, CardContent, Avatar,
  Chip, Tabs, Tab, Button, useTheme, useMediaQuery,
  List, ListItem, ListItemAvatar, ListItemText, Divider,
} from '@mui/material';
import {
  Build, Message, CheckCircle, FilterList, MarkEmailRead,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    // Mock data - replace with actual API call
    const mockNotifications = [
      {
        id: 1,
        type: 'status_change',
        title: 'Repair Status Updated',
        message: 'Your iPhone 15 Pro repair is now in progress',
        repair_id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        read: false,
      },
      {
        id: 2,
        type: 'tech_note',
        title: 'New Message from Technician',
        message: 'Screen replacement completed. Device is now in quality check.',
        repair_id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        read: false,
      },
      {
        id: 3,
        type: 'status_change',
        title: 'Repair Completed',
        message: 'Your MacBook Pro repair is ready for pickup!',
        repair_id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        read: true,
      },
      {
        id: 4,
        type: 'tech_note',
        title: 'Diagnostic Complete',
        message: 'We\'ve identified the issue with your device. View details for estimate.',
        repair_id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        read: true,
      },
    ];

    setNotifications(mockNotifications);
  };

  const handleNotificationClick = (notification) => {
    if (navigator.vibrate) navigator.vibrate(30);
    
    // Mark as read
    if (!notification.read) {
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
    }

    // Navigate to repair
    if (notification.repair_id) {
      navigate(`/repair/${notification.repair_id}`);
    }
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'status_change':
        return <Build sx={{ color: '#007AFF' }} />;
      case 'tech_note':
        return <Message sx={{ color: '#34C759' }} />;
      case 'completed':
        return <CheckCircle sx={{ color: '#34C759' }} />;
      default:
        return <Build sx={{ color: '#8E8E93' }} />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return !n.read; // Unread
    if (activeTab === 2) return n.type === 'status_change'; // Status Updates
    if (activeTab === 3) return n.type === 'tech_note'; // Messages
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container
      maxWidth="md"
      sx={{
        mt: isMobile ? 3 : 6,
        mb: isMobile ? 12 : 6,
        px: isMobile ? 2 : 3,
      }}
    >
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            fontWeight: 600,
            letterSpacing: '-0.02em',
            mb: 1,
          }}
        >
          Notifications
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              onClick={handleMarkAllRead}
              startIcon={<MarkEmailRead fontSize="small" />}
              sx={{
                textTransform: 'none',
                color: '#007AFF',
              }}
            >
              Mark all read
            </Button>
          )}
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              minHeight: 48,
            },
          }}
        >
          <Tab label="All" />
          <Tab label={`Unread ${unreadCount > 0 ? `(${unreadCount})` : ''}`} />
          <Tab label="Status Updates" />
          <Tab label="Messages" />
        </Tabs>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }} elevation={0}>
          <CardContent sx={{ p: 6, textAlign: 'center' }}>
            <Box sx={{ fontSize: 64, mb: 2 }}>🔔</Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              No notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You're all caught up!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: notification.read ? 'divider' : '#007AFF',
                bgcolor: notification.read ? 'transparent' : '#007AFF05',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: '#007AFF',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                },
              }}
              elevation={0}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: 'transparent',
                      border: '2px solid',
                      borderColor: notification.read ? 'divider' : '#007AFF',
                      width: 48,
                      height: 48,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                      <Typography
                        variant="body1"
                        fontWeight={notification.read ? 500 : 600}
                        sx={{ flex: 1, pr: 1 }}
                      >
                        {notification.title}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: '#007AFF',
                            flexShrink: 0,
                            mt: 0.5,
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getTimeAgo(notification.timestamp)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default NotificationsPage;