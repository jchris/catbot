import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Chat } from './pages/Chat'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}

function App() {
  const routes = [
    { path: '/chat/:id', component: Chat },
    { path: '/profile/:id', component: Profile },
    { path: '/', component: Home },
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
