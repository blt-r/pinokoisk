import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MoviesPage from '@/pages/MoviesPage.tsx';
import RootLayout from '@/components/RootLayout.tsx';
import FavoritesPage from '@/pages/FavoritesPage.tsx';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MoviesPage />,
      },
      {
        path: 'favorites',
        element: <FavoritesPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <RouterProvider router={router} />
  </StrictMode>
);
