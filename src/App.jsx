import { Routes, Route } from 'react-router-dom';
import { generateUsername } from 'unique-username-generator';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage';
import EditPost from './components/EditPost';
import NoMatch from './components/NoMatch';
import './App.css'

function App() {

  const [username, setUserName] = useState('');

  // generate a random username as soon as component mounts
  useEffect(() => {
    const generatedUsernames = [generateUsername("_", 0, 25), generateUsername("", 0, 25), generateUsername("", 0, 12)]
    setUserName(generatedUsernames[Math.floor(Math.random() * generatedUsernames.length)]);
  }, [])
  

  return (
    <div>
      <Routes>
        <Route path="/" element={<Header username={username}/>} >
          <Route index element={<Home />} />
          <Route path="create" element={<CreatePost username={username}/>} />
          <Route path=':id' element={<PostPage username={username}/>} />
          <Route path=':id/edit' element={<EditPost />} />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
