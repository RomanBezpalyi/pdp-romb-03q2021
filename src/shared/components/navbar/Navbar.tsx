import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { AuthContext, ListContext, FilterContext } from '../../../store'

import styles from './Navbar.module.scss'

export const Navbar: React.FC = () => {
  const { isLoggedIn, logout } = useContext(AuthContext)
  const { lists } = useContext(ListContext)
  const { setQuery, query } = useContext(FilterContext)

  const link = lists && lists.length ? lists[0].id : ''

  const handleLogout = () => {
    logout()
  }
  return (
    <nav>
      <div className="nav-wrapper bg-dark darken-1 px1">
        <NavLink to={`/${link}`} className={styles.logo}>
          TaskManager
        </NavLink>
        {isLoggedIn && (
          <ul className="right hide-on-med-and-down">
            <li>
              <input
                className="form-control search-input"
                type="text"
                placeholder="Search by task"
                name="title"
                value={query}
                autoComplete="off"
                onChange={(e: React.SyntheticEvent<any>) =>
                  setQuery(e.currentTarget.value)
                }
              />
            </li>
            <li>
              <NavLink
                onClick={handleLogout}
                className={styles.logout}
                to="/auth"
              >
                Logout
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  )
}
