import { Task } from '../../../../features/tasks/model'

export interface List {
  title: string
  styles?: any
  tasks?: Task[]
  id?: string
  mutate?: any
}
