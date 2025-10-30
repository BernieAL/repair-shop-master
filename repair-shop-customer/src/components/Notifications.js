import React, { useState, useEffect } from 'react';
import {
  Popover, Box, Typography, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, Divider, Button, Badge, IconButton,
  useTheme, useMediaQuery, Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Build, CheckCircle, Message, Close,
  MarkEmailRead,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';

const Notifications = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      // Mock data for now - replace with actual API call
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
      setUnreadCount(mockNotifications.filter(n => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleOpen = (event) => {
    if (navigator.vibrate) navigator.vibrate(30);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification) => {
    if (navigator.vibrate) navigator.vibrate(30);
    
    // Mark as read
    if (!notification.read) {
      // API call to mark as read
      setNotifications(prev => 
        prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    handleClose();
    
    // Navigate to repair detail
    if (notification.repair_id) {
      navigate(`/repair/${notification.repair_id}`);
    }
  };

  const handleMarkAllRead = async () => {
    if (navigator.vibrate) navigator.vibrate(50);
    
    // API call to mark all as read
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
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
        return <NotificationsIcon sx={{ color: '#8E8E93' }} />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const open = Boolean(anchorEl);

  return (
    <>
      {/* Notification Bell */}
      <IconButton 
        onClick={handleOpen}
        sx={{ 
          color: 'white',
          mr: 1,
        }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Notifications Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: isMobile ? '100vw' : 420,
            maxHeight: isMobile ? '100vh' : 600,
            borderRadius: isMobile ? 0 : 3,
            mt: 1,
            overflow: 'hidden',
          }
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2.5,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: 1,
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            bgcolor: 'background.paper',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Typography variant="caption" color="text.secondary">
                {unreadCount} unread
              </Typography>
            )}
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllRead}
                startIcon={<MarkEmailRead fontSize="small" />}
                sx={{
                  textTransform: 'none',
                  fontSize: 12,
                  color: '#007AFF',
                }}
              >
                Mark all read
              </Button>
            )}
            {isMobile && (
              <IconButton size="small" onClick={handleClose}>
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 500, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    py: 2,
                    px: 2.5,
                    bgcolor: notification.read ? 'transparent' : '#007AFF08',
                    '&:hover': {
                      bgcolor: notification.read ? 'action.hover' : '#007AFF12',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: 'transparent',
                        border: '2px solid',
                        borderColor: notification.read ? 'divider' : '#007AFF',
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Typography 
                          variant="body2" 
                          fontWeight={notification.read ? 500 : 600}
                          sx={{ flex: 1, pr: 1 }}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#007AFF',
                              flexShrink: 0,
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            mb: 0.5,
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getTimeAgo(notification.timestamp)}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <Box
            sx={{
              p: 2,
              borderTop: 1,
              borderColor: 'divider',
              textAlign: 'center',
            }}
          >
            <Button
              fullWidth
              onClick={() => {
                handleClose();
                navigate('/notifications');
              }}
              sx={{
                textTransform: 'none',
                color: '#007AFF',
                fontWeight: 600,
              }}
            >
              View All Notifications
            </Button>
          </Box>
        )}
      </Popover>
    </>
  );
};

export default Notifications;