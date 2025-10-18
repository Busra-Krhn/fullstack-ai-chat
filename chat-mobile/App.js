import axios from 'axios';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const API_URL = 'http://192.168.1.103:5157/api'; 

export default function App() {
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

 
  const handleCreateUser = async () => {
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

  
  const handleSendMessage = async () => {
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
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>💬 Chat Uygulaması</Text>
      </View>

      {!user ? (
        
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Rumuz Gir</Text>
          <TextInput
            style={styles.input}
            placeholder="Rumuzunuzu girin..."
            value={nickname}
            onChangeText={setNickname}
            editable={!loading}
          />
          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCreateUser}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
        </View>
      ) : (
       
        <View style={styles.chatContainer}>
          <View style={styles.userInfo}>
            <Text style={styles.userInfoText}>Merhaba, {user.nickname}! 👋</Text>
          </View>

          {}
          <View style={styles.messageInputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Mesajınızı yazın..."
              value={messageText}
              onChangeText={setMessageText}
              editable={!loading}
            />
            <TouchableOpacity 
              style={[styles.sendButton, loading && styles.buttonDisabled]}
              onPress={handleSendMessage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.sendButtonText}>Gönder</Text>
              )}
            </TouchableOpacity>
          </View>

          {}
          <ScrollView style={styles.messagesList}>
            <Text style={styles.messagesTitle}>Mesajlar</Text>
            {messages.length === 0 ? (
              <Text style={styles.noMessages}>Henüz mesaj yok</Text>
            ) : (
              messages.map((msg) => (
                <View key={msg.id} style={styles.messageItem}>
                  <View style={styles.messageHeader}>
                    <Text style={styles.messageUser}>{msg.user?.nickname || 'Anonim'}</Text>
                    <Text style={[styles.messageSentiment, { color: getSentimentColor(msg.sentimentLabel) }]}>
                      {getSentimentEmoji(msg.sentimentLabel)} {msg.sentimentLabel} ({msg.sentimentScore.toFixed(2)})
                    </Text>
                  </View>
                  <Text style={styles.messageText}>{msg.text}</Text>
                  <Text style={styles.messageTime}>
                    {new Date(msg.createdAt).toLocaleString('tr-TR')}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
  userInfo: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    alignItems: 'center',
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageInputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
    padding: 15,
  },
  messagesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  noMessages: {
    textAlign: 'center',
    color: '#999',
    marginTop: 50,
  },
  messageItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  messageUser: {
    fontWeight: 'bold',
    color: '#667eea',
  },
  messageSentiment: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});