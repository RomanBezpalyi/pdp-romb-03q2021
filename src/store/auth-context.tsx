import React, { useState } from 'react'

export const AuthContext = React.createContext({
  isLoggedIn: false,
  login: (token: string) => {},
  logout: () => {},
  token: '',
})

export const AuthContextProvider: React.FC = ({ children }) => {
  const [token, setToken] = useState<string>('')

  const userIsLoggedIn = !!token

  // eslint-disable-next-line no-shadow
  const loginHandler = (token: string) => {
    setToken(token)
  }

  const logoutHandler = () => {
    setToken('')
    try {
      localStorage.removeItem('userData')
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
    }
  }

  const contextValue = {
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    token,
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}
