"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification from '@/components/Notification/Notification';

interface NotificationData {
  id: number;
  type: 'success' | 'info' | 'error';
  title: string;
  message: string;
}

interface NotificationContextType {
  addNotification: (type: 'success' | 'info' | 'error', title: string, message: string) => void;
  removeNotification: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = (type: 'success' | 'info' | 'error', title: string, message: string) => {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [...prevNotifications, { id, type, title, message }]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prevNotifications) => prevNotifications.filter((notification) => notification.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      {notifications.map(({ id, type, title, message }) => (
        <Notification
          key={id}
          id={id}
          type={type}
          title={title}
          message={message}
          removeNotification={removeNotification}
        />
      ))}
    </NotificationContext.Provider>
  );
};
