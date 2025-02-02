import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import routing from './routes/Routing.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import store from './utils/Store/Store.ts'

const routes = createBrowserRouter(
  createRoutesFromElements(
    routing
  )
)

const reactQuery = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <QueryClientProvider client={reactQuery}>
      <RouterProvider router={routes} />
    </QueryClientProvider>
  </Provider>
)