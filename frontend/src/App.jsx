import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CallPage from './pages/CallPage.jsx'
import ChatPage from './pages/ChatPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import OnboardingPage from './pages/OnboardingPage.jsx'
import { Toaster } from 'react-hot-toast'
import { axiosInstance } from './lib/axios.js'
import { useQuery } from '@tanstack/react-query'
import { Navigate } from 'react-router'

const App = () => {

  const { data: authData, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
      } catch (error) {
        if (error.response?.status === 401) return null;
        throw error;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  // ✅ THIS LINE WAS MISSING — defines authUser from authData
  const authUser = authData?.user;

  // ✅ Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className='h-screen'>
      <Routes>
        <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/"/>}/>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}/>
        <Route path="/call" element={authUser ? <CallPage/> : <Navigate to="/login"/>}/>
        <Route path="/chat" element={authUser ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path="/notifications" element={authUser ? <NotificationsPage/> : <Navigate to="/login"/>}/>
        <Route path="/onboarding" element={authUser ? <OnboardingPage/> : <Navigate to="/login"/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App;