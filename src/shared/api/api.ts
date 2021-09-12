import axios from 'axios'

import { environment } from '../../environment'

import { User } from '../../features/auth/model'
import { Task } from '../../features/tasks/model'
import { List } from '../components/sidebar/models'
import { Label } from '../../features/labels/model'

export const URL = 'https://pdp-romb.firebaseio.com/'
export const AUTH_URL = 'https://identitytoolkit.googleapis.com/v1/'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export interface AuthResponseData {
  kind: string
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registred?: boolean
}

// AUTH

export const authSignup = async (creds: User) => {
  const { data } = await axios.post<AuthResponseData>(
    `${AUTH_URL}accounts:signUp?key=${environment.firebaseAPIKey}`,
    {
      email: creds.email,
      password: creds.password,
      returnSecureToken: true,
    }
  )
  return data
}

export const authLogin = async (creds: User) => {
  const { data } = await axios.post<AuthResponseData>(
    `${AUTH_URL}accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
    {
      email: creds.email,
      password: creds.password,
      returnSecureToken: true,
    }
  )
  return data
}

// LISTS

export const getLists = async () => {
  const data = await axios.get<any>(`${URL}lists.json`)
  return data
}

export const createList = async (title: string) => {
  const { data } = await axios.post<List>(`${URL}lists.json`, title)
  return data
}

export const updateList = async ({
  title,
  id,
}: {
  title: string
  id: string
}) => {
  const { data } = await axios.patch<List>(`${URL}lists/${id}.json`, { title })
  return data
}

// LABELS

export const getLabels = async () => {
  const data = await axios.get<any>(`${URL}labels.json`)
  return data
}

export const createLabel = async (label: Label) => {
  const { data } = await axios.post<Label>(`${URL}labels.json`, label)
  return data
}

export const updateLabel = async ({
  id,
  ...rest
}: {
  title: string
  id: string
  color: string
}) => {
  const { data } = await axios.patch<Label>(`${URL}labels/${id}.json`, {
    ...rest,
  })
  return data
}

// TASKS

export const getList = async (id: string) => {
  const data = await axios.get<any>(`${URL}lists/${id}.json`)
  return data
}

export const createTask = async ({ id, task }: { id: string; task: Task }) => {
  const { data } = await axios.post<Task>(`${URL}lists/${id}/tasks.json`, task)
  return data
}

export const updateTask = async ({
  listId,
  task,
}: {
  listId: string
  task: Task
}) => {
  const { data } = await axios.patch<List>(
    `${URL}lists/${listId}/tasks/${task.id}.json`,
    { ...task }
  )
  return data
}

export const deleteTask = async ({
  id,
  taskId,
}: {
  id: string
  taskId: string
}) => {
  const { data } = await axios.delete<List>(
    `${URL}lists/${id}/tasks/${taskId}.json`
  )
  return data
}
