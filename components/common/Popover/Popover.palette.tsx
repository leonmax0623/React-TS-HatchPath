import Popover from '.'

const PopoverPalette = () => {
  return (
    <div className="flex flex-col space-y-4">
      <Popover
        trigger="hover"
        content={
          <div className="p-4">
            <h1>Popover content</h1>
          </div>
        }
      >
        <p className="mr-auto">hover here for popover</p>
      </Popover>
    </div>
  )
}
export default PopoverPalette
