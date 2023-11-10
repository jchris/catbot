import './App.css'
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Chat } from './pages/Chat'
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_PUBLIC_CLERK_PUBLISHABLE_KEY

function Layout({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col h-screen">{children}</div>
}

function App() {

  const routes = [
    { path: '/chat/:id', component: (<LoggedIn><Chat /></LoggedIn>) },
    { path: '/chat', component: React.createElement(ChatRedirect) },
    { path: '/profile', component: (<LoggedIn><Profile /></LoggedIn>) },
    { path: '/', component: React.createElement(Home) }
  ]

  return (
    <>
      <Routes>
        {routes.map(({ path, component }, index) => (
          <Route
            key={index}
            path={path}
            element={<Layout>{(component)}</Layout>}
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

function LoggedIn({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <h2>  Login</h2>
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  )
}
