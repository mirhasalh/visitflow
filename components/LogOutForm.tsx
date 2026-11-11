export default function LogOutForm() {
  return (
    <form action="/api/logout" method="post">
      <button type="submit">
        <span className="text-error">Log out</span>
      </button>
    </form>
  )
}
