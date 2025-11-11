import React from 'react';
import ComingSoon from '../../components/ComingSoon';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Account() {
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.getElementById('walletInput').value = text;
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  return (
    <div className='max-w-[600px] mx-auto w-full bg-[var(--primary)]'>
      <div className="min-h-screen flex flex-col items-center bg-white text-black">
        <div className='h-[calc(100vh_-_56px)] overflow-auto w-full bg-[var(--primary)]'>
          <Header />
          <div className='w-full bg-[var(--primary)] rounded-t-xl relative z-[1]'>
            <div className='w-full pt-3'>


              <h1 className="text-base font-semibold px-4 pb-3 border-b border-gray-400">
                Wallet Address
              </h1>
              <div className="w-full space-y-4 px-4 mt-4">
                <label className="block text-sm text-gray-700">Enter Address (Bep20)</label>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white">
                  <input
                    type="text"
                    id="walletInput"
                    className="w-full px-4 py-3 text-sm focus:outline-none"
                    placeholder="Enter your wallet address"
                  />
                  <button
                    type="button"
                    className="px-4 text-sm text-blue-600 hover:text-blue-800"
                    onClick={handlePaste}
                  >
                    Paste
                  </button>
                </div>
                <button className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition">
                  Save
                </button>
              </div>

              {/* Withdraw Section */}
              {/* <div className="mt-8 bg-white rounded-xl shadow-md border border-gray-200 mx-4">
                <div className="px-6 py-4 border-b">
                  <h2 className="text-sm font-semibold text-gray-800">Withdraw</h2>
                </div>
                <div className="px-6 py-4 bg-blue-50 flex justify-between items-center rounded-md m-4">
                  <span className="text-sm text-gray-600">Available amount</span>
                  <span className="text-base font-semibold text-gray-900">$105</span>
                </div>
                <div className="px-6 pb-6">
                  <button className="w-full py-2 text-white font-semibold rounded-md bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 transition">
                    Withdraw
                  </button>
                </div>
              </div> */}

            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}


