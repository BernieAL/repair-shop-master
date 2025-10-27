import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';

// Components
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyDevices from './pages/MyDevices';
import MyRepairs from './pages/MyRepairs';
import NewRequest from './pages/NewRequest';
import Profile from './pages/Profile';
import Account from './pages/Account';
import Referrals from './pages/Referrals';
import TopBar from './components/TopBar';
import FAQ from './pages/FAQ';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
      light: '#7c8ef0',
      dark: '#5568d3',
    },
    secondary: {
      main: '#764ba2',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/*"
              element={

                <ProtectedRoute>
                  <TopBar />
                  <Box sx={{ pb: { xs: 9, md: 0 } }}>
                    <Routes>
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/my-devices" element={<MyDevices />} />
                      <Route path="/my-repairs" element={<MyRepairs />} />
                      <Route path="/new-request" element={<NewRequest />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/account" element={<Account />} />  {/* NEW */}
                      <Route path="/referrals" element={<Referrals />} />  {/* NEW */}
                      <Route path="/faq" element={<FAQ />} />
                    </Routes>
                  </Box>
                  <BottomNav />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;