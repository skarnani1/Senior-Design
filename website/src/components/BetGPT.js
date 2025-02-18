import React, { useState, useRef, useEffect } from 'react';
import { Send, Trophy, Dices, TrendingUp, Timer } from 'lucide-react';
import { Container, Box, Typography, Button, TextField } from '@mui/material';
import { ChatMessage } from './ChatMessage';
import chatService from '../services/chatService';
import { v4 as uuidv4 } from 'uuid';
import './BetGPT.css';

const SUGGESTIONS = [
  {
    icon: <Dices className="h-6 w-6" color="#1565c0" />,
    title: "Today's top picks",
    subtitle: "Best betting opportunities",
    query: "What are the best betting opportunities for today's games?"
  },
  {
    icon: <TrendingUp className="h-6 w-6" color="#1565c0" />,
    title: "Live odds analysis",
    subtitle: "Real-time updates",
    query: "Show me the current live odds for major games"
  },
  {
    icon: <Timer className="h-6 w-6" color="#1565c0" />,
    title: "Upcoming matches",
    subtitle: "Next 24 hours",
    query: "What important matches are coming up in the next 24 hours?"
  }
];

function BetGPT() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const [threadId] = useState(uuidv4());
  const messageContainerRef = useRef(null);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const processMessage = async (text) => {
    if (!text.trim()) return;
    
    console.log("Processing message:", text, "ThreadId:", threadId);
    setHasStartedChat(true);
    setMessages(prev => [...prev, { text, isBot: false }]);
    setInput('');
    setIsThinking(true);

    try {
      console.log("Calling chatService with text:", text);
      const response = await chatService.sendMessage(text, threadId);
      console.log("Received response from chatService:", response);
      setMessages(prev => [...prev, { 
        text: response.content, 
        isBot: true 
      }]);
    } catch (error) {
      console.error("Error in processMessage:", error);
      console.error("Full error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause
      });
      setMessages(prev => [...prev, { 
        text: `Error: ${error.message || "I apologize, but I encountered an error. Please try again."}`, 
        isBot: true 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    processMessage(input);
  };

  const handleSuggestionClick = (query) => {
    processMessage(query);
  };

  return (
    <Box className="gradient-bg" sx={{ minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ height: 'calc(100vh - 64px)' }}>
        <Box 
          ref={messageContainerRef}
          sx={{ 
            height: 'calc(100vh - 180px)', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto'
          }}
        >
          {!hasStartedChat ? (
            <>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flex: 1
              }}>
                <Box sx={{ 
                  height: 80, 
                  width: 80, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, #151515 0%, #505050 100%)'
                }}>
                  <Trophy size={40} color="white" />
                </Box>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    mt: 2, 
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #151515 0%, #606060 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Hi, Sports Fan
                </Typography>
                <Typography variant="h5" sx={{ mt: 1, color: 'text.secondary' }}>
                  Can I help you with anything?
                </Typography>
                <Typography sx={{ mt: 1, color: 'text.secondary', textAlign: 'center', maxWidth: 500 }}>
                  Ready to assist you with anything you need, from analyzing odds to providing recommendations. Let's get started!
                </Typography>
              </Box>

              {/* Suggestions */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
                gap: 2,
                mb: 2
              }}>
                {SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion.query)}
                    className="suggestion-card"
                    sx={{
                      p: 3,
                      bgcolor: 'white',
                      textAlign: 'left',
                      display: 'block',
                      border: '1px solid',
                      borderColor: 'grey.100',
                      borderRadius: 2,
                      textTransform: 'none'
                    }}
                  >
                    <Box sx={{ 
                      display: 'inline-flex',
                      p: 1.5,
                      borderRadius: '50%',
                      bgcolor: '#e3f2fd',
                      mb: 2
                    }}>
                      {suggestion.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        mb: 0.5,
                        color: 'grey.900',
                        fontWeight: 600
                      }}
                    >
                      {suggestion.title}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {suggestion.subtitle}
                    </Typography>
                  </Button>
                ))}
              </Box>
            </>
          ) : (
            <Box sx={{ mb: 3, pt: 8 }}>
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  message={message.text}
                  isBot={message.isBot}
                />
              ))}
              {isThinking && (
                <ChatMessage
                  message=""
                  isBot={true}
                  isThinking={true}
                />
              )}
            </Box>
          )}
        </Box>

        {/* Fixed Input Area */}
        <Box sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          p: 3,
          background: 'linear-gradient(to top, #ffeef7, #ffeef7, transparent)'
        }}>
          <Container maxWidth="lg">
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: '8px 16px',
                borderRadius: 50,
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'grey.100'
              }}
            >
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask BetAssist anything..."
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                }}
                sx={{ 
                  mx: 1,
                  '& input': {
                    py: 1
                  }
                }}
              />
              <Button 
                type="submit" 
                disabled={!input.trim()}
                sx={{ 
                  minWidth: 44,
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  bgcolor: '#6b7db3',
                  color: 'white',
                  '&:hover': { 
                    bgcolor: '#566497'
                  },
                  '&.Mui-disabled': { 
                    opacity: 0.5,
                    '& svg': {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  }
                }}
              >
                <Send size={20} />
              </Button>
            </Box>
          </Container>
        </Box>
      </Container>
    </Box>
  );
}

export default BetGPT; 