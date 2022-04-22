import Checkbox from '.'

const CheckboxPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Checkbox label="label goes here" helper="helper goes here" />
      <Checkbox label="label goes here" error="error goes here" />
    </div>
  )
}
export default CheckboxPalette
