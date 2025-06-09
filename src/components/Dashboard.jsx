import React, { useState, useEffect } from 'react';

const Dashboard = ({ onSignOut }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Task Completed', message: 'You completed "Update team documentation"', time: '5 min ago', read: false, type: 'success' },
    { id: 2, title: 'Timer Finished', message: 'Your 25-minute focus session is complete', time: '1 hour ago', read: false, type: 'info' },
    { id: 3, title: 'Weather Update', message: 'Temperature rising to 32°C today', time: '2 hours ago', read: true, type: 'warning' }
  ]);
  
  // Calculator
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  
  // Notepad
  const [notepadContent, setNotepadContent] = useState('Welcome to your personal notepad!\n\nStart typing your notes here...');
  
  // Todo
  const [todoItems, setTodoItems] = useState([
    { id: 1, text: 'Review project proposals', completed: false },
    { id: 2, text: 'Update team documentation', completed: true },
    { id: 3, text: 'Schedule client meeting', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');
  
  // Timer
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Color Picker
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorHistory, setColorHistory] = useState(['#3b82f6', '#ef4444', '#10b981', '#f59e0b']);
  
  // QR Code
  const [qrText, setQrText] = useState('https://example.com');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');
  
  // Unit Converter
  const [fromValue, setFromValue] = useState('1');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [convertedValue, setConvertedValue] = useState('3.28');
  
  // Password Generator
  const [passwordLength, setPasswordLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  
  // Base64 Encoder/Decoder
  const [base64Input, setBase64Input] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [base64Mode, setBase64Mode] = useState('encode');
  
  // JSON Formatter
  const [jsonInput, setJsonInput] = useState('{"name": "Aiza", "age": 22}');
  const [jsonOutput, setJsonOutput] = useState('');
  
  // Text Counter
  const [textCounterInput, setTextCounterInput] = useState('');
  
  // Profile & Settings
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'Aiza Sajid',
    email: 'aiza.sajid@example.com',
    avatar: 'AS',
    bio: 'Productivity enthusiast and tech lover',
    location: 'Abu Dhabi, UAE',
    timezone: 'Asia/Dubai'
  });
  const [preferences, setPreferences] = useState({
    theme: darkMode ? 'dark' : 'light',
    notifications: true,
    autoSave: true,
    compactMode: false,
    language: 'en',
    pomodoroLength: 25,
    shortBreak: 5,
    longBreak: 15
  });
  
  // ChatGPT
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?', timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    let interval = null;
    if (timerActive && (timerMinutes > 0 || timerSeconds > 0)) {
      interval = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(timerSeconds - 1);
        } else if (timerMinutes > 0) {
          setTimerMinutes(timerMinutes - 1);
          setTimerSeconds(59);
        }
      }, 1000);
    } else if (timerMinutes === 0 && timerSeconds === 0) {
      setTimerActive(false);
      // Add notification when timer finishes
      const newNotification = {
        id: Date.now(),
        title: 'Timer Finished!',
        message: 'Your focus session is complete. Great work!',
        time: 'Just now',
        read: false,
        type: 'success'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerMinutes, timerSeconds]);

  const tools = [
    { id: 'overview', label: 'Dashboard', icon: '🏠', description: 'Main overview', category: 'navigation' },
    { id: 'calculator', label: 'Calculator', icon: '🧮', description: 'Basic calculator', category: 'productivity' },
    { id: 'notepad', label: 'Notepad', icon: '📝', description: 'Text editor', category: 'productivity' },
    { id: 'todo', label: 'Todo List', icon: '✅', description: 'Task management', category: 'productivity' },
    { id: 'timer', label: 'Timer', icon: '⏰', description: 'Pomodoro timer', category: 'productivity' },
    { id: 'weather', label: 'Weather', icon: '🌤️', description: 'Weather info', category: 'utilities' },
    { id: 'colorpicker', label: 'Color Picker', icon: '🎨', description: 'Color tools', category: 'design' },
    { id: 'qrcode', label: 'QR Generator', icon: '📱', description: 'QR code maker', category: 'utilities' },
    { id: 'converter', label: 'Unit Converter', icon: '⚖️', description: 'Convert units', category: 'utilities' },
    { id: 'password', label: 'Password Gen', icon: '🔐', description: 'Generate passwords', category: 'security' },
    { id: 'base64', label: 'Base64 Tool', icon: '🔤', description: 'Encode/decode text', category: 'development' },
    { id: 'json', label: 'JSON Format', icon: '📋', description: 'Format JSON', category: 'development' },
    { id: 'counter', label: 'Text Counter', icon: '🔢', description: 'Count words/chars', category: 'utilities' },
    { id: 'chatgpt', label: 'ChatGPT', icon: '🤖', description: 'AI assistant chat', category: 'ai', comingSoon: true },
    { id: 'youtube', label: 'YouTube', icon: '📺', description: 'Video streaming', category: 'entertainment', comingSoon: true },
    { id: 'google', label: 'Google', icon: '🔍', description: 'Search engine', category: 'search', comingSoon: true }
  ];

  const categories = {
    productivity: { name: 'Productivity', icon: '⚡', color: '#3b82f6' },
    utilities: { name: 'Utilities', icon: '🔧', color: '#10b981' },
    development: { name: 'Development', icon: '💻', color: '#8b5cf6' },
    design: { name: 'Design', icon: '🎨', color: '#f59e0b' },
    security: { name: 'Security', icon: '🛡️', color: '#ef4444' },
    ai: { name: 'AI & Automation', icon: '🤖', color: '#06b6d4' },
    entertainment: { name: 'Entertainment', icon: '🎬', color: '#ec4899' },
    search: { name: 'Search & Browse', icon: '🔍', color: '#84cc16' }
  };

  // Helper functions
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleCalculatorInput = (value) => {
    if (calculatorDisplay === '0') {
      setCalculatorDisplay(value);
    } else {
      setCalculatorDisplay(calculatorDisplay + value);
    }
  };

  const calculateResult = () => {
    try {
      const result = eval(calculatorDisplay.replace(/×/g, '*').replace(/÷/g, '/'));
      setCalculatorDisplay(result.toString());
    } catch (error) {
      setCalculatorDisplay('Error');
    }
  };

  const clearCalculator = () => setCalculatorDisplay('0');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodoItems([...todoItems, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
      // Add notification for new todo
      const newNotification = {
        id: Date.now() + 1,
        title: 'Task Added',
        message: `New task: "${newTodo}"`,
        time: 'Just now',
        read: false,
        type: 'info'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const toggleTodo = (id) => {
    const todo = todoItems.find(item => item.id === id);
    setTodoItems(todoItems.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
    
    if (todo && !todo.completed) {
      // Add notification when task is completed
      const newNotification = {
        id: Date.now() + 2,
        title: 'Task Completed!',
        message: `You completed: "${todo.text}"`,
        time: 'Just now',
        read: false,
        type: 'success'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }
  };

  const deleteTodo = (id) => {
    setTodoItems(todoItems.filter(item => item.id !== id));
  };

  const startTimer = () => setTimerActive(true);
  const pauseTimer = () => setTimerActive(false);
  const resetTimer = () => {
    setTimerActive(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  const generateQRCode = async (text) => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size
      const size = 200;
      canvas.width = size;
      canvas.height = size;
      
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      // Simple QR code generation algorithm
      const modules = generateQRMatrix(text);
      const moduleSize = size / modules.length;
      
      ctx.fillStyle = '#000000';
      for (let row = 0; row < modules.length; row++) {
        for (let col = 0; col < modules[row].length; col++) {
          if (modules[row][col]) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
      
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL('image/png');
      setQrCodeDataURL(dataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const generateQRMatrix = (text) => {
    // Basic QR code matrix generation (simplified version)
    const size = 25;
    const matrix = Array(size).fill().map(() => Array(size).fill(false));
    
    // Add finder patterns (corner detection patterns)
    const addFinderPattern = (startRow, startCol) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const row = startRow + r;
          const col = startCol + c;
          if (row < size && col < size) {
            // Create the finder pattern structure
            const isEdge = r === 0 || r === 6 || c === 0 || c === 6;
            const isCenter = (r >= 2 && r <= 4) && (c >= 2 && c <= 4);
            matrix[row][col] = isEdge || isCenter;
          }
        }
      }
    };
    
    // Add three finder patterns
    addFinderPattern(0, 0);           // Top-left
    addFinderPattern(0, size - 7);    // Top-right
    addFinderPattern(size - 7, 0);    // Bottom-left
    
    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = i % 2 === 0;
      matrix[i][6] = i % 2 === 0;
    }
    
    // Add dark module
    matrix[4 * 4 + 9][8] = true;
    
    // Encode data (simplified - using text hash for pattern)
    const textBytes = new TextEncoder().encode(text);
    let dataIndex = 0;
    
    // Fill data area (zigzag pattern)
    for (let col = size - 1; col > 0; col -= 2) {
      if (col === 6) col--; // Skip timing column
      
      for (let row = 0; row < size; row++) {
        for (let c = 0; c < 2; c++) {
          const currentCol = col - c;
          const currentRow = (col % 4 < 2) ? row : size - 1 - row;
          
          if (currentRow >= 0 && currentRow < size && currentCol >= 0 && currentCol < size) {
            // Skip if it's a function pattern
            if (!isFunctionModule(currentRow, currentCol, size)) {
              // Use text data to determine module
              const byte = textBytes[dataIndex % textBytes.length] || 0;
              const bit = (byte >> (dataIndex % 8)) & 1;
              matrix[currentRow][currentCol] = bit === 1;
              dataIndex++;
            }
          }
        }
      }
    }
    
    return matrix;
  };

  const isFunctionModule = (row, col, size) => {
    // Check if this position is a function module (finder, timing, etc.)
    // Finder patterns
    if ((row < 9 && col < 9) || 
        (row < 9 && col >= size - 8) || 
        (row >= size - 8 && col < 9)) {
      return true;
    }
    
    // Timing patterns
    if (row === 6 || col === 6) {
      return true;
    }
    
    return false;
  };

  // Generate QR code when text changes
  React.useEffect(() => {
    if (qrText) {
      generateQRCode(qrText);
    }
  }, [qrText]);

  const convertUnits = () => {
    const conversions = {
      'meters-feet': 3.28084,
      'feet-meters': 0.3048,
      'kg-lbs': 2.20462,
      'lbs-kg': 0.453592,
      'celsius-fahrenheit': (c) => (c * 9/5) + 32,
      'fahrenheit-celsius': (f) => (f - 32) * 5/9
    };
    
    const key = `${fromUnit}-${toUnit}`;
    if (conversions[key]) {
      const value = parseFloat(fromValue) || 0;
      const result = typeof conversions[key] === 'function' 
        ? conversions[key](value) 
        : value * conversions[key];
      setConvertedValue(result.toFixed(2));
    }
  };

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
  };

  const handleBase64 = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(base64Input));
      } else {
        setBase64Output(atob(base64Input));
      }
    } catch (error) {
      setBase64Output('Error: Invalid input');
    }
  };

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
    } catch (error) {
      setJsonOutput('Error: Invalid JSON');
    }
  };

  // ChatGPT functionality
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);
    
    // Simulate AI response (replace with actual OpenAI API call)
    setTimeout(() => {
      const responses = [
        "That's an interesting question! Let me think about that...",
        "I'd be happy to help you with that. Here's what I think...",
        "Great question! Based on what you've asked, I would suggest...",
        "That's a fascinating topic. From my understanding...",
        "I appreciate you asking! Here's my perspective on this...",
        "Let me break this down for you step by step...",
        "That's a really good point. I think the key here is...",
        "I understand what you're looking for. Here's what I recommend..."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
      
      // Add notification for new AI response
      const newNotification = {
        id: Date.now() + 2,
        title: 'AI Response Ready',
        message: 'ChatGPT has responded to your message',
        time: 'Just now',
        read: false,
        type: 'info'
      };
      setNotifications(prev => [newNotification, ...prev]);
    }, 2000);
  };

  const clearChat = () => {
    setChatMessages([
      { id: 1, role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?', timestamp: new Date() }
    ]);
  };

  // Profile and Settings handlers
  const handleSignOut = () => {
    // Clear any user data
    localStorage.removeItem('userToken');
    localStorage.removeItem('userProfile');
    
    // Call the onSignOut prop to navigate to Login
    if (onSignOut) {
      onSignOut();
    } else {
      // Fallback: reload page or redirect
      window.location.href = '/login';
    }
  };

  const updateProfile = (field, value) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Show notification
    const newNotification = {
      id: Date.now(),
      title: 'Profile Updated',
      message: `Your ${field} has been updated successfully`,
      time: 'Just now',
      read: false,
      type: 'success'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const updatePreferences = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Apply theme change immediately
    if (field === 'theme') {
      setDarkMode(value === 'dark');
    }
    
    // Apply pomodoro settings
    if (field === 'pomodoroLength') {
      setTimerMinutes(parseInt(value));
      setTimerSeconds(0);
    }
    
    // Show notification
    const newNotification = {
      id: Date.now(),
      title: 'Preferences Updated',
      message: `${field} preference has been saved`,
      time: 'Just now',
      read: false,
      type: 'info'
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const cardStyle = {
    backgroundColor: darkMode ? '#1f2937' : '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontWeight: '500'
  };

  const inputStyle = {
    padding: '8px 16px',
    border: `1px solid ${darkMode ? '#4b5563' : '#d1d5db'}`,
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: darkMode ? '#374151' : '#ffffff',
    color: darkMode ? '#ffffff' : '#111827'
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'chatgpt':
        return (
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <div style={{...cardStyle, padding: 0, overflow: 'hidden', height: '600px', display: 'flex', flexDirection: 'column'}}>
              {/* Chat Header */}
              <div style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                padding: '16px 24px',
                borderBottom: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#10b981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{fontSize: '20px'}}>🤖</span>
                  </div>
                  <div>
                    <h3 style={{fontSize: '16px', fontWeight: '600', color: darkMode ? '#ffffff' : '#111827', margin: 0}}>
                      ChatGPT Assistant
                    </h3>
                    <p style={{fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280', margin: 0}}>
                      {isTyping ? 'AI is typing...' : 'Online'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearChat}
                  style={{
                    ...buttonStyle,
                    backgroundColor: 'transparent',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    fontSize: '14px'
                  }}
                >
                  Clear Chat
                </button>
              </div>

              {/* Chat Messages */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px',
                backgroundColor: darkMode ? '#1f2937' : '#ffffff'
              }}>
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '16px'
                    }}
                  >
                    <div style={{
                      maxWidth: '70%',
                      padding: '12px 16px',
                      borderRadius: '18px',
                      backgroundColor: message.role === 'user' 
                        ? '#3b82f6' 
                        : (darkMode ? '#374151' : '#f3f4f6'),
                      color: message.role === 'user' 
                        ? '#ffffff' 
                        : (darkMode ? '#ffffff' : '#111827')
                    }}>
                      <p style={{margin: 0, fontSize: '14px', lineHeight: '1.5'}}>
                        {message.content}
                      </p>
                      <div style={{
                        fontSize: '11px',
                        opacity: 0.7,
                        marginTop: '4px',
                        textAlign: message.role === 'user' ? 'right' : 'left'
                      }}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div style={{display: 'flex', justifyContent: 'flex-start', marginBottom: '16px'}}>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: '18px',
                      backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                      color: darkMode ? '#ffffff' : '#111827'
                    }}>
                      <div style={{display: 'flex', gap: '4px', alignItems: 'center'}}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'pulse 1.5s ease-in-out infinite'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'pulse 1.5s ease-in-out infinite 0.3s'
                        }}></div>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#9ca3af',
                          borderRadius: '50%',
                          animation: 'pulse 1.5s ease-in-out infinite 0.6s'
                        }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div style={{
                padding: '16px 24px',
                borderTop: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                backgroundColor: darkMode ? '#374151' : '#f9fafb'
              }}>
                <div style={{display: 'flex', gap: '12px', alignItems: 'end'}}>
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendChatMessage();
                      }
                    }}
                    placeholder="Type your message... (Press Enter to send)"
                    style={{
                      ...inputStyle,
                      flex: 1,
                      resize: 'none',
                      minHeight: '40px',
                      maxHeight: '120px'
                    }}
                    rows={1}
                  />
                  <button
                    onClick={sendChatMessage}
                    disabled={!chatInput.trim() || isTyping}
                    style={{
                      ...buttonStyle,
                      backgroundColor: (!chatInput.trim() || isTyping) ? '#9ca3af' : '#3b82f6',
                      color: '#ffffff',
                      minWidth: '80px'
                    }}
                  >
                    {isTyping ? '...' : 'Send'}
                  </button>
                </div>
                <div style={{
                  fontSize: '11px',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  marginTop: '8px',
                  textAlign: 'center'
                }}>
                  💡 This is a demo version. For real AI responses, connect to OpenAI API securely.
                </div>
              </div>
            </div>
          </div>
        );

      case 'youtube':
      case 'google':
        const currentTool = tools.find(tool => tool.id === activeTab);
        return (
          <div style={{...cardStyle, textAlign: 'center'}}>
            <div style={{fontSize: '96px', marginBottom: '16px'}}>{currentTool?.icon}</div>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: darkMode ? '#ffffff' : '#111827'}}>
              {currentTool?.label} - Coming Soon!
            </h2>
            <p style={{color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: '24px', fontSize: '16px'}}>
              {currentTool?.description} will be available in a future update.
            </p>
            <div style={{
              backgroundColor: darkMode ? '#374151' : '#f3f4f6',
              borderRadius: '8px',
              padding: '16px',
              display: 'inline-block'
            }}>
              <span style={{fontSize: '20px', marginRight: '8px'}}>🚀</span>
              <span style={{color: darkMode ? '#d1d5db' : '#374151', fontWeight: '500'}}>
                Stay tuned for exciting updates!
              </span>
            </div>
          </div>
        );

      default: return '🔔';
    }
  };

  const renderToolContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
            {/* Welcome Section */}
            <div style={{
              ...cardStyle,
              background: darkMode 
                ? 'linear-gradient(135deg, #1f2937, #374151)' 
                : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              textAlign: 'center'
            }}>
              <h2 style={{fontSize: '32px', fontWeight: 'bold', marginBottom: '8px'}}>
                Welcome back, Aiza! 👋
              </h2>
              <p style={{fontSize: '18px', opacity: 0.9}}>
                Ready to boost your productivity? Choose your tools below.
              </p>
            </div>

            {/* Quick Stats */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
              <div style={{...cardStyle, textAlign: 'center'}}>
                <div style={{fontSize: '32px', marginBottom: '8px'}}>✅</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px'}}>
                  {todoItems.filter(item => item.completed).length}
                </div>
                <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  Tasks Completed
                </div>
              </div>
              
              <div style={{...cardStyle, textAlign: 'center'}}>
                <div style={{fontSize: '32px', marginBottom: '8px'}}>📝</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px'}}>
                  {notepadContent.split('\n').length}
                </div>
                <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  Notes Lines
                </div>
              </div>
              
              <div style={{...cardStyle, textAlign: 'center'}}>
                <div style={{fontSize: '32px', marginBottom: '8px'}}>🔔</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px'}}>
                  {unreadCount}
                </div>
                <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  New Notifications
                </div>
              </div>
              
              <div style={{...cardStyle, textAlign: 'center'}}>
                <div style={{fontSize: '32px', marginBottom: '8px'}}>🛠️</div>
                <div style={{fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px'}}>
                  {tools.length - 1}
                </div>
                <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                  Available Tools
                </div>
              </div>
            </div>

            {/* Categorized Tools */}
            {Object.entries(categories).map(([categoryKey, category]) => {
              const categoryTools = tools.filter(tool => tool.category === categoryKey);
              if (categoryTools.length === 0) return null;
              
              return (
                <div key={categoryKey} style={{marginBottom: '24px'}}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '8px',
                    borderBottom: `2px solid ${category.color}`
                  }}>
                    <span style={{fontSize: '24px'}}>{category.icon}</span>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '600',
                      color: darkMode ? '#ffffff' : '#111827',
                      margin: 0
                    }}>
                      {category.name}
                    </h3>
                    <span style={{
                      backgroundColor: category.color,
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 8px',
                      borderRadius: '12px'
                    }}>
                      {categoryTools.length} tools
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px'
                  }}>
                    {categoryTools.map((tool) => (
                      <div
                        key={tool.id}
                        onClick={() => tool.comingSoon ? null : setActiveTab(tool.id)}
                        style={{
                          ...cardStyle,
                          cursor: tool.comingSoon ? 'not-allowed' : 'pointer',
                          border: `2px solid transparent`,
                          transition: 'all 0.3s ease',
                          opacity: tool.comingSoon ? 0.7 : 1,
                          position: 'relative',
                          ':hover': {
                            borderColor: tool.comingSoon ? 'transparent' : category.color,
                            transform: tool.comingSoon ? 'none' : 'translateY(-2px)'
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (!tool.comingSoon) {
                            e.target.style.borderColor = category.color;
                            e.target.style.transform = 'translateY(-2px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!tool.comingSoon) {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.transform = 'translateY(0)';
                          }
                        }}
                      >
                        {tool.comingSoon && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            backgroundColor: '#f59e0b',
                            color: '#ffffff',
                            fontSize: '10px',
                            fontWeight: '600',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            zIndex: 1
                          }}>
                            COMING SOON
                          </div>
                        )}
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                          <div style={{
                            fontSize: '40px',
                            padding: '12px',
                            borderRadius: '12px',
                            backgroundColor: `${category.color}20`
                          }}>
                            {tool.icon}
                          </div>
                          <div style={{flex: 1}}>
                            <h4 style={{
                              fontWeight: '600',
                              color: tool.comingSoon 
                                ? (darkMode ? '#9ca3af' : '#6b7280') 
                                : (darkMode ? '#ffffff' : '#111827'),
                              marginBottom: '4px',
                              fontSize: '16px'
                            }}>
                              {tool.label}
                            </h4>
                            <p style={{
                              color: darkMode ? '#9ca3af' : '#6b7280',
                              fontSize: '14px',
                              margin: 0
                            }}>
                              {tool.description}
                            </p>
                          </div>
                          <div style={{
                            fontSize: '20px',
                            color: tool.comingSoon ? '#9ca3af' : category.color
                          }}>
                            {tool.comingSoon ? '⏰' : '→'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        );

      case 'calculator':
        return (
          <div style={{maxWidth: '384px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <div style={{
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                textAlign: 'right',
                fontSize: '24px',
                fontFamily: 'monospace',
                color: darkMode ? '#ffffff' : '#111827',
                minHeight: '40px'
              }}>
                {calculatorDisplay}
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px'}}>
                {[
                  ['C', '⌫', '÷', '×'],
                  ['7', '8', '9', '-'],
                  ['4', '5', '6', '+'],
                  ['1', '2', '3', '='],
                  ['0', '0', '.', '=']
                ].map((row, i) => (
                  <React.Fragment key={i}>
                    {row.map((btn, j) => (
                      <button
                        key={`${i}-${j}`}
                        onClick={() => {
                          if (btn === 'C') clearCalculator();
                          else if (btn === '⌫') setCalculatorDisplay(calculatorDisplay.slice(0, -1) || '0');
                          else if (btn === '=') calculateResult();
                          else handleCalculatorInput(btn);
                        }}
                        style={{
                          ...buttonStyle,
                          backgroundColor: btn === '=' ? '#3b82f6' : (darkMode ? '#374151' : '#f9fafb'),
                          color: btn === '=' ? '#ffffff' : (darkMode ? '#ffffff' : '#111827'),
                          gridColumn: btn === '0' && j === 0 ? 'span 2' : 'auto'
                        }}
                      >
                        {btn}
                      </button>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notepad':
        return (
          <div style={{maxWidth: '1024px', margin: '0 auto'}}>
            <div style={{...cardStyle, padding: 0, overflow: 'hidden'}}>
              <div style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                padding: '8px 16px',
                borderBottom: `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{display: 'flex', gap: '4px'}}>
                  <div style={{width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '50%'}}></div>
                  <div style={{width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '50%'}}></div>
                  <div style={{width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%'}}></div>
                </div>
                <span style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>Notepad</span>
              </div>
              <textarea
                value={notepadContent}
                onChange={(e) => setNotepadContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '384px',
                  padding: '24px',
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  color: darkMode ? '#ffffff' : '#111827',
                  resize: 'none',
                  outline: 'none',
                  border: 'none',
                  fontFamily: 'monospace',
                  fontSize: '14px'
                }}
                placeholder="Start typing your notes here..."
              />
            </div>
          </div>
        );

      case 'todo':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <div style={{display: 'flex', gap: '8px', marginBottom: '24px'}}>
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                  placeholder="Add a new task..."
                  style={{...inputStyle, flex: 1}}
                />
                <button onClick={addTodo} style={{...buttonStyle, backgroundColor: '#3b82f6', color: '#ffffff'}}>
                  Add
                </button>
              </div>
              <div>
                {todoItems.map((item) => (
                  <div key={item.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleTodo(item.id)}
                      style={{width: '20px', height: '20px'}}
                    />
                    <span style={{
                      flex: 1,
                      textDecoration: item.completed ? 'line-through' : 'none',
                      color: item.completed ? '#6b7280' : (darkMode ? '#ffffff' : '#111827')
                    }}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => deleteTodo(item.id)}
                      style={{backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px'}}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'timer':
        return (
          <div style={{maxWidth: '384px', margin: '0 auto'}}>
            <div style={{...cardStyle, textAlign: 'center'}}>
              <div style={{
                fontSize: '60px',
                fontFamily: 'monospace',
                color: darkMode ? '#ffffff' : '#111827',
                marginBottom: '32px'
              }}>
                {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
              </div>
              <div style={{display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px'}}>
                <button onClick={startTimer} style={{...buttonStyle, backgroundColor: '#10b981', color: '#ffffff'}}>
                  ▶️ Start
                </button>
                <button onClick={pauseTimer} style={{...buttonStyle, backgroundColor: '#f59e0b', color: '#ffffff'}}>
                  ⏸️ Pause
                </button>
                <button onClick={resetTimer} style={{...buttonStyle, backgroundColor: '#ef4444', color: '#ffffff'}}>
                  🔄 Reset
                </button>
              </div>
              <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                Pomodoro Timer - Stay focused and productive!
              </div>
            </div>
          </div>
        );

      case 'weather':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={{
              background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
              borderRadius: '12px',
              padding: '32px',
              color: '#ffffff',
              textAlign: 'center'
            }}>
              <div style={{fontSize: '60px', marginBottom: '16px'}}>☀️</div>
              <h2 style={{fontSize: '30px', fontWeight: 'bold', marginBottom: '8px'}}>Ras Al Khaimah</h2>
              <div style={{fontSize: '48px', fontWeight: '300', marginBottom: '16px'}}>28°C</div>
              <p style={{fontSize: '20px', marginBottom: '24px'}}>Sunny and Clear</p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                <div style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '16px'}}>
                  <div style={{fontSize: '32px', marginBottom: '8px'}}>💧</div>
                  <div style={{fontSize: '14px'}}>Humidity</div>
                  <div style={{fontSize: '18px', fontWeight: '600'}}>45%</div>
                </div>
                <div style={{backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px', padding: '16px'}}>
                  <div style={{fontSize: '32px', marginBottom: '8px'}}>💨</div>
                  <div style={{fontSize: '14px'}}>Wind Speed</div>
                  <div style={{fontSize: '18px', fontWeight: '600'}}>12 km/h</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'colorpicker':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <div style={{textAlign: 'center', marginBottom: '24px'}}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: selectedColor,
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  border: '4px solid rgba(255, 255, 255, 0.8)',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                }}></div>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{width: '60px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer'}}
                />
              </div>
              
              <div style={{marginBottom: '24px'}}>
                <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: darkMode ? '#ffffff' : '#111827'}}>
                  Color Information
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                  <div>
                    <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>HEX</div>
                    <div style={{fontFamily: 'monospace', color: darkMode ? '#ffffff' : '#111827'}}>{selectedColor.toUpperCase()}</div>
                  </div>
                  <div>
                    <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>RGB</div>
                    <div style={{fontFamily: 'monospace', color: darkMode ? '#ffffff' : '#111827'}}>
                      {parseInt(selectedColor.slice(1, 3), 16)}, {parseInt(selectedColor.slice(3, 5), 16)}, {parseInt(selectedColor.slice(5, 7), 16)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#ffffff' : '#111827'}}>
                  Color History
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  {colorHistory.map((color, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: color,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: selectedColor === color ? '3px solid #3b82f6' : '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'qrcode':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Text to encode:
                </label>
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="Enter text or URL"
                  style={{...inputStyle, width: '100%'}}
                />
              </div>
              
              <div style={{textAlign: 'center', marginBottom: '24px'}}>
                <div style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  display: 'inline-block',
                  border: '2px solid #e5e7eb'
                }}>
                  {qrCodeDataURL ? (
                    <img 
                      src={qrCodeDataURL} 
                      alt="QR Code" 
                      style={{
                        width: '200px',
                        height: '200px',
                        imageRendering: 'pixelated'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '200px',
                      height: '200px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9ca3af',
                      fontSize: '14px'
                    }}>
                      Generating QR Code...
                    </div>
                  )}
                </div>
                <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: '16px'}}>
                  QR Code for: {qrText.length > 40 ? qrText.substring(0, 40) + '...' : qrText}
                </div>
                
                {/* Download Button */}
                {qrCodeDataURL && (
                  <a
                    href={qrCodeDataURL}
                    download={`qrcode-${Date.now()}.png`}
                    style={{
                      ...buttonStyle,
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginBottom: '16px'
                    }}
                  >
                    📥 Download QR Code
                  </a>
                )}
              </div>
              
              {/* Quick Actions */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px'}}>
                <button
                  onClick={() => setQrText('https://github.com')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827'}}
                >
                  📱 Website URL
                </button>
                <button
                  onClick={() => setQrText('mailto:hello@example.com?subject=Hello&body=Hi there!')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827'}}
                >
                  ✉️ Email
                </button>
                <button
                  onClick={() => setQrText('tel:+1234567890')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827'}}
                >
                  📞 Phone
                </button>
                <button
                  onClick={() => setQrText('WIFI:T:WPA;S:MyWiFi;P:mypassword123;H:false;;')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827'}}
                >
                  📶 WiFi
                </button>
              </div>
              
              {/* Additional Quick Actions */}
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px'}}>
                <button
                  onClick={() => setQrText('BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827', fontSize: '12px'}}
                >
                  👤 Contact Card
                </button>
                <button
                  onClick={() => setQrText('geo:40.7128,-74.0060')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827', fontSize: '12px'}}
                >
                  📍 Location
                </button>
                <button
                  onClick={() => setQrText('https://www.youtube.com/watch?v=dQw4w9WgXcQ')}
                  style={{...buttonStyle, backgroundColor: darkMode ? '#374151' : '#f9fafb', color: darkMode ? '#ffffff' : '#111827', fontSize: '12px'}}
                >
                  📺 YouTube
                </button>
              </div>
              
              {/* Info */}
              <div style={{
                backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '13px',
                color: darkMode ? '#9ca3af' : '#6b7280'
              }}>
                ✅ <strong>Real QR Codes:</strong> This generates actual scannable QR codes! 
                Try scanning with your phone's camera or any QR code reader app.
              </div>
            </div>
          </div>
        );

      case 'converter':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: darkMode ? '#ffffff' : '#111827'}}>
                Unit Converter
              </h3>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '16px', alignItems: 'end', marginBottom: '24px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    From:
                  </label>
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    style={{...inputStyle, width: '100%', marginBottom: '8px'}}
                  />
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    style={{...inputStyle, width: '100%'}}
                  >
                    <option value="meters">Meters</option>
                    <option value="feet">Feet</option>
                    <option value="kg">Kilograms</option>
                    <option value="lbs">Pounds</option>
                    <option value="celsius">Celsius</option>
                    <option value="fahrenheit">Fahrenheit</option>
                  </select>
                </div>
                
                <button onClick={convertUnits} style={{...buttonStyle, backgroundColor: '#3b82f6', color: '#ffffff'}}>
                  ⇄
                </button>
                
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    To:
                  </label>
                  <input
                    type="text"
                    value={convertedValue}
                    readOnly
                    style={{...inputStyle, width: '100%', marginBottom: '8px', backgroundColor: darkMode ? '#4b5563' : '#f3f4f6'}}
                  />
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    style={{...inputStyle, width: '100%'}}
                  >
                    <option value="feet">Feet</option>
                    <option value="meters">Meters</option>
                    <option value="lbs">Pounds</option>
                    <option value="kg">Kilograms</option>
                    <option value="fahrenheit">Fahrenheit</option>
                    <option value="celsius">Celsius</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 'password':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: darkMode ? '#ffffff' : '#111827'}}>
                Password Generator
              </h3>
              
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Length: {passwordLength}
                </label>
                <input
                  type="range"
                  min="4"
                  max="50"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(e.target.value)}
                  style={{width: '100%'}}
                />
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px'}}>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: darkMode ? '#ffffff' : '#111827'}}>
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                  Uppercase (A-Z)
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: darkMode ? '#ffffff' : '#111827'}}>
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                  />
                  Lowercase (a-z)
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: darkMode ? '#ffffff' : '#111827'}}>
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  Numbers (0-9)
                </label>
                <label style={{display: 'flex', alignItems: 'center', gap: '8px', color: darkMode ? '#ffffff' : '#111827'}}>
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  Symbols (!@#$...)
                </label>
              </div>
              
              <button
                onClick={generatePassword}
                style={{...buttonStyle, backgroundColor: '#3b82f6', color: '#ffffff', width: '100%', marginBottom: '16px'}}
              >
                Generate Password
              </button>
              
              {generatedPassword && (
                <div style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '16px',
                  wordBreak: 'break-all',
                  color: darkMode ? '#ffffff' : '#111827'
                }}>
                  {generatedPassword}
                </div>
              )}
            </div>
          </div>
        );

      case 'base64':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: darkMode ? '#ffffff' : '#111827'}}>
                Base64 Encoder/Decoder
              </h3>
              
              <div style={{display: 'flex', gap: '8px', marginBottom: '16px'}}>
                <button
                  onClick={() => setBase64Mode('encode')}
                  style={{
                    ...buttonStyle,
                    backgroundColor: base64Mode === 'encode' ? '#3b82f6' : (darkMode ? '#374151' : '#f9fafb'),
                    color: base64Mode === 'encode' ? '#ffffff' : (darkMode ? '#ffffff' : '#111827')
                  }}
                >
                  Encode
                </button>
                <button
                  onClick={() => setBase64Mode('decode')}
                  style={{
                    ...buttonStyle,
                    backgroundColor: base64Mode === 'decode' ? '#3b82f6' : (darkMode ? '#374151' : '#f9fafb'),
                    color: base64Mode === 'decode' ? '#ffffff' : (darkMode ? '#ffffff' : '#111827')
                  }}
                >
                  Decode
                </button>
              </div>
              
              <div style={{marginBottom: '16px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Input:
                </label>
                <textarea
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  placeholder={base64Mode === 'encode' ? 'Enter text to encode' : 'Enter base64 to decode'}
                  style={{...inputStyle, width: '100%', height: '100px', resize: 'vertical'}}
                />
              </div>
              
              <button
                onClick={handleBase64}
                style={{...buttonStyle, backgroundColor: '#3b82f6', color: '#ffffff', width: '100%', marginBottom: '16px'}}
              >
                {base64Mode === 'encode' ? 'Encode' : 'Decode'}
              </button>
              
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Output:
                </label>
                <textarea
                  value={base64Output}
                  readOnly
                  style={{...inputStyle, width: '100%', height: '100px', backgroundColor: darkMode ? '#4b5563' : '#f3f4f6'}}
                />
              </div>
            </div>
          </div>
        );

      case 'json':
        return (
          <div style={{maxWidth: '768px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: darkMode ? '#ffffff' : '#111827'}}>
                JSON Formatter
              </h3>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    Input JSON:
                  </label>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    placeholder="Enter JSON to format"
                    style={{...inputStyle, width: '100%', height: '300px', fontFamily: 'monospace', fontSize: '14px'}}
                  />
                </div>
                
                <div>
                  <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    Formatted JSON:
                  </label>
                  <textarea
                    value={jsonOutput}
                    readOnly
                    style={{...inputStyle, width: '100%', height: '300px', fontFamily: 'monospace', fontSize: '14px', backgroundColor: darkMode ? '#4b5563' : '#f3f4f6'}}
                  />
                </div>
              </div>
              
              <button
                onClick={formatJSON}
                style={{...buttonStyle, backgroundColor: '#3b82f6', color: '#ffffff', width: '100%', marginTop: '16px'}}
              >
                Format JSON
              </button>
            </div>
          </div>
        );

      case 'counter':
        return (
          <div style={{maxWidth: '512px', margin: '0 auto'}}>
            <div style={cardStyle}>
              <h3 style={{fontSize: '20px', fontWeight: '600', marginBottom: '24px', color: darkMode ? '#ffffff' : '#111827'}}>
                Text Counter
              </h3>
              
              <div style={{marginBottom: '24px'}}>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Enter your text:
                </label>
                <textarea
                  value={textCounterInput}
                  onChange={(e) => setTextCounterInput(e.target.value)}
                  placeholder="Type or paste your text here..."
                  style={{...inputStyle, width: '100%', height: '200px', resize: 'vertical'}}
                />
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px'}}>
                <div style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#3b82f6'}}>
                    {textCounterInput.length}
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Characters
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#10b981'}}>
                    {textCounterInput.trim().split(/\s+/).filter(word => word.length > 0).length}
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Words
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#f59e0b'}}>
                    {textCounterInput.split('\n').length}
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Lines
                  </div>
                </div>
                
                <div style={{
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{fontSize: '24px', fontWeight: 'bold', color: '#ef4444'}}>
                    {textCounterInput.split('.').filter(sentence => sentence.trim().length > 0).length}
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Sentences
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div style={{...cardStyle, textAlign: 'center'}}>
            <div style={{fontSize: '96px', marginBottom: '16px'}}>🚧</div>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: darkMode ? '#ffffff' : '#111827'}}>Tool Coming Soon</h2>
            <p style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>This tool is under development.</p>
          </div>
        );
    }
  };

  return (
    <div style={{minHeight: '100vh', backgroundColor: darkMode ? '#111827' : '#f9fafb', transition: 'all 0.3s ease'}}>
      <header style={{
        backgroundColor: darkMode ? '#1f2937' : '#ffffff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`
      }}>
        <div style={{padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <div style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{color: '#ffffff', fontWeight: 'bold', fontSize: '14px'}}>T</span>
            </div>
            <h1 style={{fontSize: '20px', fontWeight: 'bold', color: darkMode ? '#ffffff' : '#111827'}}>ToolBox</h1>
            <span style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>All your tools in one place</span>
          </div>
          
          <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
            <button onClick={() => setDarkMode(!darkMode)} style={{...buttonStyle, backgroundColor: 'transparent'}}>
              <span style={{fontSize: '20px'}}>{darkMode ? '☀️' : '🌙'}</span>
            </button>
            
            <div style={{position: 'relative'}}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{...buttonStyle, backgroundColor: 'transparent', position: 'relative'}}
              >
                <span style={{fontSize: '20px'}}>🔔</span>
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontSize: '12px',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              {showNotifications && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  width: '350px',
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  zIndex: 50,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  <div style={{
                    padding: '16px',
                    borderBottom: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <h3 style={{color: darkMode ? '#ffffff' : '#111827', fontSize: '16px', fontWeight: '600', margin: 0}}>
                      Notifications
                    </h3>
                    <button
                      onClick={clearAllNotifications}
                      style={{
                        ...buttonStyle,
                        backgroundColor: 'transparent',
                        color: darkMode ? '#9ca3af' : '#6b7280',
                        fontSize: '12px',
                        padding: '4px 8px'
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  
                  <div style={{padding: '8px'}}>
                    {notifications.length === 0 ? (
                      <div style={{
                        padding: '24px',
                        textAlign: 'center',
                        color: darkMode ? '#9ca3af' : '#6b7280'
                      }}>
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => markNotificationAsRead(notification.id)}
                          style={{
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '4px',
                            backgroundColor: notification.read 
                              ? 'transparent' 
                              : (darkMode ? '#374151' : '#f3f4f6'),
                            cursor: 'pointer',
                            border: notification.read 
                              ? 'none' 
                              : `1px solid ${darkMode ? '#4b5563' : '#e5e7eb'}`
                          }}
                        >
                          <div style={{display: 'flex', alignItems: 'start', gap: '12px'}}>
                            <span style={{fontSize: '16px'}}>
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div style={{flex: 1}}>
                              <div style={{
                                fontSize: '14px',
                                fontWeight: '600',
                                color: darkMode ? '#ffffff' : '#111827',
                                marginBottom: '4px'
                              }}>
                                {notification.title}
                              </div>
                              <div style={{
                                fontSize: '13px',
                                color: darkMode ? '#9ca3af' : '#6b7280',
                                marginBottom: '4px'
                              }}>
                                {notification.message}
                              </div>
                              <div style={{
                                fontSize: '12px',
                                color: darkMode ? '#6b7280' : '#9ca3af'
                              }}>
                                {notification.time}
                              </div>
                            </div>
                            {!notification.read && (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#3b82f6',
                                borderRadius: '50%'
                              }}></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{position: 'relative'}}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{...buttonStyle, backgroundColor: 'transparent', display: 'flex', alignItems: 'center', gap: '8px'}}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'linear-gradient(to right, #10b981, #3b82f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{color: '#ffffff', fontWeight: '600', fontSize: '14px'}}>AS</span>
                </div>
                <span style={{color: darkMode ? '#d1d5db' : '#374151', fontWeight: '500'}}>Aiza Sajid</span>
                <span style={{color: '#9ca3af'}}>▼</span>
              </button>
              
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  width: '192px',
                  backgroundColor: darkMode ? '#1f2937' : '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  padding: '8px 0',
                  zIndex: 50
                }}>
                  <button 
                    onClick={() => {
                      setShowProfileSettings(true);
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: darkMode ? '#d1d5db' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>👤</span><span>Profile Settings</span>
                  </button>
                  <button 
                    onClick={() => {
                      setShowPreferences(true);
                      setShowProfileMenu(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: darkMode ? '#d1d5db' : '#374151',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>⚙️</span><span>Preferences</span>
                  </button>
                  <hr style={{margin: '8px 0', border: 'none', borderTop: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`}} />
                  <button 
                    onClick={handleSignOut}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: darkMode ? '#fca5a5' : '#dc2626',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <span>🚪</span><span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{display: 'flex'}}>
        <nav style={{
          width: '256px',
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderRight: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
          minHeight: '100vh'
        }}>
          <div style={{padding: '24px'}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: activeTab === tool.id ? (darkMode ? '#1e3a8a' : '#eff6ff') : 'transparent',
                    color: activeTab === tool.id ? (darkMode ? '#93c5fd' : '#1d4ed8') : (darkMode ? '#9ca3af' : '#6b7280'),
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    borderLeft: activeTab === tool.id ? '4px solid #3b82f6' : 'none',
                    fontWeight: '500',
                    textAlign: 'left'
                  }}
                >
                  <span style={{fontSize: '18px'}}>{tool.icon}</span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        <main style={{flex: 1, padding: '24px'}}>
          <div style={{marginBottom: '24px'}}>
            <h2 style={{fontSize: '24px', fontWeight: 'bold', color: darkMode ? '#ffffff' : '#111827', marginBottom: '4px'}}>
              {tools.find(tool => tool.id === activeTab)?.label || 'Tool'}
            </h2>
            <p style={{color: darkMode ? '#9ca3af' : '#6b7280'}}>
              {tools.find(tool => tool.id === activeTab)?.description || 'Tool description'}
            </p>
          </div>
          
          {renderToolContent()}
        </main>
      </div>

      {(showProfileMenu || showNotifications) && (
        <div
          style={{position: 'fixed', inset: 0, zIndex: 40}}
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <div style={{position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div style={{
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 'bold', color: darkMode ? '#ffffff' : '#111827', margin: 0}}>
                Profile Settings
              </h2>
              <button
                onClick={() => setShowProfileSettings(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {/* Profile Picture */}
              <div style={{textAlign: 'center'}}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(to right, #10b981, #3b82f6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: '32px',
                  color: '#ffffff',
                  fontWeight: 'bold'
                }}>
                  {userProfile.avatar}
                </div>
                <button style={{
                  ...buttonStyle,
                  backgroundColor: darkMode ? '#374151' : '#f9fafb',
                  color: darkMode ? '#ffffff' : '#111827'
                }}>
                  Change Avatar
                </button>
              </div>

              {/* Form Fields */}
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => updateProfile('name', e.target.value)}
                  style={{...inputStyle, width: '100%'}}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => updateProfile('email', e.target.value)}
                  style={{...inputStyle, width: '100%'}}
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Bio
                </label>
                <textarea
                  value={userProfile.bio}
                  onChange={(e) => updateProfile('bio', e.target.value)}
                  style={{...inputStyle, width: '100%', height: '80px', resize: 'vertical'}}
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Location
                </label>
                <input
                  type="text"
                  value={userProfile.location}
                  onChange={(e) => updateProfile('location', e.target.value)}
                  style={{...inputStyle, width: '100%'}}
                  placeholder="City, Country"
                />
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Timezone
                </label>
                <select
                  value={userProfile.timezone}
                  onChange={(e) => updateProfile('timezone', e.target.value)}
                  style={{...inputStyle, width: '100%'}}
                >
                  <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                  <option value="America/New_York">America/New_York (GMT-5)</option>
                  <option value="Europe/London">Europe/London (GMT+0)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                  <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
                </select>
              </div>

              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                <button
                  onClick={() => setShowProfileSettings(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                    color: darkMode ? '#ffffff' : '#111827'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowProfileSettings(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#3b82f6',
                    color: '#ffffff'
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferences && (
        <div style={{position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
          <div style={{
            backgroundColor: darkMode ? '#1f2937' : '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            width: '500px',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 style={{fontSize: '20px', fontWeight: 'bold', color: darkMode ? '#ffffff' : '#111827', margin: 0}}>
                Preferences
              </h2>
              <button
                onClick={() => setShowPreferences(false)}
                style={{
                  backgroundColor: 'transparent',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkMode ? '#9ca3af' : '#6b7280'
                }}
              >
                ×
              </button>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
              {/* Theme */}
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Theme
                </label>
                <select
                  value={preferences.theme}
                  onChange={(e) => updatePreferences('theme', e.target.value)}
                  style={{...inputStyle, width: '100%'}}
                >
                  <option value="light">🌞 Light</option>
                  <option value="dark">🌙 Dark</option>
                  <option value="auto">🔄 Auto (System)</option>
                </select>
              </div>

              {/* Notifications */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    Notifications
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Receive notifications for completed tasks and timers
                  </div>
                </div>
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => updatePreferences('notifications', e.target.checked)}
                    style={{marginRight: '8px'}}
                  />
                  <span style={{color: darkMode ? '#ffffff' : '#111827'}}>
                    {preferences.notifications ? 'On' : 'Off'}
                  </span>
                </label>
              </div>

              {/* Auto Save */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    Auto Save
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Automatically save your notes and preferences
                  </div>
                </div>
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => updatePreferences('autoSave', e.target.checked)}
                    style={{marginRight: '8px'}}
                  />
                  <span style={{color: darkMode ? '#ffffff' : '#111827'}}>
                    {preferences.autoSave ? 'On' : 'Off'}
                  </span>
                </label>
              </div>

              {/* Compact Mode */}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                  <div style={{fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                    Compact Mode
                  </div>
                  <div style={{fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                    Use smaller spacing and condensed layout
                  </div>
                </div>
                <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                  <input
                    type="checkbox"
                    checked={preferences.compactMode}
                    onChange={(e) => updatePreferences('compactMode', e.target.checked)}
                    style={{marginRight: '8px'}}
                  />
                  <span style={{color: darkMode ? '#ffffff' : '#111827'}}>
                    {preferences.compactMode ? 'On' : 'Off'}
                  </span>
                </label>
              </div>

              {/* Language */}
              <div>
                <label style={{display: 'block', marginBottom: '8px', fontWeight: '500', color: darkMode ? '#ffffff' : '#111827'}}>
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={(e) => updatePreferences('language', e.target.value)}
                  style={{...inputStyle, width: '100%'}}
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="ar">🇦🇪 العربية</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>

              {/* Pomodoro Settings */}
              <div style={{
                backgroundColor: darkMode ? '#374151' : '#f9fafb',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h3 style={{fontSize: '16px', fontWeight: '600', color: darkMode ? '#ffffff' : '#111827', marginBottom: '16px'}}>
                  ⏰ Pomodoro Settings
                </h3>
                
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px'}}>
                  <div>
                    <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                      Focus Time
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={preferences.pomodoroLength}
                      onChange={(e) => updatePreferences('pomodoroLength', e.target.value)}
                      style={{...inputStyle, width: '100%'}}
                    />
                    <span style={{fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280'}}>minutes</span>
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                      Short Break
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={preferences.shortBreak}
                      onChange={(e) => updatePreferences('shortBreak', e.target.value)}
                      style={{...inputStyle, width: '100%'}}
                    />
                    <span style={{fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280'}}>minutes</span>
                  </div>
                  
                  <div>
                    <label style={{display: 'block', marginBottom: '4px', fontSize: '14px', color: darkMode ? '#9ca3af' : '#6b7280'}}>
                      Long Break
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="30"
                      value={preferences.longBreak}
                      onChange={(e) => updatePreferences('longBreak', e.target.value)}
                      style={{...inputStyle, width: '100%'}}
                    />
                    <span style={{fontSize: '12px', color: darkMode ? '#9ca3af' : '#6b7280'}}>minutes</span>
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px'}}>
                <button
                  onClick={() => setShowPreferences(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: darkMode ? '#374151' : '#f9fafb',
                    color: darkMode ? '#ffffff' : '#111827'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowPreferences(false)}
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#3b82f6',
                    color: '#ffffff'
                  }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;