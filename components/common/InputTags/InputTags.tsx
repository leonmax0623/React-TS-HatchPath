import { useCallback, useMemo, useState } from 'react'

import cn from 'util/classnames'
import { removeIndex, uniqueAdd } from 'util/list'
import { equalsIgnoreCase } from 'util/string'

import { CommonProps, SyntheticBlurEvent } from 'types/common'

import InputAutoComplete from '../InputAutoComplete'
import { InputWrapperProps } from '../InputWrapper'
import Tag from '../Tag'

type InputTagsProps = CommonProps &
  InputWrapperProps & {
    name?: string
    value?: string[]
    onChange?: (e: { target: { name?: string; value?: string[] } }) => void
    onValueChange?: (value: string[]) => void
    onBlur?: (e: SyntheticBlurEvent) => void
    isUnique?: boolean
    lowerCase?: boolean
    options?: string[]
  }

const InputTags = ({
  id,
  className,
  label,
  helper,
  error,
  name,
  value = [],
  onChange = () => undefined,
  onValueChange = () => undefined,
  onBlur = () => undefined,
  isUnique = false,
  lowerCase = false,
  options = [],
  size = 'md',
}: InputTagsProps): JSX.Element => {
  const [edit, setEdit] = useState<string>('')

  const handleChange = useCallback(
    (next: string[]) => {
      onValueChange(next)
      onChange({ target: { name, value: next } })
    },
    [name, onValueChange, onChange],
  )
  const handleAdd = useCallback(
    (custom?: string) => {
      const val = custom ? custom : edit || ''
      const next = (lowerCase ? val.toLocaleLowerCase() : val).trim()
      if (next) {
        if (isUnique) {
          handleChange(uniqueAdd(value, next))
        } else {
          handleChange([...value, next])
        }
        setEdit('')
      }
    },
    [isUnique, value, edit, lowerCase, handleChange],
  )

  const showOptions = useMemo(
    () =>
      options.filter(
        (opt) =>
          !value.some((val) => {
            return equalsIgnoreCase(opt, val)
          }),
      ),
    [options, value],
  )

  return (
    <InputAutoComplete
      id={id}
      className={className}
      label={label}
      helper={helper || 'Press enter to add new value'}
      error={error}
      name={name}
      value={edit}
      onValueChange={(next) => setEdit(next)}
      onBlur={onBlur}
      onEnter={() => handleAdd()}
      onSelect={handleAdd}
      topDecorator={
        <div
          className={cn('flex flex-row flex-wrap gap-2 items-center', {
            'mb-3': value.length > 0,
          })}
        >
          {value.map((tag, idx) => (
            <Tag
              label={tag}
              key={idx}
              showClose={true}
              onClose={() => handleChange(removeIndex(value, idx))}
              size={size === 'xs' ? 'sm' : size}
            />
          ))}
        </div>
      }
      rightIcon={{
        icon: 'plus',
        onClick: () => handleAdd(),
      }}
      options={showOptions}
      keepOpen={true}
      size={size}
      disableAutoComplete={true}
    />
  )
}
export default InputTags
