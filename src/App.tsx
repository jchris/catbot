import './App.css'
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
// import { Home } from './pages/Home'
// import { Profile } from './pages/Profile'
import { Chat } from './pages/Chat'

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-screen">{children}</div>
}

function App() {
  const routes = [
    { path: '/chat/:id', component: Chat },
    { path: '/chat', component: ChatRedirect },
    // { path: '/profile/:id', component: Profile },
    { path: '/', component: ChatRedirect }
  ]

  return (
    <>
      <Routes>
        {routes.map(({ path, component }, index) => (
          <Route
            key={index}
            path={path}
            element={<Layout>{React.createElement(component)}</Layout>}
          />
        ))}
      </Routes>
    </>
  )
}

export default App

function ChatRedirect() {
  const newId = Math.random().toString(36).substring(2)
  useEffect(() => {
    window.location.href = `/chat/${newId}`
  }, [])
}
