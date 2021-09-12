import React, { useState, useContext } from 'react'
import { useMutation } from 'react-query'
import { toast } from 'react-toastify'

import { AuthContext } from '../../../store'
import * as api from '../../../shared/api'

import { AuthRedirect } from '../../../shared/hoc'

import styles from './AuthForm.module.scss'

const AuthForm: React.FC = () => {
  const authCtx = useContext(AuthContext)
  const [form, setFormFieldValue] = useState<{
    email: string
    password: string
  }>({ email: '', password: '' })
  const [isLogin, setIsLogin] = useState(true)

  const switchAuthModeHandler = () => {
    setIsLogin(prevState => !prevState)
  }

  const { mutate, isLoading } = useMutation(
    isLogin ? api.authLogin : api.authSignup,
    {
      onSuccess: ({ email, idToken }) => {
        authCtx.login(idToken)
        const user = { email, idToken }
        try {
          localStorage.setItem('userData', JSON.stringify(user))
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e)
        }
      },
      onError: () => {
        toast.error('Oops, something went wrong...')
      },
    }
  )

  const onFieldChange = (event: React.SyntheticEvent<any>) => {
    const { name, value } = event.currentTarget
    setFormFieldValue(state => ({ ...state, [name]: value }))
  }

  const onSubmit = (event: React.SyntheticEvent<any>) => {
    event.preventDefault()
    const { email, password } = form
    mutate({ email, password })
  }

  return (
    <section className={styles.authSection}>
      <h1 className={styles.authTitle}>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label className="form-label auth-label" htmlFor="email">
            Your Email
            <input
              className="form-control"
              type="email"
              id="email"
              name="email"
              value={form.email}
              required
              onChange={onFieldChange}
            />
          </label>
        </div>
        <div>
          <label className="form-label auth-label" htmlFor="password">
            Your Password
            <input
              className="form-control"
              name="password"
              type="password"
              id="password"
              value={form.password}
              onChange={onFieldChange}
              required
              minLength={6}
            />
          </label>
        </div>
        <div className={styles.btnWrapper}>
          {!isLoading && (
            <button className="btn btn-light" type="submit">
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            className="btn btn-light"
            type="button"
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default AuthRedirect(AuthForm)
