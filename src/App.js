import React from 'react'
import {BrowserRouter as Router, Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom'
import LandingPage from "./pages/Landingpage";
import { ChakraProvider} from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
  </ChakraProvider>
  );
}

export default App;
