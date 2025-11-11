

import React from 'react';

import ComingSoon from '../../components/ComingSoon';
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function account() {
    return (

        <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
            <div className="min-h-screen flex flex-col items-center bg-white text-black ">
                <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '>
                    <Header />
                    <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
                        <div className='w-full pt-3'>
                            <div className="flex items-center justify-center align-items-center mt-auto ">
                                <ComingSoon />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>

    )
}
