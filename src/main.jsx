import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, Navigate  } from 'react-router';
import './index.css'
import App from './App.jsx'


import Dashboard from './page/Dashboard.jsx'
import OverviewLayout from './Layout/Overview.layout.jsx'
import MeetingPage from './Layout/Meeting.layout.jsx'
import AllCustomers from './Layout/AllCustomers.layout.jsx'
import AllServices from './Layout/AllServices.layout.jsx'
import ContactRequestsTable from './Layout/ContactRequestsTable.layout.jsx'
import WebContentedit from './Layout/WebContentedit.layout';
import QuotationManager from './Layout/QuotationManager.layout.jsx'
import FinancialCalculator from './Layout/FinancialCalculator.layout.jsx'







import LoginPage from './page/Login.jsx'

// Define the routes (Option 2)
const router = createBrowserRouter(
  createRoutesFromElements(

    <>
      {/* Main layout with Navbar & Footer */}
      <Route path="/" element={<App />}>
        {/* Redirect the root index route to /dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />
        {/* Dashboard with an index child for Overview */}
        <Route path="dashboard" element={<Dashboard />}>
          <Route index element={<OverviewLayout />} />
          <Route path="meeting" element={<MeetingPage />} />
          <Route path="customerslist" element={<AllCustomers />} />
          <Route path="serviceslist" element={<AllServices />} />
          <Route path="contactrequests" element={<ContactRequestsTable />} />
          <Route path="webcontentedit" element={<WebContentedit />} />
          <Route path="quotationmanager" element={<QuotationManager />} />
          <Route path="financialcalculator" element={<FinancialCalculator />} />
          {/* Add more nested routes here */}
        </Route>
        <Route path="login" element={<LoginPage />} />
      </Route>
    </>

  ),
  {
    future: {
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider  router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}/>
  </StrictMode>,
)
