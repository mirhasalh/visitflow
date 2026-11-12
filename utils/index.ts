export const blurActiveElement = () => {
  document.activeElement instanceof HTMLElement && document.activeElement.blur()
}
