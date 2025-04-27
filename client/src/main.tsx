import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LoginForm } from './components/login-form'
import { GoogleOAuthProvider } from '@react-oauth/google';
import Dashboard from './components/dashboard'
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import { isAuthenticated } from './protectedLoader';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: isAuthenticated() ? <Dashboard/> : <Navigate to="/login"/>,
      errorElement: <div>404 Not Found</div>
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/dashboard",
      element: isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />,
    }
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
