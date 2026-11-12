export default function LogOutForm() {
  return (
    <form className="flex" action="/api/logout" method="post">
      <button className="flex-1 cursor-pointer text-start" type="submit">
        <span className="text-error">Log out</span>
      </button>
    </form>
  )
}
