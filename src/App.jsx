import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';
import NoMatch from './components/NoMatch';
import './App.css'

function App() {
  

  return (
    <div>
      <Routes>
        <Route path="/" element={<Header />} >
          <Route index element={<Home />} />
          <Route path="create" element={<CreatePost />} />
          <Route path=':id' element={<PostPage />} />
          <Route path=':id/edit' element={<EditPost />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
