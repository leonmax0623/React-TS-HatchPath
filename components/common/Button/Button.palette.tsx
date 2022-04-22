import {
  ButtonColorType,
  ButtonSizeType,
  ButtonVariantType,
} from './buttonMapping'
import IconButton from './IconButton'

import Button from '.'

const COLORS = [
  'primary',
  'secondary',
  'warning',
  'error',
  'success',
  'inverse',
  'orange'
]
const VARIANTS = ['default', 'outlined', 'text', 'link']
const SIZES = ['xs', 'sm', 'md', 'lg']

const ButtonPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      {VARIANTS.map((variant, variantIdx) => (
        <div key={variantIdx}>
          <h2 className="capitalize">{variant} Button</h2>
          <div className="flex flex-col mt-2 space-y-2">
            {SIZES.map((size, sizeIdx) => (
              <div className="flex flex-col space-y-1" key={sizeIdx}>
                <h3 className="w-20 font-light text-gray-600">{size}: </h3>
                {COLORS.map((color, colorIdx) => (
                  <div
                    key={colorIdx}
                    className="flex flex-row items-center space-x-1"
                  >
                    <Button
                      size={size as ButtonSizeType}
                      color={color as ButtonColorType}
                      variant={variant as ButtonVariantType}
                      leftIcon={{
                        icon: 'plus',
                      }}
                      rightIcon={{
                        icon: 'plus',
                      }}
                    >
                      {color}
                    </Button>
                    <Button
                      size={size as ButtonSizeType}
                      color={color as ButtonColorType}
                      variant={variant as ButtonVariantType}
                      leftIcon={{
                        icon: 'plus',
                      }}
                      rightIcon={{
                        icon: 'plus',
                      }}
                      loading={true}
                    >
                      {color}
                    </Button>
                    <IconButton
                      size={size as ButtonSizeType}
                      color={color as ButtonColorType}
                      variant={variant as ButtonVariantType}
                      icon={{ icon: 'plus' }}
                      ariaLabel="Plus button"
                      tooltip={{
                        label: 'tooltip',
                      }}
                    />
                    <IconButton
                      size={size as ButtonSizeType}
                      color={color as ButtonColorType}
                      variant={variant as ButtonVariantType}
                      icon={{ icon: 'plus' }}
                      ariaLabel="Plus button"
                      loading={true}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
export default ButtonPalette
