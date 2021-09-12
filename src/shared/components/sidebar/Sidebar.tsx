import React, { useContext, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import * as api from '../../api'

import { ReactComponent as Plus } from '../../../assets/svg/plus-lg.svg'
import { ReactComponent as Paint } from '../../../assets/svg/paint.svg'

import { SidebarListItem } from './sidebarListItem'

import { ListContext, LabelContext } from '../../../store'
import { useLabels } from '../../utils'

import { List } from './models'

import styles from './Sidebar.module.scss'

export const Sidebar: React.FC = () => {
  const queryClient = useQueryClient()
  const {
    getLists,
    listInEditMode,
    createList,
    updateList,
    editModeHandler,
  } = useContext(ListContext)
  const { getLabels, labels } = useContext(LabelContext)
  const [title, setTitle] = useState('')

  const onTitleChange = (e: React.SyntheticEvent<any>) => {
    setTitle(e.currentTarget.value)
  }

  const { mutate } = useMutation<any>(
    listInEditMode.id ? (api.updateList as any) : (api.createList as any),
    {
      onSuccess: ({ name }) => {
        let arrayToUpdate: any[]
        if (!listInEditMode.id) {
          createList({ id: name, title })
          arrayToUpdate = [
            ...(queryClient.getQueryData('lists') as List[]),
            { id: name, title },
          ]
        } else {
          updateList(name, { id: name, title })
          arrayToUpdate = (queryClient.getQueryData(
            'lists'
          ) as List[]).map(item =>
            item.id === listInEditMode.id ? { title, id: name } : item
          )
          editModeHandler()
        }
        queryClient.setQueryData('lists', arrayToUpdate)
      },
      onError: () => {
        toast.error('Oops, something went wrong...')
      },
      onSettled: () => {
        queryClient.invalidateQueries('lists')
      },
    }
  )

  const onSubmit = (event: React.SyntheticEvent<any>) => {
    event.preventDefault()
    if (title.length < 4) return
    if (listInEditMode.id) editModeHandler()
    const body: any = { title }
    mutate(body)
    setTitle('')
  }

  const useLists: () => any = () => {
    return useQuery('lists', async () => {
      const { data } = await api.getLists()
      const lists: List[] = []

      for (const key in await data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {
          lists.push({ ...data[key], id: key })
        }
      }
      getLists(lists)
      return lists
    })
  }

  useLabels(getLabels)
  const { data, isLoading, error } = useLists()

  return (
    <aside className={styles.sidedrawer}>
      <ul
        className={`list-group list-group-flush browser-default ${styles.sideList}`}
      >
        <li className={styles.controlsListItem}>
          <input
            type="text"
            placeholder="Create a list"
            value={title}
            onChange={onTitleChange}
            required
          />
          <div className="invalid-feedback">Please provide a valid city.</div>
          <button
            onClick={onSubmit}
            type="button"
            className={`btn btn-light ${styles.btn}`}
          >
            <Plus />
          </button>
        </li>
        {labels &&
          data &&
          data.length > 0 &&
          data.map((list: List) => (
            <SidebarListItem
              title={list.title}
              styles={styles}
              key={list.id}
              id={list.id}
              mutate={mutate}
            />
          ))}
      </ul>
      {isLoading && <p className="info-msg">Loading...</p>}
      {error && <p className="info-msg error">{error}</p>}
      {!isLoading && !error && (!data || (data && !data.length)) && (
        <p
          className="info-msg 
          sidebar-text"
        >
          Please, create a list
        </p>
      )}
      <NavLink className={styles.labelsLink} to="/labels">
        <Paint className={styles.paint} />
        Labels
      </NavLink>
    </aside>
  )
}
