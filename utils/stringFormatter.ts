export const formatted = (iso: string) =>
  new Intl.DateTimeFormat('en', {
    dateStyle: 'full',
    timeZone: 'Asia/Jakarta'
  }).format(new Date(iso))

export const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
