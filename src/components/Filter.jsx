import React, {useState, Fragment} from 'react'
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

import FilterIcon from '../assets/svgs/filter.svg'
import UsdtIcon from '../assets/images/usdt.png'

const cryptos = [
    {
    name: 'BTC',
    symbol: 'Coin',
    icon: UsdtIcon,
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: UsdtIcon,
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: UsdtIcon,
  },
  {
    name: 'Tether',
    symbol: 'USDT',
    icon: UsdtIcon,
  },
];
const payments = [
    {
    name: 'Payment',
    symbol: 'BTC',
    icon: UsdtIcon,
  },
  {
    name: 'Bank',
    symbol: 'BTC',
    icon: UsdtIcon,
  },
  {
    name: 'UPI',
    symbol: 'ETH',
    icon: UsdtIcon,
  },
  {
    name: 'Both',
    symbol: 'USDT',
    icon: UsdtIcon,
  },
];
const amounts = [
    {
    name: 'Amount',
    symbol: '$',
    icon: UsdtIcon,
  },
  {
    name: '100',
    symbol: '$',
    icon: UsdtIcon,
  },
  {
    name: '1000',
    symbol: '$',
    icon: UsdtIcon,
  },
  {
    name: '10000',
    symbol: '$',
    icon: UsdtIcon,
  },
];
const Filter = () => {
    const [selected, setSelected] = useState(cryptos[0]);
    const [selectedPayment, setSelectedPayment] = useState(payments[0]);
    const [selectedAmount, setSelectedAmount] = useState(amounts[0]);
  return (
    <>
        {/* Filters */}
                  <div className="flex justify-between gap-2 py-2 text-sm border-b border-[var(--border-light)] px-4 mb-4">
                    <div className='flex items-center gap-3'>
                      <Listbox value={selected} onChange={setSelected}>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-transparent pr-7 text-left shadow-none focus:outline-none  sm:text-sm">
                        <span className="flex items-center">
                          <img src={selected.icon} alt="" className="h-5 w-5 mr-2" />
                          {selected.symbol}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon className="h-5 w-5 text-black" />
                        </span>
                      </Listbox.Button>

                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60  left-0 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm w-[120px]">
                          {cryptos.map((crypto) => (
                            <Listbox.Option
                              key={crypto.symbol}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 px-4 ${
                                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                }`
                              }
                              value={crypto}
                            >
                              {({ selected }) => (
                                <>
                                  <span className={`flex items-center ${selected ? 'font-semibold' : 'font-normal'}`}>
                                    <img src={crypto.icon} alt="" className="h-5 w-5 mr-2" />
                                    {crypto.symbol}
                                  </span>
                                  
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                    <Listbox value={selectedAmount} onChange={setSelectedAmount}>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-transparent pr-7 text-left shadow-none focus:outline-none  sm:text-sm">
                        <span className="flex items-center">
                          <span className='pr-2'>{selectedAmount.symbol}</span>
                          {selectedAmount.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon className="h-5 w-5 text-black" />
                        </span>
                      </Listbox.Button>

                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60  right-0 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm w-[120px]">
                          {amounts.map((amount) => (
                            <Listbox.Option
                              key={amounts.icon}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 px-4 ${
                                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                }`
                              }
                              value={amount}
                            >
                              {({ selectedAmount }) => (
                                <>
                                  <span className={`flex items-center ${selectedAmount ? 'font-semibold' : 'font-normal'}`}>
                                    <span className='pr-2'>{amount.symbol}</span>
                                    {amount.name}
                                  </span>
                                  
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                    <Listbox value={selectedPayment} onChange={setSelectedPayment}>
                    <div className="relative mt-1">
                      <Listbox.Button className="relative w-full cursor-default rounded-lg bg-transparent pr-7 text-left shadow-none focus:outline-none  sm:text-sm">
                        <span className="flex items-center">
                          <img src={selectedPayment.icon} alt="" className="h-5 w-5 mr-2" />
                          {selectedPayment.name}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <ChevronDownIcon className="h-5 w-5 text-black" />
                        </span>
                      </Listbox.Button>

                      <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <Listbox.Options className="absolute z-10 mt-1 max-h-60  right-0 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm w-[120px]">
                          {payments.map((payment) => (
                            <Listbox.Option
                              key={payment.symbol}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-2 px-4 ${
                                  active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                                }`
                              }
                              value={payment}
                            >
                              {({ selectedPayment }) => (
                                <>
                                  <span className={`flex items-center ${selectedPayment ? 'font-semibold' : 'font-normal'}`}>
                                    <img src={payment.icon} alt="" className="h-5 w-5 mr-2" />
                                    {payment.name}
                                  </span>
                                  
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                    </div>
                    <button className="text-xl"><img src={FilterIcon} /></button>
                  </div>
    </>
  )
}

export default Filter