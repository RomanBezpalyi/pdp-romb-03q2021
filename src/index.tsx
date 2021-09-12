import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'

import {
  AuthContextProvider,
  ListContextProvider,
  LabelContextProvider,
  TaskContextProvider,
  FilterContextProvider,
} from './store'

import { App } from './App'

import './index.scss'

const queryClient = new QueryClient()

ReactDOM.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <LabelContextProvider>
          <ListContextProvider>
            <FilterContextProvider>
              <TaskContextProvider>
                <App />
              </TaskContextProvider>
            </FilterContextProvider>
          </ListContextProvider>
        </LabelContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
