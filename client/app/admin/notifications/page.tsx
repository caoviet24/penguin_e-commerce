'use client';

import React, { useState } from 'react';
import { useSocket } from '@/providers/socket.provider'; // Adjust path as needed

const NotificationsPage = () => {
    const { socket, emit, isConnected } = useSocket();
    const [recipientUserId, setRecipientUserId] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipientUserId || !message) {
            setStatus('Recipient User ID and message are required.');
            return;
        }
        if (socket && isConnected) {
            emit('send_notification', { recipientUserId, message });
            setStatus(`Notification sent to ${recipientUserId}.`);
            setRecipientUserId('');
            setMessage('');
        } else {
            setStatus('Socket not connected. Cannot send notification.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Send Notification</h1>
            <p className="mb-2">Socket Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="recipientUserId" className="block text-sm font-medium text-gray-700">
                        Recipient User ID
                    </label>
                    <input
                        type="text"
                        id="recipientUserId"
                        value={recipientUserId}
                        onChange={(e) => setRecipientUserId(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter user ID"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                    </label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter notification message"
                    />
                </div>
                <button
                    type="submit"
                    disabled={!isConnected}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    Send Notification
                </button>
            </form>
            {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}
        </div>
    );
};

export default NotificationsPage;
