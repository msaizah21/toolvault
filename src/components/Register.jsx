import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import OtpInput from 'react-otp-input';
import api from '../utils/api';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);
  const [touched, setTouched] = useState({});
  
  const cooldownTimerRef = useRef(null);
  const formRef = useRef(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearInterval(cooldownTimerRef.current);
      }
    };
  }, []);

  // Enhanced email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  // Password strength calculation
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (!password) return strength;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Character type checks
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    return Math.min(strength, 100);
  };

  // Enhanced validation with better error messages
  const validateField = (name, value, allValues = form) => {
    const errors = {};
    
    if (name === 'name') {
      if (!value.trim()) {
        errors.name = 'Full name is required';
      } else if (value.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
      } else if (value.trim().length > 50) {
        errors.name = 'Name cannot exceed 50 characters';
      } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
        errors.name = 'Name can only contain letters, spaces, hyphens, and apostrophes';
      }
    }
    
    if (name === 'email') {
      if (!value.trim()) {
        errors.email = 'Email address is required';
      } else if (!validateEmail(value.trim())) {
        errors.email = 'Please enter a valid email address';
      } else if (value.length > 254) {
        errors.email = 'Email address is too long';
      }
    }
    
    if (name === 'password') {
      if (!value) {
        errors.password = 'Password is required';
      } else if (value.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      } else if (value.length > 128) {
        errors.password = 'Password cannot exceed 128 characters';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
    }

    if (name === 'confirmPassword') {
      if (!value) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (value !== allValues.password) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Calculate password strength for password field
    if (name === 'password') {
      const strength = calculatePasswordStrength(value);
      setPasswordStrength(strength);
      setShowPasswordStrength(value.length > 0);
    }
    
    // Only validate if field has been touched
    if (touched[name]) {
      const fieldErrors = validateField(name, value, { ...form, [name]: value });
      setValidationErrors(prev => ({
        ...prev,
        ...fieldErrors,
        [name]: fieldErrors[name] || null
      }));
      
      // Clear validation errors for other fields if they become valid
      Object.keys(fieldErrors).forEach(key => {
        if (!fieldErrors[key]) {
          setValidationErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
          });
        }
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setFocusedField(null);
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur
    const fieldErrors = validateField(name, form[name]);
    setValidationErrors(prev => ({
      ...prev,
      ...fieldErrors,
      [name]: fieldErrors[name] || null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true
    });

    // Validate all fields
    const nameErrors = validateField('name', form.name);
    const emailErrors = validateField('email', form.email);
    const passwordErrors = validateField('password', form.password);
    const confirmPasswordErrors = validateField('confirmPassword', form.confirmPassword);
    const allErrors = { ...nameErrors, ...emailErrors, ...passwordErrors, ...confirmPasswordErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setValidationErrors(allErrors);
      // Focus on first error field
      const firstErrorField = Object.keys(allErrors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.focus();
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/register', {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      toast.success("Verification code sent to your email");
      setStep(2);
      startResendCooldown();
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a complete 6-digit verification code");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Verification code must contain only numbers");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/verify-otp', {
        email: form.email.trim().toLowerCase(),
        otp,
      });
      toast.success("Account verified successfully! Welcome to ToolVault");
      
      // Store user data if returned
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      if (res.data?.user) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
      }
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Invalid verification code. Please try again.";
      toast.error(errorMessage);
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    try {
      await api.post('/resend-otp', {
        email: form.email.trim().toLowerCase(),
      });
      toast.success("New verification code sent");
      startResendCooldown();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleBackToRegister = () => {
    setStep(1);
    setOtp('');
    if (cooldownTimerRef.current) {
      clearInterval(cooldownTimerRef.current);
    }
    setResendCooldown(0);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return '#ef4444';
    if (passwordStrength < 60) return '#f59e0b';
    if (passwordStrength < 80) return '#3b82f6';
    return '#10b981';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  // Styles (enhanced)
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    formCard: {
      backgroundColor: '#ffffff',
      padding: '48px',
      borderRadius: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
      width: '100%',
      maxWidth: '420px',
      position: 'relative',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
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
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      borderRadius: '16px',
      marginBottom: '24px',
      color: 'white',
      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)'
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
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s ease',
      backgroundColor: '#ffffff',
      color: '#1a1a1a',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    inputFocused: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      transform: 'translateY(-1px)'
    },
    inputError: {
      borderColor: '#ef4444',
      boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)'
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#9ca3af',
      width: '20px',
      height: '20px',
      zIndex: 1
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
      padding: '8px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s',
      zIndex: 2
    },
    passwordStrengthContainer: {
      marginTop: '8px'
    },
    passwordStrengthBar: {
      height: '4px',
      backgroundColor: '#e5e7eb',
      borderRadius: '2px',
      overflow: 'hidden',
      marginBottom: '4px'
    },
    passwordStrengthFill: {
      height: '100%',
      transition: 'all 0.3s ease',
      borderRadius: '2px'
    },
    passwordStrengthText: {
      fontSize: '12px',
      fontWeight: '500',
      textAlign: 'right'
    },
    errorText: {
      color: '#ef4444',
      fontSize: '13px',
      marginTop: '6px',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    submitButton: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      fontWeight: '600',
      fontSize: '16px',
      color: 'white',
      background: loading ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
      border: 'none',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      fontFamily: 'inherit',
      marginTop: '8px',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
    },
    loaderWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    loginSection: {
      marginTop: '24px',
      textAlign: 'center'
    },
    loginText: {
      fontSize: '14px',
      color: '#6b7280'
    },
    loginLink: {
      color: '#667eea',
      textDecoration: 'none',
      fontWeight: '500',
      marginLeft: '4px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '14px',
      transition: 'color 0.2s'
    },
    footer: {
      marginTop: '32px',
      textAlign: 'center'
    },
    footerText: {
      fontSize: '13px',
      color: '#9ca3af'
    },
    otpContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: '24px'
    },
    otpInput: {
      width: '45px',
      height: '50px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '600',
      textAlign: 'center',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    otpInputFocused: {
      borderColor: '#667eea',
      boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
      transform: 'scale(1.05)'
    },
    otpText: {
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '14px',
      marginBottom: '24px',
      lineHeight: '1.5'
    },
    resendSection: {
      textAlign: 'center',
      marginTop: '16px'
    },
    resendButton: {
      color: resendCooldown > 0 ? '#9ca3af' : '#667eea',
      background: 'none',
      border: 'none',
      cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: resendCooldown > 0 ? 'none' : 'underline'
    }
  };

  // Icons (same as before, keeping them concise)
  const UserIcon = () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

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

  const LoaderIcon = () => (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const UserPlusIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 8v6M23 11h-6" />
    </svg>
  );

  const ShieldCheckIcon = () => (
    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
          @media (max-width: 480px) {
            .form-card {
              padding: 32px 24px !important;
              margin: 10px !important;
            }
          }
        `}
      </style>
      <div style={styles.formCard} className="form-card">
        <div style={styles.header}>
          <div style={styles.iconWrapper}>
            {step === 1 ? <UserPlusIcon /> : <ShieldCheckIcon />}
          </div>
          <h1 style={styles.title}>
            {step === 1 ? 'Create Account' : 'Verify Your Email'}
          </h1>
          <p style={styles.subtitle}>
            {step === 1 ? 'Join ToolVault to access your development tools' : 'Enter the verification code sent to your email'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleSubmit} ref={formRef} noValidate>
            <div style={styles.formField}>
              <label htmlFor="name" style={styles.label}>
                Full Name *
              </label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>
                  <UserIcon />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={handleBlur}
                  required
                  autoComplete="name"
                  style={{
                    ...styles.input,
                    ...(focusedField === 'name' ? styles.inputFocused : {}),
                    ...(validationErrors.name ? styles.inputError : {})
                  }}
                  placeholder="Enter your full name"
                  aria-describedby={validationErrors.name ? 'name-error' : undefined}
                  aria-invalid={!!validationErrors.name}
                />
              </div>
              {validationErrors.name && (
                <p id="name-error" style={styles.errorText} role="alert">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div style={styles.formField}>
              <label htmlFor="email" style={styles.label}>
                Email Address *
              </label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>
                  <MailIcon />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={handleBlur}
                  required
                  autoComplete="email"
                  style={{
                    ...styles.input,
                    ...(focusedField === 'email' ? styles.inputFocused : {}),
                    ...(validationErrors.email ? styles.inputError : {})
                  }}
                  placeholder="Enter your email address"
                  aria-describedby={validationErrors.email ? 'email-error' : undefined}
                  aria-invalid={!!validationErrors.email}
                />
              </div>
              {validationErrors.email && (
                <p id="email-error" style={styles.errorText} role="alert">
                  {validationErrors.email}
                </p>
              )}
            </div>

            <div style={styles.formField}>
              <label htmlFor="password" style={styles.label}>
                Password *
              </label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={handleBlur}
                  required
                  autoComplete="new-password"
                  style={{
                    ...styles.input,
                    paddingRight: '52px',
                    ...(focusedField === 'password' ? styles.inputFocused : {}),
                    ...(validationErrors.password ? styles.inputError : {})
                  }}
                  placeholder="Create a strong password"
                  aria-describedby={validationErrors.password ? 'password-error' : 'password-help'}
                  aria-invalid={!!validationErrors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {showPasswordStrength && (
                <div style={styles.passwordStrengthContainer}>
                  <div style={styles.passwordStrengthBar}>
                    <div 
                      style={{
                        ...styles.passwordStrengthFill,
                        width: `${passwordStrength}%`,
                        backgroundColor: getPasswordStrengthColor()
                      }}
                    />
                  </div>
                  <div style={{
                    ...styles.passwordStrengthText,
                    color: getPasswordStrengthColor()
                  }}>
                    {getPasswordStrengthText()}
                  </div>
                </div>
              )}
              {validationErrors.password && (
                <p id="password-error" style={styles.errorText} role="alert">
                  {validationErrors.password}
                </p>
              )}
              {!validationErrors.password && (
                <p id="password-help" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  Must contain at least 8 characters with uppercase, lowercase, and numbers
                </p>
              )}
            </div>

            <div style={styles.formField}>
              <label htmlFor="confirmPassword" style={styles.label}>
                Confirm Password *
              </label>
              <div style={styles.inputWrapper}>
                <div style={styles.inputIcon}>
                  <LockIcon />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={handleBlur}
                  required
                  autoComplete="new-password"
                  style={{
                    ...styles.input,
                    paddingRight: '52px',
                    ...(focusedField === 'confirmPassword' ? styles.inputFocused : {}),
                    ...(validationErrors.confirmPassword ? styles.inputError : {})
                  }}
                  placeholder="Confirm your password"
                  aria-describedby={validationErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                  aria-invalid={!!validationErrors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.passwordToggle}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  tabIndex={-1}
                  aria-label={showConfirmPassword ? 'Hide password confirmation' : 'Show password confirmation'}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {validationErrors.confirmPassword && (
                <p id="confirmPassword-error" style={styles.errorText} role="alert">
                  {validationErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.submitButton}
              onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, styles.submitButtonHover)}
              onMouseLeave={(e) => !loading && Object.assign(e.currentTarget.style, { 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                transform: 'translateY(0)', 
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' 
              })}
              aria-describedby="submit-help"
            >
              {loading ? (
                <span style={styles.loaderWrapper}>
                  <LoaderIcon />
                  <span>Creating Account...</span>
                </span>
              ) : (
                'Create Account'
              )}
            </button>
            <p id="submit-help" style={{ fontSize: '12px', color: '#6b7280', textAlign: 'center', marginTop: '8px' }}>
              By creating an account, you agree to our Terms of Service
            </p>

            <div style={styles.loginSection}>
              <span style={styles.loginText}>
                Already have an account?
                <button
                  type="button"
                  style={styles.loginLink}
                  onClick={handleLoginClick}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
                >
                  Sign in
                </button>
              </span>
            </div>
          </form>
        )}

        {step === 2 && (
          <>
            <button
              onClick={handleBackToRegister}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: 'none',
                color: '#667eea',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '24px',
                padding: '8px 0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
            >
              <ArrowLeftIcon />
              Back to registration
            </button>

            <p style={styles.otpText}>
              We've sent a 6-digit verification code to<br />
              <strong>{form.email}</strong>
            </p>
            
            <div style={styles.otpContainer}>
              <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                isInputNum={true}
                shouldAutoFocus={true}
                renderInput={(props, index) => (
                  <input
                    {...props}
                    style={{
                      ...styles.otpInput,
                      ...(props.value ? styles.otpInputFocused : {})
                    }}
                    aria-label={`Digit ${index + 1} of verification code`}
                  />
                )}
                renderSeparator={<span style={{ width: '8px' }}></span>}
              />
            </div>
            
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length !== 6}
              style={{
                ...styles.submitButton,
                background: (loading || otp.length !== 6) ? '#9ca3af' : 'linear-gradient(135deg, #667eea, #764ba2)',
                cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => (!loading && otp.length === 6) && Object.assign(e.currentTarget.style, styles.submitButtonHover)}
              onMouseLeave={(e) => (!loading && otp.length === 6) && Object.assign(e.currentTarget.style, { 
                background: 'linear-gradient(135deg, #667eea, #764ba2)', 
                transform: 'translateY(0)', 
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)' 
              })}
            >
              {loading ? (
                <span style={styles.loaderWrapper}>
                  <LoaderIcon />
                  <span>Verifying...</span>
                </span>
              ) : (
                'Verify Account'
              )}
            </button>

            <div style={styles.resendSection}>
              <span style={{ fontSize: '14px', color: '#6b7280' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  style={styles.resendButton}
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || loading}
                  onMouseEnter={(e) => resendCooldown === 0 && (e.currentTarget.style.color = '#4f46e5')}
                  onMouseLeave={(e) => resendCooldown === 0 && (e.currentTarget.style.color = '#667eea')}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </span>
            </div>

            <div style={styles.loginSection}>
              <span style={styles.loginText}>
                Need to use a different email?
                <button
                  type="button"
                  style={styles.loginLink}
                  onClick={handleBackToRegister}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#4f46e5'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#667eea'}
                >
                  Change email
                </button>
              </span>
            </div>
          </>
        )}

        <div style={styles.footer}>
          <p style={styles.footerText}>
            {step === 1 
              ? 'Secure access to your development tools and utilities'
              : 'Code expires in 10 minutes. Check your spam folder if not received.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;