import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Home from './pages/home.tsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar/Navbar.tsx';
import store from './store.ts';
import Community from './pages/community.tsx';
import ErrorPage from './pages/error-page.tsx';
import Submit from './pages/submit.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "h/:communityId",
    errorElement: <ErrorPage />,
    element: <Community />,
  },
  {
    path: "h/:communityId/submit",
    errorElement: <ErrorPage />,
    element: <Submit />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <Toaster />
        <Navbar />
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
)
