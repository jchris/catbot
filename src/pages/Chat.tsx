import { useState, useEffect, useRef } from 'react'
// import { Link, useParams } from 'react-router-dom'
import { useFireproof, Doc, DocFileMeta } from 'use-fireproof'
// import { InlineEditor } from '../components/InlineEditor'

import { useForm, FieldValues } from 'react-hook-form'

import usePartySocket from 'partysocket/react'

import catImage from '../assets/cat.png'
import { ImageBubble, ChatBubble, UserBubble } from '../components/ChatBubbles'

type MsgData = { _id: string; msg?: string; prompt?: string; done?: boolean; sent: number }
type MsgDoc = Doc & MsgData

const dbName = localStorage.getItem('dbName') || Math.random().toString(36).substring(2)
localStorage.setItem('dbName', dbName)

const PUBLIC_PARTYKIT_HOST = `127.0.0.1:1999`

export function Chat() {
  // const { id } = useParams<{ id: string }>()
  const { register, handleSubmit, resetField } = useForm()
  const { database, useLiveQuery } = useFireproof(dbName)
  const scrollDiv = useRef<HTMLDivElement | null>(null)

  const messages = useLiveQuery((doc, emit) => {
    if (doc.sent) {
      emit(doc.sent)
    }
  }).docs as MsgDoc[]

  // const all = useLiveQuery('_id').docs

  const [incomingMessage, setIncomingMessage] = useState<MsgData>({
    _id: '',
    msg: '',
    sent: Date.now()
  })

  const socket = usePartySocket({
    host: PUBLIC_PARTYKIT_HOST,
    room: dbName,
    onOpen() {
      // console.log('open', e)
    },
    onMessage(event: MessageEvent<string>) {
      const message = JSON.parse(event.data)
      if (message.msgId) {
        if (message.img) {
          const base64Data = message.img
          const byteCharacters = atob(base64Data)
          const byteNumbers = new Array(byteCharacters.length)
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i)
          }
          const byteArray = new Uint8Array(byteNumbers)
          const file = new File([byteArray], `image.png`, { type: 'image/png' })
          database
            .put({
              _id: message._id,
              msgId: message.msgId,
              prompt: message.prompt,
              role: 'img',
              sent: Date.now(),
              _files: {
                img: file
              }
            } as unknown as Doc)
            .then(() => {
              setTimeout(() => {
                scrollDiv.current?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            })
        } else {
          database
            .put({
              _id: message._id,
              msgId: message.msgId,
              prompt: message.prompt || '',
              role: 'img',
              sent: Date.now()
            } as unknown as Doc)
            .then(() => {
              setTimeout(() => {
                scrollDiv.current?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            })
        }
      } else {
        if (message.msg) {
          setIncomingMessage(message)
          scrollDiv.current?.scrollIntoView({ behavior: 'smooth' })
        }
        if (message.done) {
          database
            .put({ _id: message._id, msg: message.msg, sent: Date.now(), role: 'ai' })
            .then(() => {
              setIncomingMessage({ _id: '', msg: '', sent: Date.now() })
            })
        }
      }
    }
  })

  function sendMessage(formData: FieldValues) {
    socket.send(JSON.stringify(formData))
    database.put({ msg: formData.msg, sent: Date.now(), role: 'user' })
    resetField('msg')
  }

  useEffect(() => {
    setTimeout(() => {
      scrollDiv.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [messages])

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        <ImageBubble imgSrc={catImage} alt="Welcome photo" />
        <ChatBubble message="Hi, I'm Fluffy, welcome to cat chat. You can ask 'meow' anything. What do you want to know?" />

        {messages.map((message: MsgDoc) => {
          console.log('message', message)
          if (message.role === 'user') {
            return (
              <UserBubble
                message={message.msg as string}
                when={new Date(message.sent).toLocaleString()}
              />
            )
          } else if (message.role === 'img') {
            return <ImageBubble imgFile={message._files?.img as DocFileMeta} alt={message.prompt} />
          } else {
            return (
              <ChatBubble
                message={message.msg as string}
                when={new Date(message.sent).toLocaleString()}
              />
            )
          }
        })}

        {incomingMessage.msg && <ChatBubble message={incomingMessage.msg as string} />}
      </div>
      <div ref={scrollDiv} />

      <div className="bg-gray-300 p-4">
        <form onSubmit={handleSubmit(sendMessage)} className="flex items-center">
          <input
            {...register('msg')}
            className="flex-grow h-10 rounded px-3 text-sm"
            type="text"
            placeholder="Type your message…"
            autoComplete="off"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-3"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
