import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';



function App() {


  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path='/inicio' element={<Home />} />
          
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
