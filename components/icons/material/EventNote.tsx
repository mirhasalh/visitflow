type Prop = {
  className: string
}

export default function EventNote({ className }: Prop) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 22C4.44667 22 3.97667 21.8033 3.59 21.41C3.20333 21.0167 3.00667 20.5467 3 20V6C3 5.45333 3.19667 4.98333 3.59 4.59C3.98333 4.19667 4.45333 4 5 4H6V2H8V4H16V2H18V4H19C19.5533 4 20.0233 4.19667 20.41 4.59C20.8033 4.98333 21 5.45333 21 6V20C21 20.5467 20.8033 21.0167 20.41 21.41C20.0167 21.8033 19.5467 22 19 22H5ZM5 20H19V10H5V20ZM5 8H19V6H5V8ZM7 14V12H17V14H7ZM7 18V16H14V18H7Z"
        fill="currentColor"
      />
    </svg>
  )
}
