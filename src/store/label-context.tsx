import React, { useState } from 'react'

import { Label } from '../features/labels/model'

export const LabelContext = React.createContext({
  labels: [] as Label[],
  labelInEditMode: { title: '', id: '', color: '' } as any,
  getLabels: (labels: Label[]) => {},
  createLabel: (label: Label) => {},
  updateLabel: (id: string, label: Label) => {},
  editModeHandler: (label?: Label) => {},
})

export const LabelContextProvider: React.FC = ({ children }) => {
  const [labels, setLabels] = useState<Label[]>([])
  const [labelInEditMode, setLabelInEditMode] = useState({
    title: '',
    id: '',
    color: '',
  })

  // eslint-disable-next-line no-shadow
  const getLabels = (labels: Label[]) => {
    setLabels(labels)
  }

  const createLabel = (label: Label) => {
    setLabels(prevLabels => [...prevLabels, label])
  }

  const updateLabel = (id: string, labelToUpdate: Label) => {
    setLabels(prevLabels =>
      prevLabels.map(label => (label.id === id ? labelToUpdate : label))
    )
  }

  const editModeHandler = (labelToUpdate?: any) => {
    if (labelToUpdate) {
      setLabelInEditMode({
        id: labelToUpdate.id,
        title: labelToUpdate.title,
        color: labelToUpdate.color,
      })
    } else {
      setLabelInEditMode({
        id: '',
        title: '',
        color: '',
      })
    }
  }

  const contextValue = {
    labels,
    labelInEditMode,
    getLabels,
    createLabel,
    updateLabel,
    editModeHandler,
  }

  return (
    <LabelContext.Provider value={contextValue}>
      {children}
    </LabelContext.Provider>
  )
}
