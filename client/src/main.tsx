import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LoginForm } from './components/login-form'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './components/dashboard'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import ProtectedLayout from './protectedLayout';
import { isAuthenticated } from "./util"
const router = createBrowserRouter(
  [
    {
      path: "/",
      element: isAuthenticated() ? <Dashboard/> : <LoginForm/>
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      element: <ProtectedLayout />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ],
    },
  ]
)

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId='659250309505-vbt4pfffvsjnpjp73cfrmm3lc8nsapcg.apps.googleusercontent.com'>
    <StrictMode>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </StrictMode>
  </GoogleOAuthProvider>
  ,
)
