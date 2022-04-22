import Switch from '.'

const SwitchPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Switch label="label goes here" helper="helper goes here" />
      <Switch label="label goes here" error="error goes here" />
      <Switch />
    </div>
  )
}
export default SwitchPalette
