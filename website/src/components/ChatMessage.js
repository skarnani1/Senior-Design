import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function ChatMessage({ message, isBot, isThinking = false }) {
  // Function to process message text for markdown
  const formatMessage = (text) => {
    // Ensure line breaks are preserved
    return text.replace(/\n/g, '  \n');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      gap: 1.5,
      flexDirection: isBot ? 'row' : 'row-reverse',
      mb: 2,
      maxWidth: '70%',
      width: 'fit-content',
      marginLeft: isBot ? '0' : 'auto'
    }}>
      <Box sx={{ 
        height: 32,
        width: 32,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: isBot ? 'grey.900' : '#6b7db3',
        flexShrink: 0
      }}>
        {isBot ? 
          <Bot size={20} color="white" /> : 
          <User size={20} color="white" />
        }
      </Box>
      <Box sx={{ 
        flex: '0 1 auto',
        pr: isBot ? 6 : 0,
        pl: isBot ? 0 : 6
      }}>
        {isThinking ? (
          <Box sx={{ display: 'flex', gap: 1, p: 1.5 }}>
            {[0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  height: 12,
                  width: 12,
                  borderRadius: '50%',
                  bgcolor: 'grey.300',
                  animation: 'bounce 1s infinite',
                  animationDelay: `${i * -0.15}s`
                }}
              />
            ))}
          </Box>
        ) : (
          <Paper
            elevation={isBot ? 1 : 0}
            sx={{
              p: 2,
              borderRadius: 2.5,
              bgcolor: isBot ? 'white' : '#6b7db3',
              color: isBot ? 'text.primary' : 'white',
              border: isBot ? '1px solid' : 'none',
              borderColor: 'grey.100',
              animation: 'slideIn 0.3s ease-out forwards',
              '&:hover': {
                bgcolor: isBot ? 'white' : '#566497'
              },
              '& p': {
                margin: '0.5em 0',
              },
              '& strong': {
                fontWeight: 600,
              },
              '& ul, & ol': {
                margin: '0.5em 0',
                paddingLeft: '1.5em',
              },
              '& li': {
                margin: '0.25em 0',
              }
            }}
          >
            {isBot ? (
              <ReactMarkdown className="markdown-content">
                {formatMessage(message)}
              </ReactMarkdown>
            ) : (
              <Typography sx={{ wordBreak: 'break-word' }}>{message}</Typography>
            )}
          </Paper>
        )}
      </Box>
    </Box>
  );
}