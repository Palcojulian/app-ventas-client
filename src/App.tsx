import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';
import { QueryProvider } from './providers/QueryProvider';

function App() {

  return (
    <QueryProvider>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path='/inicio' element={<Home />} />

          </Routes>
        </MainLayout>
      </BrowserRouter>
    </QueryProvider>
  )
}

export default App
