import { useState } from 'react'

import dayjs from 'dayjs'

import Button from 'components/common/Button'
import InputArea from 'components/common/InputArea'
import { useToast } from 'components/common/Toast'

import cn from 'util/classnames'
import { useAppSelector } from 'util/store'

import { CommonProps } from 'types/common'
import { MessageType } from 'types/message'

type MessagesProps = CommonProps & {
  messages: MessageType[]
  onSend: (message: string) => Promise<void>
  disabled?: boolean
  disabledMessage?: string
}
const Messages = ({
  id,
  className,
  messages,
  onSend,
  disabled = false,
  disabledMessage = 'Messaging has been disabled',
}: MessagesProps) => {
  const { user } = useAppSelector((state) => state.user)
  const { toast, error } = useToast()
  const [message, setMessage] = useState<string>('')
  const [sending, setSending] = useState<boolean>(false)

  const handleSend = async () => {
    if (message) {
      setSending(true)
      try {
        await onSend(message)
        toast({
          title: 'Message sent',
          description: 'Succesfully sent your message',
          type: 'success',
        })
        setMessage('')
      } catch {
        error()
      }

      setSending(false)
    }
  }

  return (
    <div id={id} className={cn('flex flex-col', className)}>
      <div className="flex overflow-y-auto flex-col grow gap-y-2 w-full min-h-1">
        {messages.map(({ content, createdTime, author }, idx) => (
          <div
            className={cn('flex flex-row', {
              'justify-start': author !== user?.id,
              'justify-end': author === user?.id,
            })}
            key={idx}
          >
            <div className="w-full md:w-1/3">
              <p
                className={cn('p-2 rounded', {
                  'bg-blue-100': author !== user?.id,
                  'bg-gray-100': author === user?.id,
                })}
              >
                {content}
              </p>
              <p className="px-2 text-xs font-light text-gray-500">
                {dayjs(createdTime).format('MMM DD, YYYY - hh:mm A')}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className=" pt-4 mt-4 border-t border-gray-300">
        {disabled && (
          <p className="pb-4 text-center text-gray-500">{disabledMessage}</p>
        )}
        <div className="flex flex-row gap-x-2 items-center">
          <InputArea
            value={message}
            onValueChange={(next) => setMessage(next || '')}
            disabled={disabled}
          />
          <Button
            className="h-full"
            leftIcon={{ icon: 'paper-plane' }}
            loading={sending}
            onClick={handleSend}
            disabled={disabled}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}
export default Messages
