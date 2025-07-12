import CssBaseline from '@mui/material/CssBaseline';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import MoviesPage from '@/pages/MoviesPage.tsx';
import RootLayout from '@/pages/RootLayout';
import FavoritesPage from '@/pages/FavoritesPage.tsx';
import NotFoundPage from '@/pages/NotFoundPage';
import MovieDetailsPage from '@/pages/MovieDetailsPage';

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
        path: 'movie/:id',
        element: <MovieDetailsPage />,
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
