import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useFireproof, Doc, DocFileMeta } from 'use-fireproof'
// import { InlineEditor } from '../components/InlineEditor'
import { connect } from '@fireproof/partykit'

import { useForm, FieldValues } from 'react-hook-form'

import usePartySocket from 'partysocket/react'

import catImage from '../assets/cat.png'
import { ImageBubble, ChatBubble, UserBubble } from '../components/ChatBubbles'

type MsgData = { _id: string; msg?: string; prompt?: string; done?: boolean; sent: number }
type MsgDoc = Doc & MsgData

const PUBLIC_PARTYKIT_HOST = import.meta.env.VITE_PUBLIC_PARTYKIT_HOST

export function Chat() {
  const { id } = useParams<{ id: string }>()
  const dbName = id
  const { register, handleSubmit, resetField } = useForm()
  const { database, useLiveQuery } = useFireproof(dbName)

  connect.partykit(database, PUBLIC_PARTYKIT_HOST)

  const messages = useLiveQuery(
    (doc, emit) => {
      if (doc.sent) {
        emit(doc.sent)
      }
    },
    { limit: 100, descending: true }
  ).docs as MsgDoc[]

  // const messages = [...rmessages].reverse()

  const scrollableDivRef = useRef<
    HTMLDivElement & { scrollTo: (options: { top: number; behavior: 'smooth' }) => void }
  >(null)

  // const all = useLiveQuery('_id').docs

  const [incomingMessage, setIncomingMessage] = useState<MsgData>({
    _id: '',
    msg: '',
    sent: Date.now()
  })

  function scrollTo() {
    scrollableDivRef.current?.scrollTo({
      top: scrollableDivRef.current.scrollHeight
      // behavior: 'smooth'
    })
  }

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
          database.get(message._id).then(doc => {
            database.put({
              ...doc,
              prompt: message.prompt,
              _files: {
                img: file
              }
            } as unknown as Doc)
          })
        } else {
          database
            .put({
              _id: message._id,
              msgId: message.msgId,
              role: 'img',
              sent: message.sent
            } as unknown as Doc)
            .then(() => {
              scrollTo()
            })
        }
      } else {
        if (message.msg) {
          setIncomingMessage(message)
          scrollTo()
        }
        if (message.done) {
          database
            .put({ _id: message._id, msg: message.msg, sent: message.sent, role: 'ai' })
            .then(() => {
              scrollTo()
            })
        }
      }
    }
  })

  function sendMessage(formData: FieldValues) {
    const history = [...messages].map(({ msg, role }) => ({ msg, role }))
    formData.history = history.filter(({ msg, role }) => msg && role).reverse()
    socket.send(JSON.stringify(formData))
    database.put({ msg: formData.msg, sent: Date.now(), role: 'user' }).then(() => {
      setTimeout(() => {
        scrollTo()
      }, 100)
    })
    resetField('msg')
  }

  const rmessages = [...messages]
  if (incomingMessage._id) {
    if (!(rmessages.length && rmessages.find(({ _id }) => _id === incomingMessage._id))) {
      rmessages.unshift(incomingMessage)
    }
  }

  return (
    <>
      <div
        ref={scrollableDivRef}
        className="flex flex-col-reverse overflow-y-auto overflow-x-hidden p-4 pb-24"
      >

        {rmessages.map((message: MsgDoc) => {
          // console.log('message', message)
          if (message.role === 'user') {
            return (
              <UserBubble
              key={message._id}
                message={message.msg as string}
                when={new Date(message.sent).toLocaleString()}
              />
            )
          } else if (message.role === 'img') {
            return <ImageBubble key={message._id} imgFile={message._files?.img as DocFileMeta} alt={message.prompt} />
          } else {
            return (
              <ChatBubble
              key={message._id}
                message={message.msg as string}
                when={new Date(message.sent).toLocaleString()}
              />
            )
          }
        })}

        <ChatBubble message="Hi, I'm Fluffy, welcome to cat chat. You can ask 'meow' anything. What do you want to know?" />
        <ImageBubble imgSrc={catImage} alt="Welcome photo" />
      </div>

      <div className="fixed bottom-0 w-full bg-gray-300 p-4">
        <form onSubmit={handleSubmit(sendMessage)} className="flex items-center">
          <input
            {...register('msg')}
            className="flex-grow h-10 rounded px-3 text-lg"
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
    </>
  )
}
