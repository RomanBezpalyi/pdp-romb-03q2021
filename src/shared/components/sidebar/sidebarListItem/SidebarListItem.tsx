import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'

import { ReactComponent as Pencil } from '../../../../assets/svg/pencil.svg'
import { ReactComponent as Check } from '../../../../assets/svg/check.svg'

import { ListContext } from '../../../../store'

import { List } from '../models'

export const SidebarListItem: React.FC<List> = ({
  title,
  styles,
  id,
  mutate,
}) => {
  const { listInEditMode, editModeHandler } = useContext(ListContext)
  const isEditMode = listInEditMode.id === id

  const onChange = (e: React.SyntheticEvent<any>) => {
    editModeHandler({ ...listInEditMode, title: e.currentTarget.value })
  }

  const onBtnClick = () => {
    const list = { id, title }
    if (!isEditMode) {
      editModeHandler(list)
    } else {
      list.title = listInEditMode.title
      mutate(list)
    }
  }
  return (
    <li className="list-group-item list-group-item-action">
      {isEditMode ? (
        <input type="text" value={listInEditMode.title} onChange={onChange} />
      ) : (
        <NavLink className={styles.listLink} to={`/${id}`}>
          {title}
        </NavLink>
      )}
      <button
        onClick={onBtnClick}
        type="button"
        className={`btn btn-light right ${styles.itemBtn}`}
      >
        {isEditMode ? <Check /> : <Pencil />}
      </button>
    </li>
  )
}
