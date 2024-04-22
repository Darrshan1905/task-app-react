import { useCallback, useState, useEffect } from "react";

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  const login = useCallback((uid, token, name, admin, expirationDate) => {
    setToken(token);
    setUserId(uid);
    setName(name);
    console.log(admin);
    setIsAdmin(admin);
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData',JSON.stringify({
      userId: uid,
      name: name,
      token: token,
      isAdmin: isAdmin,
      expiration: tokenExpirationDate.toISOString()
    }));
  },[])

  const logout = useCallback((uid) => {
    setToken(null);
    setUserId(null);
    setName(null);
    setIsAdmin(null);
    setTokenExpirationDate(null);
    localStorage.removeItem('userData');
  },[])

  useEffect(() => {
    if(token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer);
    }
  },[token, logout, tokenExpirationDate])

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if(storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, storedData.name, storedData.isAdmin, new Date(storedData.expiration));
    }
  }, [login])

  return {token, login, logout, userId, name, isAdmin};
} 

export default useAuth;