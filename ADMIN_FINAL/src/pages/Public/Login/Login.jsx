import { useState, useRef, useCallback, useEffect } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../util/hooks/useDebounce';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [status, setStatus] = useState('idle');
  const emailRef = useRef();
  const passwordRef = useRef();
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword(prev => !prev);
  }, []);

  const handleOnChange = (event, field) => {
    setIsFieldsDirty(true);
    if (field === 'email') setEmail(event.target.value);
    if (field === 'password') setPassword(event.target.value);
  };

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setStatus('loading');
      const { data } = await axios.post('/admin/login', { email, password });
      localStorage.setItem('accessToken', data.access_token);
      navigate('/main/movies');
      setStatus('idle');
    } catch (error) {
      console.error(error);
      setStatus('idle');
    }
  };

  useEffect(() => {
    if (userInputDebounce.email && userInputDebounce.password) {
      setStatus('idle');
    }
  }, [userInputDebounce]);

  const isValid = email && password;

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Sign In</h3>
        <form>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, 'email')}
              />
              {isFieldsDirty && !email && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type={isShowPassword ? 'text' : 'password'}
                id="password"
                name="password"
                ref={passwordRef}
                onChange={(e) => handleOnChange(e, 'password')}
              />
              {isFieldsDirty && !password && (
                <span className="errors">This field is required</span>
              )}
            </div>

            <div className="show-password" onClick={handleShowPassword}>
              {isShowPassword ? 'Hide' : 'Show'} Password
            </div>

            <div className="submit-container">
              <button
                className="btn-primary"
                type="button"
                disabled={status === 'loading' || !isValid}
                onClick={handleLogin}
              >
                {status === 'idle' ? 'Login' : 'Wait...'}
              </button>
            </div>

            <div className="register-container">
              <small>Don't have an account? </small>
              <a href="/register">
                <small>Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
