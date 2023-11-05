// pages/Item.tsx

import { Link, useParams } from 'react-router-dom'
import { useFireproof } from 'use-fireproof'
import { InlineEditor } from '../components/InlineEditor'

import usePartySocket from 'partysocket/react'

const dbName = localStorage.getItem('dbName') || Math.random().toString(36).substring(2)
localStorage.setItem('dbName', dbName)

const PUBLIC_PARTYKIT_HOST=`127.0.0.1:1999`

export function Chat() {
  const { id } = useParams<{ id: string }>()
  const { database } = useFireproof(dbName)

  const socket = usePartySocket({
    host : PUBLIC_PARTYKIT_HOST,
    room : dbName,
    onOpen(e) {
      console.log('open', e)
    },
    onMessage(event: MessageEvent<string>) {
      const message = JSON.parse(event.data)
      console.log('message', message)
    }
  })

  console.log('Chat', socket, dbName, id)

  return (
    <div className="w-screen h-screen">
      <div className="flex flex-col flex-grow p-4 overflow-auto">
        <div className="flex w-full mt-2 space-x-3 max-w-sm">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
          <div>
            <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
              <p className="text-sm">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.{' '}
              </p>
            </div>
            <span className="text-xs text-gray-500 leading-none">2 min ago</span>
          </div>
        </div>
        <div className="flex w-full mt-2 space-x-3 max-w-sm ml-auto justify-end">
          <div>
            <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
              <p className="text-sm">Lorem ipsum dolor sit.</p>
            </div>
            <span className="text-xs text-gray-500 leading-none">2 min ago</span>
          </div>
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300"></div>
        </div>
      </div>

      <div className="fixed bottom-0 w-full bg-gray-300 p-4">
        <input
          className="flex items-center h-10 w-full rounded px-3 text-sm"
          type="text"
          placeholder="Type your message…"
        />
      </div>
    </div>
  )
}
