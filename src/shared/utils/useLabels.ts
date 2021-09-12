import { useQuery } from 'react-query'

import { Label } from '../../features/labels/model'

import * as api from '../api'

export const useLabels = (getLabels: any) => {
  return useQuery('labels', async () => {
    const { data } = await api.getLabels()
    const labels: Label[] = []

    for (const key in await data) {
      // eslint-disable-next-line no-prototype-builtins
      if (data.hasOwnProperty(key)) {
        labels.push({ ...data[key], id: key })
      }
    }
    getLabels(labels)
    return labels
  })
}
