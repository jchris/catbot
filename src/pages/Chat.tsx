import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useFireproof, Doc } from 'use-fireproof'
import { InlineEditor } from '../components/InlineEditor'

import { useForm } from 'react-hook-form'

import usePartySocket from 'partysocket/react'

import catImage from '../assets/cat.png'

type MsgData = { _id: string; msg: string; done?: boolean }

const dbName = localStorage.getItem('dbName') || Math.random().toString(36).substring(2)
localStorage.setItem('dbName', dbName)

const PUBLIC_PARTYKIT_HOST = `127.0.0.1:1999`

export function Chat() {
  const { id } = useParams<{ id: string }>()
  const { register, handleSubmit, resetField } = useForm()
  const { database, useLiveQuery } = useFireproof(dbName)
  const scrollDiv = useRef(null);

  const messages = useLiveQuery((doc, emit) => {
    if (doc.msg && doc.sent) {
      emit(doc.sent)
    }
  }).docs

  // const all = useLiveQuery('_id').docs

  const [incomingMessage, setIncomingMessage] = useState<MsgData>({ _id: '', msg: '' })

  const socket = usePartySocket({
    host: PUBLIC_PARTYKIT_HOST,
    room: dbName,
    onOpen(e) {
      console.log('open', e)
    },
    onMessage(event: MessageEvent<string>) {
      const message = JSON.parse(event.data)
      setIncomingMessage(message)
      scrollDiv.current?.scrollIntoView({ behavior: 'smooth' });
      if (message.done) {
        database
          .put({ _id: message._id, msg: message.msg, sent: Date.now(), role: 'ai' })
          .then(() => {
            setIncomingMessage({ _id: '', msg: '' })
          })
      }
    }
  })

  function sendMessage(formData: { msg: string }) {
    socket.send(JSON.stringify(formData))
    database.put({ msg: formData.msg, sent: Date.now(), role: 'user' })
    resetField('msg')
  }

  useEffect(() => {
    scrollDiv.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  console.log('Chat', dbName, id, messages)



  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-auto p-4">
        <ChatBubble
          imgSrc={catImage}
          message="Hi, I'm Fluffy, welcome to cat chat. You can ask 'meow' anything. What do you want to know?"
        />

        <UserBubble message="Would you rather chase a mouse or yarn?" />

        {messages.map((message: Doc) =>
          message.role === 'user' ? (
            <UserBubble message={message.msg as string} />
          ) : (
            <ChatBubble message={message.msg as string} />
          )
        )}

        {incomingMessage.msg && <ChatBubble message={incomingMessage.msg as string} />}
        
        <div ref={scrollDiv} />
      </div>

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

type ChatBubbleProps = {
  imgSrc?: string
  message: string
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ imgSrc, message }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-sm">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
      <div>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          {imgSrc && <img className="mb-2 rounded" src={imgSrc} alt="Chat Bubble Image" />}
          <p className="text-sm">{message}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">2 min ago</span>
      </div>
    </div>
  )
}

type UserBubbleProps = {
  message: string
}

const UserBubble: React.FC<UserBubbleProps> = ({ message }) => {
  return (
    <div className="flex w-full mt-2 space-x-3 max-w-sm ml-auto justify-end">
      <div>
        <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">{message}</p>
        </div>
        <span className="text-xs text-gray-500 leading-none">2 min ago</span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
    </div>
  )
}
