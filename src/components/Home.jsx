import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { supabase } from '@/supabaseClient';

const Home = () => {

  const [posts, setPosts] = useState([])

  // read all posts from Supabase as soon as the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('Posts')
          .select()
        setPosts(data)
      } catch (error) {
        console.log('Error: ', error.message)
      }
    }
    fetchPosts()
  }, [])

  console.log(posts);
  return (
    <div>
      
      <div className='border-[6px] rounded-3xl border-gray-900 mx-56 flex flex-col justify-center items-center '>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
          {posts.map((post) => (
            <div key={post.id} className='border-2 border-gray-900 rounded-md p-4'>
              <h2 className='font-bold text-2xl'>{post.title}</h2>
              <p>{post.description}</p>
              <img src={post.content} alt='Post content' className='w-full h-48 object-cover' />
        
            </div>
          
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;