import React, { useState } from 'react'

export const FilterContext = React.createContext({
  query: '',
  setQuery: (value: string) => {},
})

export const FilterContextProvider: React.FC = ({ children }) => {
  const [query, setQuery] = useState('')

  // eslint-disable-next-line no-shadow
  const searchByTitle = (value: string) => {
    setQuery(value)
  }

  const contextValue = {
    setQuery: searchByTitle,
    query,
  }

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  )
}
