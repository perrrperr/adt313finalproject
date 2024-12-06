import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './Main.css';

function Main() {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      setTimeout(() => {
        localStorage.removeItem('accessToken');
        navigate('/login');
      }, 3000); // 3-second delay before navigating
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate('/login'); // Redirect to login if no access token
    }
  }, [accessToken, navigate]);

  const disabledLinkStyle = {
    pointerEvents: 'none',
    color: 'gray',
    cursor: 'not-allowed',
    textDecoration: 'none', // Cleaner look without underline
    opacity: 0.6, // Dimmed appearance
  };

  return (
    <div className='Main'>
      <div className='container'>
        <div className='navigation'>
          <ul>
            <li>
              {/* Disable navigation for Movies */}
              <a
                style={disabledLinkStyle}
                onClick={(e) => e.preventDefault()}
              >
                Movies
              </a>
            </li>
            <li>
              <a onClick={() => navigate('/home')}>Home</a>
            </li>
            {accessToken ? (
              <li className='logout'>
                <a onClick={handleLogout}>Logout</a>
              </li>
            ) : (
              <li className='login'>
                <a onClick={() => navigate('/login')}>Login</a>
              </li>
            )}
          </ul>
        </div>
        <div className='outlet'>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Main;
