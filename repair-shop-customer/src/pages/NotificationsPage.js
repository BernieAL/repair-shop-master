import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Message,
  CheckCircle,
  Info,
  ArrowBack,
  DoneAll,
  Delete,
} from '@mui/icons-material';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/customers/notifications/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:8000/api/customers/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteNotification = async (notificationId, event) => {
    // Prevent the click from bubbling up to the ListItem
    event.stopPropagation();
    
    if (!window.confirm('Delete this notification?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8000/api/customers/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete notification');

      // Remove from state
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Failed to delete notification:', error);
      alert('Failed to delete notification. Please try again.');
    }
  };

  const clearAllNotifications = async () => {
    if (!window.confirm('Are you sure you want to clear all notifications? This cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/api/customers/notifications/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to clear notifications');

      setNotifications([]);
    
    } catch (error) {
      console.error('Failed to clear notifications:', error);
      alert('Failed to clear notifications. Please try again.');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch('http://localhost:8000/api/customers/notifications/read-all', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.work_order_id) {
      navigate('/my-repairs', {
        state: {
          openWorkOrderId: notification.work_order_id,
          openMessagesTab: notification.type === 'message'
        }
      });
    } else {
      navigate('/my-repairs');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <Message sx={{ color: '#3b82f6' }} />;
      case 'status_change':
        return <CheckCircle sx={{ color: '#10b981' }} />;
      case 'completed':
        return <CheckCircle sx={{ color: '#8b5cf6' }} />;
      case 'tech_note':
        return <Info sx={{ color: '#f59e0b' }} />;
      default:
        return <Info sx={{ color: '#6b7280' }} />;
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="700">
            Notifications
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
          <Chip
            label={`All (${notifications.length})`}
            onClick={() => setFilter('all')}
            color={filter === 'all' ? 'primary' : 'default'}
            variant={filter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Unread (${unreadCount})`}
            onClick={() => setFilter('unread')}
            color={filter === 'unread' ? 'primary' : 'default'}
            variant={filter === 'unread' ? 'filled' : 'outlined'}
          />
          <Chip
            label={`Read (${notifications.length - unreadCount})`}
            onClick={() => setFilter('read')}
            color={filter === 'read' ? 'primary' : 'default'}
            variant={filter === 'read' ? 'filled' : 'outlined'}
          />

          <Box sx={{ flexGrow: 1 }} />

          {/* Action Buttons */}
          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAll />}
              onClick={markAllAsRead}
              size="small"
              variant="outlined"
            >
              Mark All Read
            </Button>
          )}

          {notifications.length > 0 && (
            <Button
              startIcon={<Delete />}
              onClick={clearAllNotifications}
              size="small"
              variant="outlined"
              color="error"
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>
      {/* Notifications List */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        {filteredNotifications.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Info sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {filter === 'unread' ? 'No unread notifications' :
                filter === 'read' ? 'No read notifications' :
                  'No notifications yet'}
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  button
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                    '&:hover': {
                      bgcolor: notification.read ? 'action.hover' : 'action.selected',
                    },
                    py: 2,
                  }}
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => deleteNotification(notification.id, e)}
                      sx={{
                        '&:hover': {
                          color: 'error.main',
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: notification.read ? 'grey.200' : 'primary.light',
                        width: 48,
                        height: 48,
                      }}
                    >
                      {getNotificationIcon(notification.type)}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight={notification.read ? 400 : 600}
                        >
                          {notification.title}
                        </Typography>
                        {!notification.read && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {notification.message}
                        </Typography>
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                          {formatTime(notification.created_at)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default NotificationsPage;