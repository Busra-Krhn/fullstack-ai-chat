import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://fullstack-ai-chat-3drl.onrender.com/api';

function App() {
  const [user, setUser] = useState(null);
  const [nickname, setNickname] = useState('');
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages`);
      setMessages(response.data);
    } catch (error) {
      console.error('Mesajlar yüklenemedi:', error);
    }
  };

 
  useEffect(() => {
    loadMessages();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/users`, {
        nickname: nickname
      });
      setUser(response.data);
      setNickname('');
    } catch (error) {
      console.error('Kullanıcı oluşturulamadı:', error);
      alert('Kullanıcı oluşturulamadı!');
    } finally {
      setLoading(false);
    }
  };

  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !user) return;

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/messages`, {
        userId: user.id,
        text: messageText
      });
      
      setMessages([response.data, ...messages]);
      setMessageText('');
    } catch (error) {
      console.error('Mesaj gönderilemedi:', error);
      alert('Mesaj gönderilemedi!');
    } finally {
      setLoading(false);
    }
  };

  
  const getSentimentEmoji = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('5 star') || lowerLabel.includes('4 star')) {
      return '😊';
    } else if (lowerLabel.includes('1 star') || lowerLabel.includes('2 star')) {
      return '😢';
    } else {
      return '😐';
    }
  };

  
  const getSentimentColor = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel.includes('5 star') || lowerLabel.includes('4 star')) {
      return '#4caf50';
    } else if (lowerLabel.includes('1 star') || lowerLabel.includes('2 star')) {
      return '#f44336';
    } else {
      return '#ff9800';
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>💬 Chat Uygulaması</h1>

        {!user ? (
          
          <div className="login-box">
            <h2>Rumuz Gir</h2>
            <form onSubmit={handleCreateUser}>
              <input
                type="text"
                placeholder="Rumuzunuzu girin..."
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>
          </div>
        ) : (
    
          <div className="chat-container">
            <div className="user-info">
              Merhaba, <strong>{user.nickname}</strong>! 👋
            </div>

            {}
            <form onSubmit={handleSendMessage} className="message-form">
              <input
                type="text"
                placeholder="Mesajınızı yazın..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={loading}
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
            </form>

            {}
            <div className="messages-list">
              <h3>Mesajlar</h3>
              {messages.length === 0 ? (
                <p className="no-messages">Henüz mesaj yok. İlk mesajı sen gönder!</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="message-item">
                    <div className="message-header">
                      <span className="message-user">{msg.user?.nickname || 'Anonim'}</span>
                      <span 
                        className="message-sentiment"
                        style={{ color: getSentimentColor(msg.sentimentLabel) }}
                      >
                        {getSentimentEmoji(msg.sentimentLabel)} {msg.sentimentLabel} ({msg.sentimentScore.toFixed(2)})
                      </span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                    <div className="message-time">
                      {new Date(msg.createdAt).toLocaleString('tr-TR')}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;