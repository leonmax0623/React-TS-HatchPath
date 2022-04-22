import Image from 'next/image'
import { useState } from 'react'

import imageCompression from 'browser-image-compression'
import { useDropzone } from 'react-dropzone'

import uuid from 'util/uuid'

import { CommonProps } from 'types/common'
import { FileType } from 'types/file'

import Button, { IconButton } from '../Button'
import InputWrapper, { InputWrapperProps } from '../InputWrapper'

type InputImageProps = CommonProps &
  InputWrapperProps & {
    name?: string
    value?: FileType
    onChange?: (e: { target: { name?: string; value?: FileType } }) => void
    onValueChange?: (value?: FileType) => void
    disabled?: boolean
    accept?: string
  }
const InputImage = ({
  id,
  className,
  // input wrapper props
  labelClassName,
  helperClassName,
  label,
  error,
  helper,
  // function props
  name,
  value,
  onChange = () => undefined,
  onValueChange = () => undefined,
  disabled,
  accept = 'image/*',
}: InputImageProps): JSX.Element => {
  const { open, getInputProps, getRootProps } = useDropzone({
    accept,
    disabled,
    noClick: true,
    multiple: false,
    onDropAccepted: async (files) => {
      const file = files[0]
      if (file) {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1024,
        })
        const base64 = await imageCompression.getDataUrlFromFile(compressedFile)
        setFileURL(base64)

        const toSave: FileType = {
          id: uuid(),
          name: file.name,
          format: file.type,
          size: compressedFile.size,
          data: compressedFile,
          extra: {},
          url: null,
        }
        onValueChange(toSave)
        onChange({ target: { name: name || '', value: toSave } })
      }
    },
  })
  const [fileURL, setFileURL] = useState<string>()

  return (
    <InputWrapper
      className={className}
      labelClassName={labelClassName}
      helperClassName={helperClassName}
      label={label}
      error={error}
      helper={helper}
    >
      <div {...getRootProps()} className="w-full">
        <input id={id} {...getInputProps()} />

        {value && (value?.url || fileURL) ? (
          <div className="flex flex-col items-center">
            <Image
              src={value?.url || fileURL || ''}
              alt="profile"
              width={200}
              height={200}
            />
            <div className="flex flex-row justify-center items-center mt-0.5">
              <Button
                leftIcon={{
                  icon: 'sync',
                }}
                className="ml-2"
                variant="text"
                onClick={open}
                size="sm"
              >
                Replace
              </Button>
              <Button
                leftIcon={{
                  icon: 'trash',
                }}
                className="ml-2"
                variant="text"
                onClick={() => {
                  onValueChange(undefined)
                  onChange({ target: { name: name || '', value: undefined } })
                }}
                size="sm"
                color="secondary"
              >
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <IconButton
            className="!rounded-full"
            onClick={open}
            disabled={disabled}
            size="lg"
            icon={{
              icon: 'plus',
            }}
            color="secondary"
            ariaLabel="Upload file"
          />
        )}
      </div>
    </InputWrapper>
  )
}
export default InputImage
