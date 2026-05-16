import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router.tsx'
import { UserProvider } from './context/UserProvider.tsx'
import { CarritoComprasProvider, CarritoVentasProvider } from './context/CarritoContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <CarritoComprasProvider>
        <CarritoVentasProvider>
          <RouterProvider router={router} />
        </CarritoVentasProvider>
      </CarritoComprasProvider>
    </UserProvider>
  </StrictMode>,
)
