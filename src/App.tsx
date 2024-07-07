import { QueryClientProvider, QueryClient } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Home from "./pages/Home";
import RootLayout from './pages/RootLayout';
import Authenticate from './pages/Authenticate';
import AuthContextProvider from './components/AuthContextProvider';

const theme = createTheme({
  palette: {
    mode: 'dark',
  }
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <h1>Error 404! Not found!</h1>,
    children: [
      {
        path: "/",
        element: <Authenticate />,
        errorElement: <h1>Error! Can{"'"}t authenticate</h1>,
        children: [
          {
            path: "/",
            element: <Home />,
            errorElement: <h1>Error! Can{"'"}t load the home</h1>,
          }
        ],
      }
    ]
  }
])


export default function App() {
  const queryClient = new QueryClient();
  return (
    <AuthContextProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthContextProvider>
  )
}