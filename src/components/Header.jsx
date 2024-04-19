import React from 'react';
import { Outlet, Link } from 'react-router-dom'

const Header = () => {
  return (
    <>
      <header>
        {/* Your header content goes here */}
      </header>
      <div className='m-10'>
        <Outlet />
      </div>
    </>
  );
};

export default Header;
