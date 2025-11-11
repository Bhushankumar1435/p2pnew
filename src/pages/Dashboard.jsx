import { useState, Fragment } from 'react';
import BellIcon from '../assets/svgs/notify_icon.svg'
import Header from '../components/Header';
import UsdtIcon from '../assets/images/usdt.png'
import Footer from '../components/Footer';
import Filter from '../components/Filter';
import Deal from '../components/Deal';
import Accept from '../components/Accept';
import { Link } from 'react-router-dom';
// import Deposite from './Saller/Deposite';
// import PaymentHistory from './Profile/PaymentHistory';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {  
  const [activeTab, setActiveTab] = useState("deal");
  // const [depositeList, setDepositeList] = useState();
  const navigate = useNavigate();
  
  return (    
          <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
            <div className="min-h-screen flex flex-col items-center bg-white text-black ">  
              <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)] '> 
                <Header />
                <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1] overflow-auto'>
                  <div className='w-full pt-3'>
                  {/* Tabs */}
                    <div className="flex items-center justify-around text-sm px-4">
                      <div className='flex-1 flex items-center gap-2'>
                      <div className='flex items-center p-1 border border-[var(--border-light)] rounded-lg'>
                      <button
                        className={`px-3 py-1 w-15 text-sm  rounded tracking-tighter font-medium ${activeTab === "deal" ? "bg-[#DCDCDC] text-black" : "text-[var(--tab-color)]"}`}
                        onClick={() => setActiveTab("deal")}
                      >
                        Deal
                      </button>
                      <button
                        className={`px-3 py-1 w-15 text-sm rounded tracking-tighter font-medium ${activeTab === "accept" ? "bg-[#DCDCDC] text-black" : "text-[var(--tab-color)]"}`}
                        onClick={() => setActiveTab("accept")}
                      >
                        Accept
                      </button>
                      </div>
                      {/* <span className="text-[var(--red)] text[15px] tracking-tighter font-medium">00:14:59 hrs</span> */}
                      </div>
                      <div className='shrink-0 flex items-center gap-2'>
                        <button className="text-sm bg-yellow-400 text-black px-1 py-[2px] rounded tracking-tighter font-medium">New Deals</button>
                        <button className='relative after:absolute after:top-0 after:right-[1px] after:w-2 after:h-2 after:bg-red-500 after:rounded-full'><img src={BellIcon} /></button>
                      </div>
                    </div>

                
                  <Filter />
                {/* Trade Card */}
                <div className='flex flex-col px-4'>
                {  activeTab === "deal" && ( <><Deal />  </>  ) }
                {activeTab === "accept" && ( <><Accept/></>)}
              </div>  
            </div>
                </div>
              </div>
              {/* Bottom Navigation */}
              <Footer />
            </div>
          </div>
        );
}
  export default Dashboard;