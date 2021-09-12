import { Task } from '../../features/tasks/model'

export const searchTasksByFilters = (tasks: Task[], query: string) => {
  let filteredTasks = [...tasks]

  if (query) {
    filteredTasks = filteredTasks.filter((task: Task) => {
      return task.title.toLowerCase().includes(query.toLowerCase())
    })
  }

  return filteredTasks
}
