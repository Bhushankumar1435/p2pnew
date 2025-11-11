import React from 'react'
import Header from './components/Header'
import Banner from './components/Banner'
import Reviews from './components/Reviews';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './components/Footer'


const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('auth_token'); // adjust this based on your auth logic

    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [navigate]);
  return (
    <>
      <Header />
      <Banner />
      <Reviews />
      <Footer />
    </>

  )
}

export default Home