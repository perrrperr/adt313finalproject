import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    middleName: '',
    contactNo: '',
    role: 'user', // Default role
  });
  
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle');
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setIsFieldsDirty(true);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the specific error if the user modifies the field
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (!formData.firstName) errors.firstName = 'First name is required';
    if (!formData.lastName) errors.lastName = 'Last name is required';
    if (!formData.contactNo) errors.contactNo = 'Contact number is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setStatus('loading');
    try {
      await axios.post('/user/register', formData, {
        headers: { 'Content-Type': 'application/json' },
      });

      setStatus('success');
      alert('User registered successfully');

      setTimeout(async () => {
        try {
          const res = await axios.post('/user/login', {
            email: formData.email,
            password: formData.password,
          });
          localStorage.setItem('accessToken', res.data.access_token);
          navigate('/home');
        } catch (e) {
          console.error(e);
          alert('Login failed');
        } finally {
          setStatus('idle');
        }
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      alert('Failed to register');
    }
  };

  return (
    <div className='Register'>
      <div className='main-container'>
        <h3>Sign Up</h3>
        <form>
          <div className='form-container'>
            {['email', 'password', 'firstName', 'lastName', 'middleName', 'contactNo'].map((field) => (
              <div key={field} className='form-group'>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                <input
                  type={field === 'password' ? 'password' : 'text'}
                  name={field}
                  value={formData[field]}
                  onChange={handleOnChange}
                  required
                />
                {formErrors[field] && <span className='error'>{formErrors[field]}</span>}
              </div>
            ))}
            <div className='submit-container'>
              <button
                className='btn-register'
                type='button'
                onClick={handleRegister}
                disabled={status === 'loading'}
              >
                {status === 'idle' ? 'Register' : 'Loading...'}
              </button>
            </div>
            <div className='reg-container'>
              <small>Already have an account? </small>
              <a href='/login'>
                <small>Log In</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
