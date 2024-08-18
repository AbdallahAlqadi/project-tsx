
import React from 'react';
 

interface MessageAlertProps {
  message: string;
  onClose: () => void;
}

//كود message in login

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
