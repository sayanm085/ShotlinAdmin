// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate
} from 'react-router'
import './index.css'
import App from './App.jsx'

import Dashboard from './page/Dashboard.jsx'
import OverviewLayout from './Layout/Overview.layout.jsx'
import MeetingPage from './Layout/Meeting.layout.jsx'
import AllCustomers from './Layout/AllCustomers.layout.jsx'

import AllServices from './Layout/AllServices.layout.jsx'

import ContactRequestsTable from './Layout/ContactRequestsTable.layout.jsx'
// import ContactReply from './Layout/ContactReply.layout.jsx'

import WebContentedit from './Layout/WebContentedit.layout'
import QuotationManager from './Layout/QuotationManager.layout.jsx'
import FinancialCalculator from './Layout/FinancialCalculator.layout.jsx'
import ServicesUpload from './Layout/ServicesUpload.layout.jsx'
import LoginPage from './page/Login.jsx'

// React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistQueryClient } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'

// 1️⃣ Create QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

// 2️⃣ Set up localStorage persister
const persister = createSyncStoragePersister({ storage: window.localStorage })

// 3️⃣ Persist cache
persistQueryClient({ queryClient, persister })

// 4️⃣ Define routes
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<OverviewLayout />} />
          <Route path="meeting" element={<MeetingPage />} />
          <Route path="customerslist" element={<AllCustomers />} />
          <Route path="serviceslist" element={<AllServices />} />
          <Route path="contactrequests" element={<ContactRequestsTable />} />

          <Route path="webcontentedit" element={<WebContentedit />} />
          <Route path="quotationmanager" element={<QuotationManager />} />
          <Route path="financialcalculator" element={<FinancialCalculator />} />
          <Route path="servicesupload" element={<ServicesUpload />} />
          <Route path="servicesedit/:id" element={<ServicesUpload />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </>
  )
)

// 5️⃣ Render
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
)
