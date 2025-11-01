import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IconButton,
    Badge,
    Menu,
    MenuItem,
    Box,
    Typography,
    Divider,
    Avatar,
    Button,
} from '@mui/material';
import {
    Notifications,
    Message,
    CheckCircle,
    Info,
    FiberManualRecord,
} from '@mui/icons-material';

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('http://localhost:8000/api/customers/notifications/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) return;

            const data = await response.json();
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const handleClick = (event) => {
        if (navigator.vibrate) navigator.vibrate(30);
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
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
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
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
            setUnreadCount(0);
            handleClose(); // Close the dropdown
        } catch (error) {
            console.error('Failed to clear notifications:', error);
            alert('Failed to clear notifications. Please try again.');
        }
    };

    const handleNotificationClick = (notification) => {
        if (navigator.vibrate) navigator.vibrate(30);
        markAsRead(notification.id);
        handleClose();

        // Navigate to repairs page with work order ID
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
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <>
            <IconButton onClick={handleClick} sx={{ color: 'white', mr: 1 }}>
                <Badge badgeContent={unreadCount} color="error">
                    <Notifications />
                </Badge>
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 8,
                    sx: {
                        width: 380,
                        maxWidth: '90vw',
                        maxHeight: 500,
                        mt: 1.5,
                        borderRadius: 2,
                        overflow: 'visible',
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                {/* Header */}
                {/* Header */}
                <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" fontWeight="600">
                        Notifications
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {unreadCount > 0 && (
                            <Button
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    markAllAsRead();
                                }}
                                sx={{ textTransform: 'none', minWidth: 'auto' }}
                            >
                                Mark all read
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearAllNotifications();
                                }}
                                sx={{ textTransform: 'none', minWidth: 'auto' }}
                                color="error"
                            >
                                Clear all
                            </Button>
                        )}
                    </Box>
                </Box>

                <Divider />

                {/* Notifications List */}
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ py: 6, textAlign: 'center' }}>
                            <Notifications sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                No notifications yet
                            </Typography>
                        </Box>
                    ) : (
                        notifications.slice(0, 5).map((notification) => (
                            <MenuItem
                                key={notification.id}
                                onClick={() => handleNotificationClick(notification)}
                                sx={{
                                    py: 1.5,
                                    px: 2,
                                    borderBottom: '1px solid',
                                    borderColor: 'divider',
                                    bgcolor: notification.read ? 'transparent' : 'action.hover',
                                    '&:hover': {
                                        bgcolor: notification.read ? 'action.hover' : 'action.selected',
                                    },
                                }}
                            >
                                <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                                    <Avatar
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            bgcolor: notification.read ? 'grey.200' : 'primary.light',
                                        }}
                                    >
                                        {getNotificationIcon(notification.type)}
                                    </Avatar>

                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={notification.read ? 400 : 600}
                                            sx={{ mb: 0.5 }}
                                        >
                                            {notification.title}
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {notification.message}
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                                            {formatTime(notification.created_at)}
                                        </Typography>
                                    </Box>

                                    {!notification.read && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FiberManualRecord sx={{ fontSize: 12, color: 'primary.main' }} />
                                        </Box>
                                    )}
                                </Box>
                            </MenuItem>
                        ))
                    )}
                </Box>

                {/* Footer */}
                {notifications.length > 0 && (
                    <>
                        <Divider />
                        <Box sx={{ p: 1, textAlign: 'center' }}>
                            <Button
                                fullWidth
                                size="small"
                                onClick={() => {
                                    navigate('/notifications');
                                    handleClose();
                                }}
                                sx={{ textTransform: 'none' }}
                            >
                                View All Notifications
                            </Button>
                        </Box>
                    </>
                )}
            </Menu>
        </>
    );
};

export default NotificationDropdown;