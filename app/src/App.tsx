import { BrowserRouter, Route, Routes } from 'react-router-dom'
import TabBar from './components/TabBar'
import MigrationScroll from './components/MigrationScroll'
import Home from './pages/Home'
import Record from './pages/Record'
import Silhouette from './pages/Silhouette'
import Review from './pages/Review'

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto flex h-full max-w-md flex-col">
        <main className="flex flex-1 flex-col overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/record" element={<Record />} />
            <Route path="/silhouette" element={<Silhouette />} />
            <Route path="/review" element={<Review />} />
          </Routes>
        </main>
        <TabBar />
        <MigrationScroll />
      </div>
    </BrowserRouter>
  )
}
