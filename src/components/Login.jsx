import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });



  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const emailInputRef = useRef(null);
  
  // Real hooks from your app
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  

  // Focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Real-time validation
  const validateField = (name, value) => {
    const errors = {};
    
    if (name === 'email') {
      if (!value) {
        errors.email = 'Email is required';
      } else if (!validateEmail(value)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (error) setError('');
    
    const fieldErrors = validateField(name, value);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors,
      [name]: fieldErrors[name] || null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailErrors = validateField('email', formData.email);
    const passwordErrors = validateField('password', formData.password);
    const allErrors = { ...emailErrors, ...passwordErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      const result = await login(formData);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    formCard: {
      backgroundColor: '#ffffff',
      padding: '48px',
      borderRadius: '20px',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '420px',
      position: 'relative'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    iconWrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '64px',
      height: '64px',
      background: '#5B6FED',
      borderRadius: '12px',
      marginBottom: '24px',
      color: 'white'
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '8px',
      margin: '0 0 8px 0'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px',
      fontWeight: '400',
      margin: '0'
    },
    errorAlert: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    demoInfo: {
      backgroundColor: '#E8F0FE',
      border: '1px solid #C5D9F9',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      fontSize: '14px',
      color: '#1a73e8'
    },
    formField: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    inputWrapper: {
      position: 'relative'
    },
    input: {
      width: '100%',
      padding: '12px 16px 12px 44px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.2s',
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    inputFocused: {
      borderColor: '#5B6FED',
      boxShadow: '0 0 0 3px rgba(91, 111, 237, 0.1)'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '20px',
      height: '20px'
    },
    passwordToggle: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    checkIcon: {
      position: 'absolute',
      right: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#10b981'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '13px',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    rememberForgot: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      marginTop: '8px'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    checkbox: {
      width: '18px',
      height: '18px',
      cursor: 'pointer',
      accentColor: '#5B6FED'
    },
    checkboxLabel: {
      fontSize: '14px',
      color: '#4b5563',
      cursor: 'pointer',
      userSelect: 'none'
    },
    forgotLink: {
      fontSize: '14px',
      color: '#5B6FED',
      textDecoration: 'none',
      fontWeight: '500',
      background: 'none',
      border: 'none',
      cursor: 'pointer'
    },
    submitButton: {
      width: '100%',
      padding: '14px 16px',
      borderRadius: '8px',
      fontWeight: '600',
      fontSize: '16px',
      color: 'white',
      background: loading ? '#9ca3af' : '#5B6FED',
      border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    submitButtonHover: {
      background: '#4C5FDB',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(91, 111, 237, 0.25)'
    },
    loaderWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    registerSection: {
      marginTop: '24px',
      textAlign: 'center'
    },
    registerText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    registerLink: {
      color: '#5B6FED',
      textDecoration: 'none',
      fontWeight: '500',
      marginLeft: '4px',
      cursor: 'pointer'
    },
    footer: {
      marginTop: '32px',
      textAlign: 'center'
    },
    footerText: {fontSize: '12px',
       color: '#9ca3af',
       marginTop: '16px'
}

  };

  // Icons
  const MailIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LockIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const EyeIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  const AlertIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const LoaderIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          input::placeholder {
            color: #9ca3af;
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px white inset;
            box-shadow: 0 0 0px 1000px white inset;
            -webkit-text-fill-color: #1a1a1a;
          }
          a:hover {
            text-decoration: underline;
          }
        `}
      </style>
      <div style={styles.formCard}>
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            <LockIcon />
          </div>
          <h1 style={styles.title}>Welcome to ToolVault</h1>
          <p style={styles.subtitle}>Sign in to access your tools</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={styles.errorAlert}>
              <AlertIcon />
              <span>{error}</span>
            </div>
          )}

          <div style={styles.demoInfo}>
            <div style={{ fontWeight: '600', marginBottom: '4px' }}>Toolvault Credentials:</div>
            <div style={{ fontSize: '13px' }}>Email: admin@toolvault.com</div>
            <div style={{ fontSize: '13px' }}>Password: password123</div>
          </div>

          <div style={styles.formField}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <MailIcon />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailInputRef}
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  ...styles.input,
                  ...(focusedField === 'email' ? styles.inputFocused : {}),
                  ...(validationErrors.email ? styles.inputError : {})
                }}
                placeholder="you@example.com"
              />
              {formData.email && !validationErrors.email && (
                <div style={styles.checkIcon}>
                  <CheckIcon />
                </div>
              )}
            </div>
            {validationErrors.email && (
              <p style={styles.errorText}>
                {validationErrors.email}
              </p>
            )}
          </div>

          <div style={styles.formField}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <div style={styles.inputIcon}>
                <LockIcon />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                required
                style={{
                  ...styles.input,
                  ...(focusedField === 'password' ? styles.inputFocused : {}),
                  ...(validationErrors.password ? styles.inputError : {})
                }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={styles.passwordToggle}
                onMouseEnter={(e) => e.currentTarget.style.color = '#4b5563'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                tabIndex={-1}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {validationErrors.password && (
              <p style={styles.errorText}>
                {validationErrors.password}
              </p>
            )}
          </div>

          <div style={styles.rememberForgot}>
            <div style={styles.checkboxContainer}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="remember" style={styles.checkboxLabel}>
                Remember me
              </label>
            </div>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={styles.forgotLink}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.submitButton}
            onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.submitButtonHover)}
            onMouseLeave={(e) => !loading && Object.assign(e.currentTarget.style, { 
              background: '#5B6FED', 
              transform: 'translateY(0)', 
              boxShadow: 'none' 
            })}
          >
            {loading ? (
              <span style={styles.loaderWrapper}>
                <LoaderIcon />
                <span>Signing in...</span>
              </span>
            ) : (
              'Sign In to ToolVault'
            )}
          </button>
        </form>

        <div style={styles.registerSection}>
          <span style={styles.registerText}>
            Don't have an account?
            <a
              href="src\components\Register.jsx"
              style={styles.registerLink}
              onClick={(e) => {
                e.preventDefault();
                handleRegisterClick();
              }}
            >
              Sign up
            </a>
          </span>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Secure access to your development tools and utilities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;