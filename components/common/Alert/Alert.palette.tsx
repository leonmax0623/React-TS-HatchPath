import { AlertType, AlertVariantType } from './Alert'

import Alert from '.'

const TYPES: AlertType[] = ['info', 'success', 'warning', 'error']
const VARIANTS: AlertVariantType[] = ['default', 'heavy', 'border']
const AlertPalette = () => {
  return (
    <div className="flex flex-col space-y-8">
      {TYPES.map((type, typeIdx) => (
        <div className="flex flex-col space-y-4" key={typeIdx}>
          <h2>{type}</h2>
          {VARIANTS.map((variant, variantIdx) => (
            <Alert
              key={variantIdx}
              type={type}
              variant={variant}
              title="Alert title"
              description={`This is an alert of type: ${type} and variant: ${variant}`}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
export default AlertPalette
