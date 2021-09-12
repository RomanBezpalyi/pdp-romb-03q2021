import React, { useState } from 'react'

import { List } from '../shared/components/sidebar/models'

export const ListContext = React.createContext({
  lists: [] as List[],
  listInEditMode: { title: '', id: '' } as any,
  getLists: (lists: List[]) => {},
  createList: (list: List) => {},
  updateList: (id: string, list: List) => {},
  editModeHandler: (list?: List) => {},
})

export const ListContextProvider: React.FC = ({ children }) => {
  const [lists, setLists] = useState<List[]>([])
  const [listInEditMode, setListInEditMode] = useState({ title: '', id: '' })

  // eslint-disable-next-line no-shadow
  const getLists = (lists: List[]) => {
    setLists(lists)
  }

  const createList = (list: List) => {
    setLists(prevLists => [...prevLists, list])
  }

  const updateList = (id: string, listToUpdate: List) => {
    setLists(prevLists =>
      prevLists.map(list => (list.id === id ? listToUpdate : list))
    )
  }

  const editModeHandler = (list?: any) =>
    setListInEditMode(
      list ? { id: list.id, title: list.title } : { id: '', title: '' }
    )

  const contextValue = {
    lists,
    listInEditMode,
    getLists,
    createList,
    updateList,
    editModeHandler,
  }

  return (
    <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
  )
}
