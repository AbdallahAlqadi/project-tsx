// MessageAlert.tsx
import React from 'react';
 // Ensure you include this CSS file

interface MessageAlertProps {
  message: string;
  onClose: () => void;
}

const MessageAlert: React.FC<MessageAlertProps> = ({ message, onClose }) => {
  return (
    <div className="message-alert">
      <div className="message-alert-content">
        <span>{message}</span>
        <button onClick={onClose} className="close-button">x</button>
      </div>
    </div>
  );
};

export default MessageAlert;
