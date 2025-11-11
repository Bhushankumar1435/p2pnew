import React from 'react'
import Logo from './assets/svgs/logo.svg'
import SplashLogo from './assets/images/main_logo.png'
import { Link } from 'react-router-dom';


const Splash = () => {
  return (
    <div className='max-w-[600px] mx-auto'>
      <div className="bg-gradient-to-b from-[var(--gradient-1)] to-[var(--gradient-2)] text-black dark:text-white text-center h-screen px-4 flex flex-col justify-between pt-16 pb-10">
          <div className='w-full'>
              <img src={Logo} className='inline-block' />
              <div className='mt-10'>
                  <p className='text-lg font-normal text-black leading-6'>Peer Power in Your Pocket</p>
                  <p className='text-lg font-normal text-black leading-6'>Send. Receive. Earn.</p>
              </div>
          </div>
          <img src={SplashLogo} className='inline-block w-[325px] mx-auto' />
          <div className='w-full flex flex-col gap-4'>
          <Link to="/login" className='w-full block rounded-xl py-3 px-4 text-base leading-5 bg-gradient-to-r from-[var(--button-gradient-1)] to-[var(--button-gradient-2)] text-black'>Sign in</Link>

          <Link to="/signup" className='w-full block rounded-xl py-3 px-4 text-base leading-5 border border-[var(--border-color)] text-black'>Sign up</Link>    
          </div>
      </div>
    </div>
  )
}

export default Splash
