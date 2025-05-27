'use client';

import React from 'react';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Badge,
    Divider,
} from '@mui/material';
import { IoClose, IoNotificationsOutline } from 'react-icons/io5';

interface NotifyEntity {
    Id: string;
    title: string;
    content: string;
    type: string;
    image?: string;
    link?: string;
    receiver_id: string;
    is_read: boolean;
    is_delete: boolean;
    created_at: string;
    created_by: string;
    last_updated: string;
    updated_by: string;
    NotifySender: {
        Id: string;
        username: string;
    };
    NotifyReceiver: {
        Id: string;
        username: string;
    };
}

// Fake data based on NotifyEntity model
const fakeNotifications: NotifyEntity[] = [
    {
        Id: '1',
        title: 'New Order Received',
        content: 'You have received a new order for Product X.',
        type: 'order',
        image: 'https://picsum.photos/200',
        link: '/orders/123',
        receiver_id: 'user-1',
        is_read: false,
        is_delete: false,
        created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        created_by: 'system',
        last_updated: new Date(Date.now() - 3600000).toISOString(),
        updated_by: 'system',
        NotifySender: {
            Id: 'system-1',
            username: 'System',
        },
        NotifyReceiver: {
            Id: 'user-1',
            username: 'CurrentUser',
        },
    },
    {
        Id: '2',
        title: 'Payment Successful',
        content: 'Your payment for Order #12345 has been successfully processed.',
        type: 'payment',
        link: '/payments/456',
        receiver_id: 'user-1',
        is_read: true,
        is_delete: false,
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        created_by: 'system',
        last_updated: new Date(Date.now() - 86400000).toISOString(),
        updated_by: 'system',
        NotifySender: {
            Id: 'system-1',
            username: 'System',
        },
        NotifyReceiver: {
            Id: 'user-1',
            username: 'CurrentUser',
        },
    },
    {
        Id: '3',
        title: 'Shipment Update',
        content: 'Your order #67890 has been shipped and is on its way.',
        type: 'shipment',
        image: 'https://picsum.photos/200/300',
        link: '/orders/67890',
        receiver_id: 'user-1',
        is_read: false,
        is_delete: false,
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        created_by: 'system',
        last_updated: new Date(Date.now() - 172800000).toISOString(),
        updated_by: 'system',
        NotifySender: {
            Id: 'seller-1',
            username: 'Seller',
        },
        NotifyReceiver: {
            Id: 'user-1',
            username: 'CurrentUser',
        },
    },
    {
        Id: '4',
        title: 'New Message',
        content: 'You have a new message from Seller Y regarding your recent purchase.',
        type: 'message',
        link: '/messages/789',
        receiver_id: 'user-1',
        is_read: true,
        is_delete: false,
        created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        created_by: 'seller-2',
        last_updated: new Date(Date.now() - 259200000).toISOString(),
        updated_by: 'seller-2',
        NotifySender: {
            Id: 'seller-2',
            username: 'SellerY',
        },
        NotifyReceiver: {
            Id: 'user-1',
            username: 'CurrentUser',
        },
    },
];

interface NotifyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

// Helper function to format dates
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 24) {
        return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
        return `${Math.floor(diffInDays)} days ago`;
    } else {
        return date.toLocaleDateString();
    }
};

// Helper function to get notification icon based on type
const getNotificationIcon = (type: string, image?: string) => {
    if (image) {
        return <Avatar src={image} />;
    }

    switch (type) {
        case 'order':
            return <Avatar sx={{ bgcolor: 'primary.main' }}>O</Avatar>;
        case 'payment':
            return <Avatar sx={{ bgcolor: 'success.main' }}>P</Avatar>;
        case 'shipment':
            return <Avatar sx={{ bgcolor: 'info.main' }}>S</Avatar>;
        case 'message':
            return <Avatar sx={{ bgcolor: 'warning.main' }}>M</Avatar>;
        default:
            return (
                <Avatar>
                    <IoNotificationsOutline />
                </Avatar>
            );
    }
};

const NotifyDrawer: React.FC<NotifyDrawerProps> = ({ isOpen, onClose }) => {
    const unreadCount = fakeNotifications.filter((notify) => !notify.is_read).length;

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={onClose}
            PaperProps={{
                sx: {
                    width: { xs: '100%', sm: 400 },
                    maxWidth: '100%',
                },
            }}
        >
            <Box
                sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box display="flex" alignItems="center">
                    <Typography variant="h6" component="div">
                        Notifications
                    </Typography>
                    <Badge badgeContent={unreadCount} color="error" sx={{ ml: 1 }} />
                </Box>
                <IconButton onClick={onClose}>
                    <IoClose size={24} />
                </IconButton>
            </Box>

            {fakeNotifications.length === 0 ? (
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <Typography color="text.secondary">No notifications</Typography>
                </Box>
            ) : (
                <List sx={{ p: 0, overflowY: 'auto' }}>
                    {fakeNotifications.map((notification, index) => (
                        <React.Fragment key={notification.Id}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    bgcolor: notification.is_read ? 'background.paper' : 'action.hover',
                                    py: 1.5,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' },
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: { xs: 45, sm: 56 } }}>
                                  {getNotificationIcon(notification.type, notification.image)}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                      <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        flexDirection: { xs: 'column', sm: 'row' }
                                      }}>
                                        <Typography
                                          variant="subtitle2"
                                          component="span"
                                          sx={{
                                            fontSize: { xs: '0.9rem', sm: '0.875rem' },
                                            fontWeight: notification.is_read ? 400 : 600
                                          }}
                                        >
                                          {notification.title}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                          sx={{
                                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                            mt: { xs: 0.5, sm: 0 }
                                          }}
                                        >
                                          {formatDate(notification.created_at)}
                                        </Typography>
                                      </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                                            {notification.content}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                            {index < fakeNotifications.length - 1 && <Divider component="li" />}
                        </React.Fragment>
                    ))}
                </List>
            )}

            <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
                <Typography
                    variant="body2"
                    color="primary"
                    component="button"
                    sx={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontWeight: 'medium',
                        p: 0,
                        '&:hover': { textDecoration: 'underline' },
                    }}
                >
                    Mark all as read
                </Typography>
            </Box>
        </Drawer>
    );
};

export default NotifyDrawer;
