import React from 'react'
import illustration from '../assets/images/shape1.png'
import coins from '../assets/images/shape-2.png'

const Banner = () => {
  return (
    <>
      <section className="text-white w-full top_banner !bg-cover !bg-bottom">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-32 flex flex-col lg:flex-row items-center justify-between">
          {/* Left: Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
              C-P2P Makes Trading Easier!
            </h1>
            <p className="text-white text-lg md:text-xl mb-8">
              P2P crypto trading enables individuals to exchange cryptocurrencies with each other directly, without using a central authority or broker.
            </p>

            {/* Input + Buttons */}
            <div className="flex  flex-col sm:flex-row items-center gap-4">
              {/* <div className='flex items-center rounded-sm overflow-hidden'>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full sm:w-72 px-4 py-3 rounded-s-md  text-black bg-white placeholder-gray-500"
            />
            <button className="w-full sm:w-auto rounded-e-md  bg-yellow-400 text-black font-semibold px-6 py-3 hover:bg-yellow-300 transition">
              Sign Up
            </button>
            </div>
            
            <button className="w-full sm:w-auto border border-white text-white font-semibold px-6 py-3 rounded-md hover:bg-white hover:text-blue-800 transition">
              Sign In
            </button> */}
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="w-full lg:w-1/2 mb-0 mt-32 lg:mt-0 relative">
            <img
              src={coins}
              alt="Robot illustration"
              className="w-full max-w-md mx-auto absolute left-[calc(50%_-_140px)] md:left-[calc(50%_-_190px)] -top-10 -z-0 animate-float"
            />
            <img
              src={illustration}
              alt="Robot illustration"
              className="w-full max-w-md mx-auto relative z-1 animate-pulse-scale"
            />
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto mb-10 px-4 relative">
          <div className='w-full flex flex-col lg:flex-row items-center justify-between'>
            <h2 className="text-4xl md:text-7xl font-bold text-[var(--bg-color)] ">
              Why Crypto P2P
            </h2>
            <div className="flex flex-col md:flex-row mt-5 lg:mt-0 md:items-center gap-16 text-center">
              {/* USERS */}
              <div className="flex flex-col items-center">
                <span className="text-yellow-500 text-5xl font-bold">2M+</span>
                <span className="text-black text-base font-semibold">USERS</span>
              </div>

              {/* PROFIT */}
              <div className="flex flex-col items-center">
                <span className="text-yellow-500 text-5xl font-bold">184M+</span>
                <span className="text-black text-base font-semibold">TOTAL PROFIT</span>
              </div>

              {/* COUNTRIES */}
              <div className="flex flex-col items-center">
                <span className="text-yellow-500 text-5xl font-bold">200+</span>
                <span className="text-black text-base font-semibold">COUNTRIES/AREAS</span>
              </div>
            </div>
            <div className='absolute right-0 -top-20 lg:-top-40  w-[700px] h-[410px] !bg-cover map-globe'></div>
          </div>
          <div className='mt-24'>
            <div className='max-w-5xl mx-auto text-justify'>
              <p className='text-lg leading-8 text-[var(--text-color)]'>Crypto P2P (peer-to-peer) trading is the process of buying and selling cryptocurrencies directly between users, without relying on a centralized exchange or third-party intermediary.</p><p className='text-lg leading-8 text-[var(--text-color)]'>
                Instead of placing an order in a traditional exchange's order book, P2P trading allows users to connect with one another directly, agree on a price, and execute the transaction—usually with the help of a platform that provides escrow and dispute resolution services.</p></div>
            <h4 className='text-xl font-bold text-black my-5'>Some popular P2P platforms include:</h4>
            <div className='flex items-center gap-10'>
              <div className='system_box'>
                <div className='group border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full bg-white hover:bg-gray-100'>
                  <div className="flex h-6 flex-row items-center space-x-2.5 md:h-8 lg:w-[138px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 32 32"
                      className="aspect-square size-6 md:size-8"

                    >
                      <path
                        fill="#C9F24D"
                        d="M0 26.5A5.5 5.5 0 0 1 5.5 21H11v11H5.5A5.5 5.5 0 0 1 0 26.5M11 0h10.5C27.299 0 32 4.701 32 10.5S27.299 21 21.5 21H11z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 103 34"
                      className="h-full text-foreground md:inline"

                    >
                      <g fill="currentColor">
                        <path d="M102.625 0h-4.55v27.2h4.55z" />
                        <path
                          fillRule="evenodd"
                          d="M20.047 17.378c0 5.633-3.131 10.2-8.68 10.2-2.862 0-5.153-1.628-6.192-2.98V34H.625V7.556h4.55v2.602c1.04-1.353 3.33-2.98 6.192-2.98 5.549 0 8.68 4.567 8.68 10.2m-4.562-.006c0 3.52-2.352 6.375-5.254 6.375s-5.254-2.854-5.254-6.375 2.352-6.375 5.254-6.375 5.254 2.854 5.254 6.375"
                          clipRule="evenodd"
                        />
                        <path d="M81.455 7.556h-4.55V20.95c0 3.451 2.04 6.627 6.242 6.627 3.075 0 5.085-1.29 6.212-3.184V27.2h4.55V7.556h-4.55V18.35c0 2.069-1.146 4.844-4.203 5.05-2.473.165-3.7-1.526-3.7-3.907zM74.553 3.953V0H71.91c-.7 0-1.051 0-1.346.03a6.04 6.04 0 0 0-5.418 5.422 7 7 0 0 0-.026.592h-.003V27.2h4.55V12.089h4.305V7.556H69.67c0-1.058 0-2.168.205-2.572.181-.355.47-.644.825-.825.404-.206.932-.206 1.989-.206z" />
                        <path
                          fillRule="evenodd"
                          d="M23.211 13.978h4.585c.03-1.45.819-3.544 4.41-3.544 3.627 0 3.834 1.318 3.83 2.554l-.001.127c0 .751-.134 1.308-.84 1.849-.703.538-1.742.559-2.679.578h-.015q-.41.008-.823.013h-.001c-1.763.024-3.586.049-5.267.554-2.971.892-4.665 3.293-4.099 6.747.25 1.502 1.65 4.91 6.793 4.91 3.717 0 6.137-1.727 6.996-2.976v2.41h4.55V16.244l.002-.674v-.005q.002-.373.006-.736c.045-4.335.08-7.651-8.535-7.651-5.865 0-8.682 2.89-8.912 6.8m3.757 7.957c-.077-1.69.98-2.99 3.19-3.278a18 18 0 0 1 1.852-.218c.703-.052 1.63-.105 2.425-.237 1.514-.299 1.833-.755 1.833-.755v1.495c0 3.863-3 5.704-5.693 5.704-1.974 0-3.513-.953-3.607-2.711"
                          clipRule="evenodd"
                        />
                        <path d="M62.617 7.49h-5.254l-4.484 6.232-4.484-6.231H43.14l7.111 9.88-7.111 9.882h5.254l4.484-6.231 4.484 6.231h5.254l-7.111-9.881z" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              <div className='system_box'>
                <div className='group border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full bg-white hover:bg-gray-100'>
                  <div className="flex h-6 flex-row items-center space-x-2.5 md:h-8 lg:w-[138px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 32 32"
                      className="aspect-square size-6 md:size-8"

                    >
                      <path
                        fill="#C9F24D"
                        d="M0 26.5A5.5 5.5 0 0 1 5.5 21H11v11H5.5A5.5 5.5 0 0 1 0 26.5M11 0h10.5C27.299 0 32 4.701 32 10.5S27.299 21 21.5 21H11z"
                      />
                    </svg>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 103 34"
                      className="h-full text-foreground md:inline"

                    >
                      <g fill="currentColor">
                        <path d="M102.625 0h-4.55v27.2h4.55z" />
                        <path
                          fillRule="evenodd"
                          d="M20.047 17.378c0 5.633-3.131 10.2-8.68 10.2-2.862 0-5.153-1.628-6.192-2.98V34H.625V7.556h4.55v2.602c1.04-1.353 3.33-2.98 6.192-2.98 5.549 0 8.68 4.567 8.68 10.2m-4.562-.006c0 3.52-2.352 6.375-5.254 6.375s-5.254-2.854-5.254-6.375 2.352-6.375 5.254-6.375 5.254 2.854 5.254 6.375"
                          clipRule="evenodd"
                        />
                        <path d="M81.455 7.556h-4.55V20.95c0 3.451 2.04 6.627 6.242 6.627 3.075 0 5.085-1.29 6.212-3.184V27.2h4.55V7.556h-4.55V18.35c0 2.069-1.146 4.844-4.203 5.05-2.473.165-3.7-1.526-3.7-3.907zM74.553 3.953V0H71.91c-.7 0-1.051 0-1.346.03a6.04 6.04 0 0 0-5.418 5.422 7 7 0 0 0-.026.592h-.003V27.2h4.55V12.089h4.305V7.556H69.67c0-1.058 0-2.168.205-2.572.181-.355.47-.644.825-.825.404-.206.932-.206 1.989-.206z" />
                        <path
                          fillRule="evenodd"
                          d="M23.211 13.978h4.585c.03-1.45.819-3.544 4.41-3.544 3.627 0 3.834 1.318 3.83 2.554l-.001.127c0 .751-.134 1.308-.84 1.849-.703.538-1.742.559-2.679.578h-.015q-.41.008-.823.013h-.001c-1.763.024-3.586.049-5.267.554-2.971.892-4.665 3.293-4.099 6.747.25 1.502 1.65 4.91 6.793 4.91 3.717 0 6.137-1.727 6.996-2.976v2.41h4.55V16.244l.002-.674v-.005q.002-.373.006-.736c.045-4.335.08-7.651-8.535-7.651-5.865 0-8.682 2.89-8.912 6.8m3.757 7.957c-.077-1.69.98-2.99 3.19-3.278a18 18 0 0 1 1.852-.218c.703-.052 1.63-.105 2.425-.237 1.514-.299 1.833-.755 1.833-.755v1.495c0 3.863-3 5.704-5.693 5.704-1.974 0-3.513-.953-3.607-2.711"
                          clipRule="evenodd"
                        />
                        <path d="M62.617 7.49h-5.254l-4.484 6.232-4.484-6.231H43.14l7.111 9.88-7.111 9.882h5.254l4.484-6.231 4.484 6.231h5.254l-7.111-9.881z" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='mt-24 flex flex-col lg:flex-row flex-wrap justify-center'>
            <div className='system_box  px-4 mb-8 '>
              <div className='group border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg className='scale-90 group-hover:scale-100' width="80px" height="80px" viewBox="0 0 48 48" version="1" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 48 48">
                  <path fill="#424242" d="M24,4c-5.5,0-10,4.5-10,10v4h4v-4c0-3.3,2.7-6,6-6s6,2.7,6,10v4h4v-4C34,8.5,29.5,4,24,4z" />
                  <path fill="#FB8C00" d="M36,44H12c-2.2,0-4-1.8-4-4V22c0-2.2,1.8-4,4-4h24c2.2,0,4,1.8,4,4v18C40,42.2,38.2,44,36,44z" />
                  <circle fill="#C76E00" cx="24" cy="31" r="3" />
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>Trustworthy</h4>
                <p className='text-center'>No access to your funds.</p>
              </div>
            </div>

            <div className='system_box px-4 mb-8'>
              <div className='border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg
                  width="80px"
                  height="80px"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"

                >
                  <path
                    d="M5 8.5C5 8.22386 5.22386 8 5.5 8C5.77614 8 6 8.22386 6 8.5C6 8.77614 5.77614 9 5.5 9C5.22386 9 5 8.77614 5 8.5Z"
                    fill="#424242"
                  />
                  <path
                    d="M9 8.5C9 8.22386 9.22386 8 9.5 8C9.77614 8 10 8.22386 10 8.5C10 8.77614 9.77614 9 9.5 9C9.22386 9 9 8.77614 9 8.5Z"
                    fill="#424242"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 2.02242C10.8033 2.27504 13 4.63098 13 7.5V13.5C13 14.3284 12.3284 15 11.5 15H3.5C2.67157 15 2 14.3284 2 13.5V7.5C2 4.63098 4.19675 2.27504 7 2.02242V0H8V2.02242ZM5.5 7C4.67157 7 4 7.67157 4 8.5C4 9.32843 4.67157 10 5.5 10C6.32843 10 7 9.32843 7 8.5C7 7.67157 6.32843 7 5.5 7ZM9.5 7C8.67157 7 8 7.67157 8 8.5C8 9.32843 8.67157 10 9.5 10C10.3284 10 11 9.32843 11 8.5C11 7.67157 10.3284 7 9.5 7ZM11 12H4V11H11V12Z"
                    fill="#FB8C00"
                  />
                  <path d="M0 8V12H1V8H0Z" fill="#424242" />
                  <path d="M15 8H14V12H15V8Z" fill="#424242" />
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>System Serves 24x7</h4>
                <p className='text-center'>The system operates 24/7, allowing you to trade your crypto in a secure environment.</p>
              </div>
            </div>

            <div className='system_box px-4 mb-8'>
              <div className='border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 297 297"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  enableBackground="new 0 0 297 297"
                  width="80px"
                  height="80px"
                >
                  <g>
                    <path d="m129.411,77.855v-52.154h-95.818c-7.428,0-13.471,6.043-13.471,13.472v54.265c0,6.664 4.981,12.396 11.587,13.334l4.201,.596 1.457,3.986c1.903,5.209 6.912,8.71 12.463,8.71 5.484,0 10.473-3.447 12.411-8.577l1.731-4.578h66.502c3.449,0 6.596-1.305 8.979-3.445-6.227-6.736-10.042-15.734-10.042-25.609z" fill="#424242" />
                    <path d="m167.168,101.445h59.289l2.113,3.041c4.401,6.333 11.595,10.114 19.241,10.114 8.158,0 15.847-4.358 20.066-11.374l1.33-2.211 2.438-.838c9.565-3.287 15.993-12.258 15.993-22.322v-54.264c0.001-13.008-10.582-23.591-23.59-23.591h-96.881c-13.008,0-23.59,10.583-23.59,23.591v54.265c0.001,13.007 10.583,23.589 23.591,23.589zm69.579-60.341c1.893-1.883 4.492-2.966 7.153-2.966 2.673,0 5.272,1.083 7.165,2.966 1.882,1.882 2.965,4.492 2.965,7.153 0,2.662-1.083,5.263-2.965,7.155-1.893,1.882-4.492,2.964-7.165,2.964-2.661,0-5.261-1.082-7.153-2.964-1.883-1.883-2.955-4.493-2.955-7.155 0-2.67 1.072-5.271 2.955-7.153zm-27.13,0c1.882-1.883 4.493-2.966 7.154-2.966s5.273,1.083 7.154,2.966c1.893,1.882 2.965,4.492 2.965,7.153 0,2.662-1.072,5.263-2.965,7.155-1.882,1.882-4.493,2.964-7.154,2.964s-5.272-1.082-7.154-2.964c-1.882-1.883-2.965-4.493-2.965-7.155 0-2.67 1.083-5.271 2.965-7.153zm-27.13,0c1.883-1.883 4.492-2.966 7.154-2.966s5.273,1.083 7.154,2.966c1.883,1.882 2.966,4.492 2.966,7.153 0,2.662-1.083,5.263-2.966,7.155-1.882,1.882-4.492,2.964-7.154,2.964s-5.271-1.082-7.154-2.964c-1.883-1.883-2.965-4.493-2.965-7.155 0-2.67 1.082-5.271 2.965-7.153z" fill="#FB8C00" />
                    <path d="m67.545,226.037c23.993,0 43.513-19.52 43.513-43.514 0-23.992-19.519-43.512-43.513-43.512-23.992,0-43.513,19.52-43.513,43.512 0.001,23.994 19.521,43.514 43.513,43.514z" />
                    <path d="m121.066,258.879c-4.515-18.061-22.635-32.208-41.251-32.208h-24.539c-18.616,0-36.735,14.148-41.251,32.208l-6.387,25.547c-0.756,3.024-0.077,6.227 1.841,8.683 1.918,2.456 4.86,3.892 7.977,3.892h100.181c3.115,0 6.059-1.435 7.976-3.892 1.918-2.456 2.597-5.658 1.841-8.683l-6.388-25.547z" fill="#424242" />
                    <path d="m289.362,284.427l-5.741-22.968c-4.168-16.67-20.893-29.729-38.077-29.729h-22.061c-17.184,0-33.909,13.059-38.077,29.729l-5.741,22.967c-0.756,3.023-0.077,6.226 1.841,8.682 1.917,2.456 4.86,3.892 7.977,3.892h90.063c3.116,0 6.06-1.435 7.977-3.892 1.916-2.456 2.595-5.658 1.839-8.681z" fill="#FB8C00" />
                    <path d="m234.513,144.577c-20.925,0-37.947,17.022-37.947,37.946 0,20.925 17.022,37.947 37.947,37.947s37.947-17.023 37.947-37.947c0.001-20.923-17.022-37.946-37.947-37.946z" fill="#FB8C00" />

                  </g>
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>Privacy Assured</h4>
                <p className='text-center'>Your privacy is protected, and your crypto assets are stored securely in your own wallet.</p>
              </div>
            </div>

            <div className='system_box px-4 mb-8'>
              <div className='border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg
                  id="Trophy_x5F_cup"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  x="0px"
                  y="0px"
                  width="80px"
                  height="80px"
                  viewBox="0 0 256 256"
                  enableBackground="new 0 0 256 256"
                  xmlSpace="preserve"

                >
                  <path d="M190.878,111.272c31.017-11.186,53.254-40.907,53.254-75.733l-0.19-8.509h-48.955V5H64.222v22.03H15.266l-0.19,8.509 c0,34.825,22.237,64.546,53.254,75.733c7.306,18.421,22.798,31.822,41.878,37.728v20c-0.859,15.668-14.112,29-30,29v18h-16v35H195 v-35h-16v-18c-15.888,0-29.141-13.332-30-29v-20C168.08,143.094,183.572,129.692,190.878,111.272z M195,44h30.563 c-0.06,0.427-0.103,1.017-0.171,1.441c-3.02,18.856-14.543,34.681-30.406,44.007C195.026,88.509,195,44,195,44z M33.816,45.441 c-0.068-0.424-0.111-1.014-0.171-1.441h30.563c0,0-0.026,44.509,0.013,45.448C48.359,80.122,36.837,64.297,33.816,45.441z  M129.604,86.777l-20.255,13.52l6.599-23.442L96.831,61.77l24.334-0.967l8.44-22.844l8.44,22.844l24.334,0.967L143.26,76.856 l6.599,23.442L129.604,86.777z" fill="#FB8C00" />
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>Win-win</h4>
                <p className='text-center'>Seller and Buyer both make profit from the trades</p>
              </div>
            </div>

            <div className='system_box px-4 mb-8'>
              <div className='border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg
                  width="80px"
                  height="80px"
                  viewBox="0 0 28 28"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"

                >
                  <title>{"ic_fluent_people_community_28_filled"}</title>
                  <desc>{"Created with Sketch."}</desc>
                  <g
                    id="\uD83D\uDD0D-Product-Icons"
                    stroke="none"
                    strokeWidth={1}
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="ic_fluent_people_community_28_filled"
                      fill="#212121"
                      fillRule="nonzero"
                    >
                      <path
                        d="M17.75,18 C18.7164983,18 19.5,18.7835017 19.5,19.75 L19.5,21.7519766 L19.4921156,21.8604403 C19.1813607,23.9866441 17.2715225,25.0090369 14.0667905,25.0090369 C10.8736123,25.0090369 8.93330141,23.9983408 8.51446278,21.8965776 L8.5,21.75 L8.5,19.75 C8.5,18.7835017 9.28350169,18 10.25,18 L17.75,18 Z M18.2439108,11.9999135 L24.25,12 C25.2164983,12 26,12.7835017 26,13.75 L26,15.7519766 L25.9921156,15.8604403 C25.6813607,17.9866441 23.7715225,19.0090369 20.5667905,19.0090369 L20.3985759,19.007437 C20.0900029,17.9045277 19.1110503,17.0815935 17.9288034,17.0057197 L17.75,17 L16.8277704,17.0007255 C17.8477843,16.1757619 18.5,14.9140475 18.5,13.5 C18.5,12.9740145 18.4097576,12.4691063 18.2439108,11.9999135 Z M3.75,12 L9.75608915,11.9999135 C9.59024243,12.4691063 9.5,12.9740145 9.5,13.5 C9.5,14.8308682 10.0777413,16.0267978 10.996103,16.8506678 L11.1722296,17.0007255 L10.25,17 C8.9877951,17 7.92420242,17.85036 7.60086562,19.0094363 L7.5667905,19.0090369 C4.37361228,19.0090369 2.43330141,17.9983408 2.01446278,15.8965776 L2,15.75 L2,13.75 C2,12.7835017 2.78350169,12 3.75,12 Z M14,10 C15.9329966,10 17.5,11.5670034 17.5,13.5 C17.5,15.4329966 15.9329966,17 14,17 C12.0670034,17 10.5,15.4329966 10.5,13.5 C10.5,11.5670034 12.0670034,10 14,10 Z M20.5,4 C22.4329966,4 24,5.56700338 24,7.5 C24,9.43299662 22.4329966,11 20.5,11 C18.5670034,11 17,9.43299662 17,7.5 C17,5.56700338 18.5670034,4 20.5,4 Z M7.5,4 C9.43299662,4 11,5.56700338 11,7.5 C11,9.43299662 9.43299662,11 7.5,11 C5.56700338,11 4,9.43299662 4,7.5 C4,5.56700338 5.56700338,4 7.5,4 Z" fill="#FB8C00"
                        id="\uD83C\uDFA8-Color"
                      />
                    </g>
                  </g>
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>Build Your Community</h4>
                <p className='text-center'>Extra bonuses via our referral program.</p>
              </div>
            </div>

            <div className='system_box px-4 mb-8'>
              <div className='border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg
                  width="80px"
                  height="80px"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"

                >
                  <path
                    d="M9.31176 2.99451C9.78718 2.04368 9.45039 0.887134 8.53883 0.340197C7.59324 -0.227152 6.3678 0.0621374 5.77577 0.992466L3 5.3544V12.5C3 13.8807 4.11929 15 5.5 15H10.5C11.2869 15 12.0279 14.6295 12.5 14L15 10.6667V7.5C15 6.11929 13.8807 5 12.5 5H8.30902L9.31176 2.99451Z"
                    fill="#FB8C00"
                  />
                  <path d="M0 5V15H1V5H0Z" fill="#424242" />
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>Competitive $</h4>
                <p className='text-center'>Lowest annual fee ever!</p>
              </div>
            </div>

            <div className='system_box px-4 mb-8'>
              <div className='border border-dashed border-amber-400 rounded-xl py-8 px-4 flex flex-col items-center hover:shadow-xl transition-all h-full '>
                <svg
                  fill="#000000"
                  xmlns="http://www.w3.org/2000/svg"
                  width="80px"
                  height="80px"
                  viewBox="0 0 52 52"
                  enableBackground="new 0 0 52 52"
                  xmlSpace="preserve"

                >
                  <g>
                    <path d="M45.5,23.4L25,34.7c-1.4,0.7-3-0.3-3-1.8V8.4c0-1-1-1.8-1.9-1.5c-10,2.8-17.2,12.5-16,23.6 c1.1,10.1,9.2,18.3,19.4,19.4C36.8,51.3,48,41,48,28c0-1.2-0.1-2.4-0.3-3.6C47.5,23.4,46.4,22.9,45.5,23.4z" fill="#FB8C00" />
                    <path d="M27.7,28l19.7-10.5c1.2-0.6,1.6-2.2,0.8-3.3C43.7,8,36.7,3.5,28.7,2.2C27.3,1.9,26,3,26,4.4V27 C26,27.9,26.9,28.4,27.7,28z" fill="#424242" />
                  </g>
                </svg>
                <h4 className='text-xl mt-2 font-semibold text-[var(--bg-color)]'>Flexible Payment Methods</h4>
                <p className='text-center'>Supports various payment methods for local currencies.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

    </>
  )
}

export default Banner