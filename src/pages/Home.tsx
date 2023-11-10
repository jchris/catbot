import catImage from '../assets/cat.png'
import { ChatBubble, ImageBubble } from '../components/ChatBubbles'

export function Home() {
  return (
    <div className="">
      <div className="bg-gray-300 p-4">
        <h1>Cat Chat</h1>
      </div>

      <div className="p-4">
        <h2>
          <a href="/profile" className="bg-blue-500 hover:bg-blue-300 font-bold py-2 px-4 rounded">
            Join to meet the cats!
          </a>
        </h2>

        <ImageBubble imgSrc={catImage} alt="Welcome photo" />
        <h2>Ask the cats anything!</h2>
        <ImageBubble imgSrc={cat2Image} alt="Welcome photo" />
      </div>
    </div>
  )
}
