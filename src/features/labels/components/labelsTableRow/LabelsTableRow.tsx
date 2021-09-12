import React, { useState, useContext } from 'react'
import { TwitterPicker } from 'react-color'

import { ReactComponent as Palette } from '../../../../assets/svg/palette.svg'
import { ReactComponent as Pencil } from '../../../../assets/svg/pencil.svg'
import { ReactComponent as Check } from '../../../../assets/svg/check.svg'

import { LabelContext } from '../../../../store'

import { Label } from '../../model'

export const LabelsTableRow: React.FC<Label> = ({
  id,
  title,
  color,
  styles,
  mutate,
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { labelInEditMode, editModeHandler } = useContext(LabelContext)
  const isEditMode = labelInEditMode.id === id

  const onPaletteClick = () => {
    setIsVisible(prevState => !prevState)
  }

  const onBtnClick = () => {
    const label = { id, title, color }
    if (!isEditMode) {
      editModeHandler(label)
    } else if (
      labelInEditMode.title !== title ||
      labelInEditMode.color !== color
    ) {
      label.title = labelInEditMode.title
      label.color = labelInEditMode.color
      mutate(label)
    } else {
      editModeHandler()
    }
  }

  const onColorChange = (colorObject: { hex: string }) => {
    editModeHandler({
      ...labelInEditMode,
      color: colorObject.hex,
    })
    setIsVisible(false)
  }

  const onTitleChange = (e: React.SyntheticEvent<any>) => {
    editModeHandler({
      ...labelInEditMode,
      title: e.currentTarget.value,
    })
  }

  return (
    <tr>
      <td>
        <span
          className={styles.colorLabel}
          style={{
            backgroundColor: isEditMode ? labelInEditMode.color : color,
          }}
        />
        {isEditMode && (
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
                color={labelInEditMode.color}
              />
            )}
          </div>
        )}
      </td>
      <td>
        {isEditMode ? (
          <input
            className="form-control"
            type="text"
            placeholder="Create a label"
            value={labelInEditMode.title}
            onChange={onTitleChange}
          />
        ) : (
          title
        )}
      </td>
      <td>
        <button type="button" className="btn btn-light" onClick={onBtnClick}>
          {isEditMode ? <Check /> : <Pencil />}
        </button>
      </td>
    </tr>
  )
}
