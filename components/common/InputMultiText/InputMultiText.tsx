import { useCallback, useState } from 'react'

import cn from 'util/classnames'
import { removeIndex } from 'util/list'

import { CommonProps, SyntheticChangeEvent } from 'types/common'

import { IconButton } from '../Button'
import InputText from '../InputText'
import InputWrapper, { InputWrapperProps } from '../InputWrapper'

type InputMultiTextProps = CommonProps &
  InputWrapperProps & {
    name?: string
    value: string[]
    onChange?: (e: SyntheticChangeEvent<string[]>) => void
    onValueChange?: (next: string[]) => void
    placeholder?: string
  }
const InputMultiText = ({
  id,
  className,
  label,
  error,
  helper,
  name,
  value = [],
  onChange = () => undefined,
  onValueChange = () => undefined,
  placeholder,
}: InputMultiTextProps) => {
  const [edit, setEdit] = useState<string>('')

  const handleChange = useCallback(
    (next: string[]) => {
      onChange({
        target: {
          name,
          value: next,
        },
      })
      onValueChange(next)
    },
    [name, onChange, onValueChange],
  )
  const handleAdd = useCallback(() => {
    const toAdd = edit.trim()
    if (!!toAdd) {
      handleChange([...value, toAdd])
      setEdit('')
    }
  }, [edit, value, handleChange])

  return (
    <InputWrapper
      id={id}
      className={cn(className)}
      label={label}
      helper={helper}
      error={error}
    >
      <ul>
        {value.map(
          (val, idx) => (
            <li key={idx} className="flex flex-row gap-x-2 items-center">
              <p className="grow font-light text-left">{val}</p>
              <IconButton
                icon={{ icon: 'trash' }}
                ariaLabel="remove"
                variant="text"
                onClick={() => handleChange(removeIndex(value, idx))}
              />
            </li>
          ),
          [],
        )}
        <li className="flex flex-row gap-x-2 items-center">
          <InputText
            className="grow"
            value={edit}
            onValueChange={setEdit}
            onEnter={handleAdd}
            onBlur={handleAdd}
            placeholder={placeholder}
          />
          <IconButton
            icon={{ icon: 'plus' }}
            ariaLabel="add"
            variant="text"
            onClick={handleAdd}
          />
        </li>
      </ul>
    </InputWrapper>
  )
}
export default InputMultiText
