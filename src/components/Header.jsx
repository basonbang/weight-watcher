import React from 'react';
import { Outlet, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Header = () => {
  return (
    <div id='header' className='py-2'>
      <header className='flex justify-between items-center my-5 mx-3' >
        <Link to='/' className='flex justify-center items-center text-2xl px-5 hover:scale-105 transition duration-200 ease-in-out '>
          <img className='filter invert mr-4' src='\src\assets\icon\dumbbell.png' alt="A dumbbell icon" />
          <h1 className='font-semibold '>Weight Watchers</h1>
        </Link>
        <Link to='/create' className='px-5'>
          <Button className='bg-blue-500 hover:bg-blue-700 rounded-md text-white transition duration-200 ease-in-out'>Create Post</Button>
        </Link>
      </header>
      <Separator className='border-t-2 border-gray-900' />
      <div className='mt-6'>
        <Outlet />
      </div>
    </div>
  );
};

export default Header;
