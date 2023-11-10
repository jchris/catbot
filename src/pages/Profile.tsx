import catImage from '../assets/cat.png'
import cat2Image from '../assets/cat2.png'

import { ChatBubble, ImageBubble } from '../components/ChatBubbles'

export function Profile() {
  return (
    <div className="prose">
      <div className="bg-gray-300 p-4">
        <h1>Cat Chat</h1>
      </div>
      <div className="p-4">
        <h2>Subscribe to chat!</h2>

        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <a href="/chat">Chat</a>
        </button>

        <ImageBubble imgSrc={cat2Image} alt="Welcome photo" />

        <h2>Ask the cats anything!</h2>
      </div>
    </div>
  )
}
