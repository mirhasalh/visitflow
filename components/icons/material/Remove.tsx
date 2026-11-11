type Prop = {
  className: string
}

export default function Remove({ className }: Prop) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13V11H19V13H5Z" fill="currentColor" />
    </svg>
  )
}
