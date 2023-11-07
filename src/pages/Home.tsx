export function Home() {
  return (
    <div className="prose">
      <div className="bg-gray-300 p-4">
        <h1>Cat Chat</h1>
      </div>
      <div className="p-4">
        <h2>Ask the cats anything!</h2>

          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            <a href="/chat">Chat</a>
          </button>

        <h2>Join to meet the cats!</h2>
      </div>
    </div>
  )
}
