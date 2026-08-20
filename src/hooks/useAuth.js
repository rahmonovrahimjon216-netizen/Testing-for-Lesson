import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    const defaultUser = {
      name: "Rahimjon Qodirov",
      phone: "+998901234567",
      businessName: "Savdo Plus MCHJ",
      address: "Toshkent sh., Chilonzor tumani",
      jwtToken: authService.getJWTToken()
    };
    return storageService.get(storageService.KEYS.USER, defaultUser);
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('qarzdaftar_is_logged_in') === 'true';
  });

  const [jwtToken, setJwtToken] = useState(() => {
    return localStorage.getItem('qarzdaftar_jwt_token') || user?.jwtToken || authService.getJWTToken();
  });

  const login = async (phone, password) => {
    const res = await authService.signIn(phone, password);
    if (res.success) {
      setUser(res.user);
      setJwtToken(res.token);
      setIsAuthenticated(true);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.signUp(userData);
    if (res.success) {
      setUser(res.user);
      setJwtToken(res.token);
      setIsAuthenticated(true);
    }
    return res;
  };

  const logout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setJwtToken(null);
  };

  const updateUserProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    storageService.set(storageService.KEYS.USER, newUserData);
    setUser(newUserData);
  };

  return {
    user,
    isAuthenticated,
    jwtToken,
    login,
    register,
    logout,
    updateUserProfile
  };
};
