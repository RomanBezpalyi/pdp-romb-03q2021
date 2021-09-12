import React, { useContext, useState } from 'react'
import { TwitterPicker } from 'react-color'
import { useMutation, useQueryClient } from 'react-query'
import { toast } from 'react-toastify'

import { LabelsTableRow } from '../labelsTableRow'

import { LabelContext } from '../../../../store'

import { useLabels } from '../../../../shared/utils'
import * as api from '../../../../shared/api'

import { Label } from '../../model'

import { ReactComponent as Palette } from '../../../../assets/svg/palette.svg'
import { ReactComponent as Plus } from '../../../../assets/svg/plus-lg.svg'

import styles from './LabelsTable.module.scss'

export const LabelsTable: React.FC = () => {
  const queryClient = useQueryClient()
  const {
    getLabels,
    labelInEditMode,
    createLabel,
    updateLabel,
    editModeHandler,
  } = useContext(LabelContext)
  const [isVisible, setIsVisible] = useState(false)
  const [label, setLabelField] = useState({ title: '', color: '#ffffff' })

  const onPaletteClick = () => {
    setIsVisible(prevState => !prevState)
  }

  const onTitleChange = (e: React.SyntheticEvent<any>) => {
    setLabelField({ ...label, title: e.currentTarget.value })
  }

  const onColorChange = (colorObject: { hex: string }) => {
    setLabelField(labelState => ({
      ...labelState,
      color: colorObject.hex,
    }))
    setIsVisible(false)
  }

  const { mutate } = useMutation<any>(
    labelInEditMode.id ? (api.updateLabel as any) : (api.createLabel as any),
    {
      onSuccess: ({ name }) => {
        let arrayToUpdate: any[]
        if (!labelInEditMode.id) {
          createLabel({ id: name, ...label })
          arrayToUpdate = [
            ...(queryClient.getQueryData('labels') as Label[]),
            { id: name, ...label },
          ]
        } else {
          updateLabel(name, { id: name, ...label })
          arrayToUpdate = (queryClient.getQueryData(
            'labels'
          ) as Label[]).map(item =>
            item.id === labelInEditMode.id ? { ...label } : item
          )
          editModeHandler()
        }
        queryClient.setQueryData('labels', arrayToUpdate)
        setLabelField({ title: '', color: '#ffffff' })
      },
      onError: () => {
        toast.error('Oops, something went wrong...')
      },
      onSettled: () => {
        queryClient.invalidateQueries('labels')
      },
    }
  )

  const onSubmit = (event: React.SyntheticEvent<any>) => {
    event.preventDefault()
    if (label.title.length < 4) return
    editModeHandler()
    const body: any = { ...label }
    mutate(body)
  }

  const { data, isLoading, error } = useLabels(getLabels)

  return (
    <div className={styles.tableWrapper}>
      <table className="table">
        <tbody>
          <tr>
            <td style={{ width: '15%' }} className={styles.colorCell}>
              <span
                className={styles.colorLabel}
                style={{ backgroundColor: label.color }}
              />
              <div className={styles.colorpickerWrapper}>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={onPaletteClick}
                >
                  <Palette />
                </button>
                {isVisible && (
                  <TwitterPicker
                    onChangeComplete={onColorChange}
                    color={label.color}
                  />
                )}
              </div>
            </td>
            <td>
              <input
                className="form-control"
                type="text"
                placeholder="Create a label"
                value={label.title}
                minLength={4}
                onChange={onTitleChange}
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
          {data &&
            data.length > 0 &&
            data.map(labelItem => (
              <LabelsTableRow
                key={labelItem.id}
                styles={styles}
                title={labelItem.title}
                color={labelItem.color}
                mutate={mutate}
                id={labelItem.id}
              />
            ))}
        </tbody>
      </table>
      {isLoading && <p className="info-msg">Loading...</p>}
      {error && <p className="info-msg error">{error as string}</p>}
      {!isLoading && !error && (!data || (data && !data.length)) && (
        <p className="info-msg">Please, create a label</p>
      )}
    </div>
  )
}
