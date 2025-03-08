import { useState } from 'react';
import { MessageBox, Button } from 'react-chat-elements';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { 
        text: input, 
        position: 'right',
        date: new Date(),
        type: 'text'
      }]);
      setInput('');
    }
  };

  return (
    <div className="chat-container p-4 bg-background rounded-lg">
      <div className="messages space-y-4 mb-4">
        {messages.map((msg, index) => (
          <MessageBox
            key={index}
            position={msg.position}
            type={msg.type}
            text={msg.text}
            date={msg.date}
            className="message-bubble"
          />
        ))}
      </div>
      
      <div className="input-area flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 px-4 py-2 rounded-lg border border-input"
          placeholder="Type your message..."
        />
        <Button
          title="Send"
          onClick={handleSendMessage}
          className="send-button bg-primary text-primary-foreground hover:bg-primary/90"
        />
      </div>
    </div>
  );
};

export default ChatInterface;