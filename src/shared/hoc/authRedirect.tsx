import React, { useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthContext } from '../../store'

export const AuthRedirect = (BaseComponent: React.FC) => {
  const WithAuthRedirect: React.FC = () => {
    const { isLoggedIn } = useContext(AuthContext)
    const history = useHistory()
    useEffect(() => {
      if (isLoggedIn) history.replace('/')
    }, [isLoggedIn, history])

    return <BaseComponent />
  }

  return WithAuthRedirect
}
