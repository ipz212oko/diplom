import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router"
import { ChakraProvider } from "@/providers/ChakraProvider.jsx"
import App from './App.jsx'
import { AuthProvider } from "@/providers/AuthProvider.jsx";
import { Toaster } from "@/components/ui/toaster.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ChakraProvider>
          <App />
          <Toaster/>
        </ChakraProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
