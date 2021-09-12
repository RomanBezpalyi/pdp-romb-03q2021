import React, { useContext, useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { ProtectedComponent } from './shared/hoc'
import { Navbar, Sidebar } from './shared/components'
import { Home, Labels, Auth, NotFoundPage } from './pages'

import { AuthContext, ListContext } from './store'

import './index.scss'

export const App: React.FC = () => {
  const { isLoggedIn, login } = useContext(AuthContext)
  const { lists } = useContext(ListContext)

  useEffect(() => {
    if (!isLoggedIn) {
      let userData: {
        email: string
        idToken: string
      }
      try {
        userData = JSON.parse(localStorage.getItem('userData') as string)
        if (userData) {
          login(userData.idToken)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Navbar />
      <div className="body-container">
        {isLoggedIn && <Sidebar />}
        <main>
          <Switch>
            <Route exact path="/auth" component={Auth} />
            {lists && lists.length && (
              <Redirect exact from="/" to={`/${lists[0].id}`} />
            )}
            <ProtectedComponent exact path="/labels" component={Labels} />
            <ProtectedComponent path="/:id" component={Home} exact />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </main>
      </div>
    </>
  )
}
