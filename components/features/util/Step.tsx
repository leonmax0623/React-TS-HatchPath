import { PropsWithChildren } from 'react'

import Button from 'components/common/Button'

import cn from 'util/classnames'

import { CommonProps } from 'types/common'

import { ErrorAlert } from 'components/features/util/Error'

type StepProps = PropsWithChildren<
  CommonProps & {
    contentClassName?: string
    step: number
    total: number
    title?: string
    onNext: () => void
    onPrev?: () => void
    isPrevHidden?: boolean
    isNextDisabled?: boolean
    loading?: boolean
    nextText?: string
    prevText?: string
    error?: boolean
  }
>
const Step = ({
  id,
  className,
  contentClassName,
  step,
  total,
  title,
  onNext,
  onPrev = () => undefined,
  isPrevHidden = false,
  isNextDisabled = false,
  loading = false,
  nextText = 'Next',
  prevText = 'Back',
  error = false,
  children,
}: StepProps) => (
  <div id={id} className={cn('flex flex-col gap-y-8 w-150', className)}>
    <div>
      <p>
        Step {step} / {total}
      </p>
      <h1>{title}</h1>
    </div>
    <div className={cn('flex flex-col gap-y-4 text-left', contentClassName)}>
      {children}
      {error && <ErrorAlert className="text-left" />}
    </div>
    <div id={id} className={cn('flex flex-col gap-y-2', className)}>
      <Button
        className="px-10 mt-4 w-full"
        onClick={onNext}
        disabled={isNextDisabled}
        loading={loading}
      >
        {nextText}
      </Button>
      {!isPrevHidden && (
        <Button className="w-full" variant="text" onClick={onPrev}>
          {prevText}
        </Button>
      )}
    </div>
  </div>
)
export default Step
