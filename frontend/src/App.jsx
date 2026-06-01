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
import useAuthUser from "./hooks/useAuthUser.js";
import PageLoader from "./components/PageLoader.jsx";
import Layout  from './components/Layout.jsx'
import {useThemeStore} from './store/useThemeStore.js'
const App = () => {

 const { isLoading, authUser } = useAuthUser();

 const {theme}=useThemeStore();
  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

   if (isLoading) return <PageLoader />;

  return (
    <div className='h-screen' data-theme={theme}>
      <Routes>
 <Route path="/" element={ isAuthenticated && isOnboarded ? (
          <Layout>
                <HomePage />
            </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
         <Route path="/signup" element={ !isAuthenticated ? <SignupPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route path="/login" element={ !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
          }
        />
        <Route path="/call" element={ isAuthenticated  ? <CallPage/> : <Navigate to="/login"/>}/>
        <Route path="/chat" element={ isAuthenticated  ? <ChatPage/> : <Navigate to="/login"/>}/>
        <Route path="/notifications" element={ isAuthenticated  ? <NotificationsPage/> : <Navigate to="/login"/>}/>
          <Route path="/onboarding" element={ isAuthenticated ? ( !isOnboarded ? (
                <OnboardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App;