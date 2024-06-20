import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./pages/home.tsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import store from "./store.ts";
import ErrorPage from "./pages/error-page.tsx";
import Submit from "./pages/submit.tsx";
import CommunityPage from "./pages/communityPage.tsx";
import Layout from "./pages/layout.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "h/:communityId",
        errorElement: <ErrorPage />,
        element: <CommunityPage />,
      },
      {
        path: "h/:communityId/submit",
        errorElement: <ErrorPage />,
        element: <Submit />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <Toaster />
        <RouterProvider router={router} />
      </ChakraProvider>
    </Provider>
  </React.StrictMode>,
);
