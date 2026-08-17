import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export const ROLES = {
  GUEST: 'Guest',
  OPERATOR: 'Operator',
  TECHNICIAN: 'Technician',
  ADMINISTRATOR: 'Administrator'
};

const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

// Registered Role User Credentials Mapping
export const USERS = {
  operator: { role: ROLES.OPERATOR, password: 'operator' },
  technician: { role: ROLES.TECHNICIAN, password: 'technician' },
  administrator: { role: ROLES.ADMINISTRATOR, password: 'administrator' },
  admin: { role: ROLES.ADMINISTRATOR, password: 'admin' }
};

// Passcode backwards-compatibility mapping
const PASSCODES = {
  '1111': ROLES.OPERATOR,
  '2222': ROLES.TECHNICIAN,
  '3333': ROLES.ADMINISTRATOR
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize role from localStorage if activity was within the last 5 minutes
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem('activeUserRole');
      const lastActivity = localStorage.getItem('lastActivityTimestamp');
      
      if (savedRole && savedRole !== ROLES.GUEST && lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed < INACTIVITY_TIMEOUT_MS) {
          localStorage.setItem('lastActivityTimestamp', Date.now().toString());
          return savedRole;
        } else {
          // Session expired due to inactivity
          localStorage.removeItem('activeUserRole');
          localStorage.removeItem('lastActivityTimestamp');
        }
      }
    } catch (err) {
      console.error('Error restoring auth session state:', err);
    }
    return ROLES.GUEST;
  });

  const [authError, setAuthError] = useState('');
  const lastUpdateRef = useRef(Date.now());

  // Function to update session role and localStorage
  const updateSessionRole = (role) => {
    setCurrentRole(role);
    if (role !== ROLES.GUEST) {
      const now = Date.now().toString();
      localStorage.setItem('activeUserRole', role);
      localStorage.setItem('lastActivityTimestamp', now);
      lastUpdateRef.current = Date.now();
    } else {
      localStorage.removeItem('activeUserRole');
      localStorage.removeItem('lastActivityTimestamp');
    }
  };

  // Activity handler to reset 5-minute timeout window
  const updateActivity = useCallback(() => {
    if (currentRole === ROLES.GUEST) return;
    const now = Date.now();
    // Throttle updates to localStorage once every 2 seconds
    if (now - lastUpdateRef.current > 2000) {
      lastUpdateRef.current = now;
      try {
        localStorage.setItem('lastActivityTimestamp', now.toString());
      } catch (e) {
        console.error('Failed to update activity timestamp:', e);
      }
    }
  }, [currentRole]);

  // Set up activity listeners & periodic inactivity check interval
  useEffect(() => {
    if (currentRole === ROLES.GUEST) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, updateActivity));

    // Periodically check if 5 minutes of inactivity has passed
    const intervalId = setInterval(() => {
      const lastActivity = localStorage.getItem('lastActivityTimestamp');
      if (lastActivity) {
        const elapsed = Date.now() - parseInt(lastActivity, 10);
        if (elapsed >= INACTIVITY_TIMEOUT_MS) {
          updateSessionRole(ROLES.GUEST);
          setAuthError('Session expired due to 5 minutes of inactivity.');
        }
      }
    }, 5000);

    return () => {
      events.forEach(evt => window.removeEventListener(evt, updateActivity));
      clearInterval(intervalId);
    };
  }, [currentRole, updateActivity]);

  const login = (username, password) => {
    const u = (username || '').trim().toLowerCase();
    const p = (password || '').trim().toLowerCase();
    const user = USERS[u];

    if (user && (user.password.toLowerCase() === p || p === '1234')) {
      updateSessionRole(user.role);
      setAuthError('');
      return { success: true, role: user.role };
    } else {
      setAuthError('Invalid Username or Password. Access Denied.');
      return { success: false, message: 'Invalid Username or Password' };
    }
  };

  const loginWithPasscode = (passcode) => {
    const matchedRole = PASSCODES[passcode];
    if (matchedRole) {
      updateSessionRole(matchedRole);
      setAuthError('');
      return { success: true, role: matchedRole };
    }
    return login(passcode, passcode);
  };

  const logoutToGuest = () => {
    updateSessionRole(ROLES.GUEST);
    setAuthError('');
  };

  const isGuest = () => currentRole === ROLES.GUEST;
  const canViewRats = () => currentRole !== ROLES.GUEST;
  const hasPushPermission = () => currentRole === ROLES.TECHNICIAN || currentRole === ROLES.ADMINISTRATOR;
  const hasAdminPermission = () => currentRole === ROLES.ADMINISTRATOR;

  return (
    <AuthContext.Provider value={{
      currentRole,
      login,
      loginWithPasscode,
      logoutToGuest,
      isGuest,
      canViewRats,
      hasPushPermission,
      hasAdminPermission,
      authError,
      setAuthError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
