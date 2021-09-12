import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQueryClient } from 'react-query'
import { Tooltip } from 'reactstrap'
import { toast } from 'react-toastify'

import { ReactComponent as Pencil } from '../../../../assets/svg/pencil.svg'
import { ReactComponent as Check } from '../../../../assets/svg/check.svg'
import { ReactComponent as Trash } from '../../../../assets/svg/trash.svg'

import { LabelContext, TaskContext } from '../../../../store'
import * as api from '../../../../shared/api'

import { Task } from '../../model'
import { Label } from '../../../labels/model'

export const TaskTableRow: React.FC<Task> = ({
  title,
  isDone,
  label,
  styles,
  id,
  mutate,
}) => {
  const { id: listId } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const { labels } = useContext(LabelContext)
  const { taskInEditMode, editModeHandler } = useContext(TaskContext)
  const [isTaskDone, setIsDone] = useState(isDone)
  const [deletedTaskId, setDeletedTaskId] = useState('')
  const isEditMode = taskInEditMode.id === id

  const [tooltipOpen, setTooltipOpen] = useState(false)
  const toggle = () => setTooltipOpen(!tooltipOpen)

  const onBtnClick = () => {
    const task = { id, title, isDone, label }
    if (!isEditMode) {
      editModeHandler(task)
    } else if (
      taskInEditMode.title !== title ||
      taskInEditMode.label !== label
    ) {
      task.title = taskInEditMode.title
      task.label = taskInEditMode.label
      mutate({ listId, task })
    } else {
      editModeHandler()
    }
  }

  const onFieldChange = (e: React.SyntheticEvent<any>) => {
    editModeHandler({
      ...taskInEditMode,
      [e.currentTarget.name]: e.currentTarget.value,
    })
  }

  const { mutate: deleteMutate } = useMutation(api.deleteTask, {
    onSuccess: () => {
      queryClient
        .setQueryData(
          ['tasks', listId],
          queryClient.getQueryData(['tasks', listId]) as Task[]
        )
        .filter(item => item.id !== deletedTaskId)
      setDeletedTaskId('')
    },
    onError: () => {
      toast.error('Oops, something went wrong...')
    },
    onSettled: () => {
      queryClient.invalidateQueries('tasks')
    },
  })

  const { mutate: updateMutate } = useMutation(api.updateTask, {
    onSuccess: response => {
      queryClient
        .setQueryData(
          ['tasks', listId],
          queryClient.getQueryData(['tasks', listId]) as Task[]
        )
        .map(item => (item.id === response.id ? response : item))
      setDeletedTaskId('')
    },
    onError: () => {
      toast.error('Oops, something went wrong...')
    },
    onSettled: () => {
      queryClient.invalidateQueries('tasks')
    },
  })

  const onStatusChange = (e: React.SyntheticEvent<any>) => {
    setIsDone(prevState => !prevState)
    updateMutate({ listId, task: { id, isDone: !isTaskDone } } as any)
  }

  const onDelete = () => {
    setDeletedTaskId(id as string)
    deleteMutate({ id: listId, taskId: id } as any)
  }

  return (
    <tr>
      <td
        style={{ width: '8.33%', position: 'relative' }}
        className={styles.colorCell}
      >
        <input checked={isTaskDone} type="checkbox" onChange={onStatusChange} />
      </td>
      <td style={{ width: '25%' }} className={styles.colorCell}>
        <span
          className={styles.colorLabel}
          id={`tooltip-${id}`}
          style={{
            backgroundColor:
              (labels &&
                labels.length &&
                (!isEditMode
                  ? (labels as Label[]).find(
                      labelItem => labelItem.id === label
                    )?.color
                  : (labels as Label[]).find(
                      labelItem => labelItem.id === taskInEditMode.label
                    )?.color)) ||
              '#fff',
          }}
        />
        {!isEditMode && (
          <Tooltip
            placement="right"
            isOpen={tooltipOpen}
            target={`tooltip-${id}`}
            toggle={toggle}
          >
            {labels &&
              labels.length &&
              (labels as Label[]).find(labelItem => labelItem.id === label)
                ?.title}
          </Tooltip>
        )}
        {isEditMode && (
          <select
            className="form-control"
            name="label"
            onChange={onFieldChange}
          >
            {labels.map(labelOption => (
              <option key={labelOption.id} value={labelOption.id}>
                {labelOption.title}
              </option>
            ))}
          </select>
        )}
      </td>
      <td>
        {isEditMode ? (
          <input
            className="form-control"
            type="text"
            placeholder="Edit a task"
            value={taskInEditMode.title}
            name="title"
            onChange={onFieldChange}
          />
        ) : (
          title
        )}
      </td>
      <td>
        <button
          type="button"
          className={`btn btn-light ${styles.btn}`}
          onClick={onBtnClick}
        >
          {isEditMode ? <Check /> : <Pencil />}
        </button>
        <button type="button" className="btn btn-light" onClick={onDelete}>
          <Trash />
        </button>
      </td>
    </tr>
  )
}
