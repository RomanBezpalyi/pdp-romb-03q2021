import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { TaskTableRow } from '../taskTableRow'

import { ReactComponent as Plus } from '../../../../assets/svg/plus-lg.svg'

import * as api from '../../../../shared/api'
import { searchTasksByFilters } from '../../../../shared/utils'
import { FilterContext, LabelContext, TaskContext } from '../../../../store'

import { Task } from '../../model'
import { Label } from '../../../labels/model'

import styles from './TaskTable.module.scss'

export const TaskTable: React.FC = () => {
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const { labels } = useContext(LabelContext)
  const {
    getTasks,
    taskInEditMode,
    createTask,
    updateTask,
    editModeHandler,
  } = useContext(TaskContext)
  const { query } = useContext(FilterContext)
  const [task, setTaskField] = useState({
    label: labels && labels.length ? (labels[0].id as string) : '',
    title: '',
    isDone: false,
  })

  const onFieldChange = (e: React.SyntheticEvent<any>) => {
    setTaskField({ ...task, [e.currentTarget.name]: e.currentTarget.value })
  }

  const { mutate } = useMutation(
    taskInEditMode.id ? (api.updateTask as any) : (api.createTask as any),
    {
      onSuccess: (response: any) => {
        let arrayToUpdate: any[]
        if (!taskInEditMode.id) {
          createTask({ id: response.name, ...task })
          arrayToUpdate = [
            ...(queryClient.getQueryData(['tasks', id]) as Task[]),
            { id: response.name, ...task },
          ]
        } else {
          updateTask(response.id, { ...response })
          arrayToUpdate = (queryClient.getQueryData([
            'tasks',
            id,
          ]) as Task[]).map(item =>
            item.id === taskInEditMode.id ? { ...task } : item
          )

          editModeHandler()
        }
        queryClient.setQueryData(['tasks', id], arrayToUpdate)
        setTaskField({
          label: labels && labels.length ? (labels[0].id as string) : '',
          title: '',
          isDone: false,
        })
      },
      onError: () => {
        toast.error('Oops, something went wrong...')
      },
      onSettled: () => {
        queryClient.invalidateQueries('tasks')
      },
    }
  )

  const onSubmit = (event: React.SyntheticEvent<any>) => {
    event.preventDefault()
    if (task.title.length < 4) return
    if (taskInEditMode.id) editModeHandler()
    const body: any = { id, task }
    mutate(body)
  }

  const useList = (listId: string) => {
    return useQuery(['tasks', listId], async () => {
      const { data } = await api.getList(listId)
      const tasks: Task[] = []

      for (const key in data.tasks) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.tasks.hasOwnProperty(key)) {
          tasks.push({ ...data.tasks[key], id: key })
        }
      }

      getTasks(tasks)
      return tasks
    })
  }

  const { data, isLoading, error } = useList(id)
  const tasks = searchTasksByFilters((data || []) as Task[], query)

  return (
    <>
      {labels && labels.length > 0 ? (
        <div className={styles.tableWrapper}>
          <table className="table">
            <tbody>
              <tr>
                <td style={{ width: '8.33%' }} className={styles.colorCell} />
                <td style={{ width: '25%' }} className={styles.colorCell}>
                  <span
                    className={styles.colorLabel}
                    style={{
                      backgroundColor:
                        labels &&
                        labels.length &&
                        labels.find(label => label.id === task.label)
                          ? (labels as Label[]).find(
                              label => label.id === task.label
                            )?.color
                          : '#fff',
                    }}
                  />
                  <select
                    className="form-control"
                    name="label"
                    onChange={onFieldChange}
                  >
                    {labels.map(label => (
                      <option key={label.id} value={label.id}>
                        {label.title}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Create a task"
                    value={task.title}
                    name="title"
                    onChange={onFieldChange}
                  />
                </td>
                <td style={{ width: '15%' }}>
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={onSubmit}
                  >
                    <Plus />
                  </button>
                </td>
              </tr>
              {tasks &&
                tasks.length > 0 &&
                (tasks as any).map((taskItem: Task) => (
                  <TaskTableRow
                    key={taskItem.id}
                    styles={styles}
                    title={taskItem.title}
                    label={taskItem.label}
                    isDone={taskItem.isDone}
                    id={taskItem.id}
                    mutate={mutate}
                  />
                ))}
            </tbody>
          </table>
          {isLoading && <p className="info-msg">Loading...</p>}
          {error && <p className="info-msg error">{error as string}</p>}
          {!isLoading && !error && data && data.length > 0 && !tasks.length && (
            <p className="info-msg">No tasks found</p>
          )}
          {!isLoading &&
            !error &&
            (!data ||
              (data && !data.length && (
                <p className="info-msg">Please, create a task</p>
              )))}
        </div>
      ) : (
        <p className="info-msg">Please, create a label</p>
      )}
    </>
  )
}
