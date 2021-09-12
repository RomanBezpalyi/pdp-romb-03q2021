import React, { useState } from 'react'

import { Task } from '../features/tasks/model'

export const TaskContext = React.createContext({
  tasks: [] as Task[],
  taskInEditMode: { title: '', id: '', color: '' } as any,
  getTasks: (tasks: Task[]) => {},
  createTask: (task: Task) => {},
  updateTask: (id: string, task: Task) => {},
  editModeHandler: (task?: Task) => {},
})

export const TaskContextProvider: React.FC = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskInEditMode, setTaskInEditMode] = useState({
    title: '',
    id: '',
    label: '',
    isDone: false,
  })

  // eslint-disable-next-line no-shadow
  const getTasks = (tasks: Task[]) => {
    setTasks(tasks)
  }

  const createTask = (task: Task) => {
    setTasks(prevTasks => [...prevTasks, task])
  }

  const updateTask = (id: string, taskToUpdate: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? taskToUpdate : task))
    )
  }

  const editModeHandler = (task?: any) =>
    setTaskInEditMode(
      task
        ? {
            id: task.id,
            title: task.title,
            label: task.label,
            isDone: task.isDone,
          }
        : { id: '', title: '', label: '', isDone: false }
    )

  const contextValue = {
    tasks,
    taskInEditMode,
    getTasks,
    createTask,
    updateTask,
    editModeHandler,
  }

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  )
}
