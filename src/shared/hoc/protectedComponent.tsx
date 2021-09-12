/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../../store'

export const ProtectedComponent: React.FC<any> = ({
  component: Component,
  ...rest
}) => {
  const { isLoggedIn } = useContext(AuthContext)
  return (
    <Route
      {...rest}
      render={(props: any) =>
        isLoggedIn ? <Component {...props} /> : <Redirect to="/auth" />
      }
    />
  )
}
