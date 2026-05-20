import { BrowserRouter, Routes, Route } from 'react-router-dom'
import QueuePage from './pages/QueuePage'
import LinkedListPage from './pages/LinkedListPage'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QueuePage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="/linked-list" element={<LinkedListPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
