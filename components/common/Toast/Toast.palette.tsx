import { ToastType } from './Toast'

import { useToast } from '.'

const TYPES: ToastType[] = ['info', 'success', 'error']
const ToastPalette = () => {
  const { toast } = useToast()
  return (
    <div className="flex flex-col space-y-4">
      {TYPES.map((type, typeIdx) => (
        <button
          key={typeIdx}
          className="p-3 bg-blue-100 hover:bg-blue-200 rounded"
          onClick={() =>
            toast({
              title: 'Toast title',
              description: 'Toast description goes here',
              type,
            })
          }
        >
          show {type} toast
        </button>
      ))}
    </div>
  )
}
export default ToastPalette
