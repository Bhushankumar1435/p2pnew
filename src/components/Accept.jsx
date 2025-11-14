
import React, { useState, useEffect } from 'react'
import UsdtIcon from '../assets/images/usdt.png';

import { getData, postData } from '../api/protectedApi';
import Timer from './Timer';
import SellerPaymentCard from './SellerPaymentCard'
import { toast, ToastContainer } from 'react-toastify'

const Accept = () => {
    const [acceptedDeals, setAcceptedDeals] = useState([])
    const [isSellerOpen, setIsSellerFormOpen] = useState(false)

    const [currentDealId, setcurrentDealId] = useState(null)
    useEffect(() => {
        showRequest()
    }, []);
    const showRequest = () => {
        getData('/user/getRequests', {})
            .then((res) => {
                setAcceptedDeals(res.data.data.data)
                    , console.log('data ', res.data.data)
            })
            .catch((err) => console.error(err));

        //   console.log('NOW WE HAVE TO CALL DIRECTS API')
    }
    const UpdateDealStatus = (dealId, status) => {
        let showStatus = status == 'ACCEPTED' ? 'Accept' : 'Reject'
        const confirmed = window.confirm("Are you sure you want to " + showStatus + " this offer?");
        if (confirmed) {
            postData('/user/manageDeal', { id: dealId, status: status })
                .then((res) => {
                    console.log('data ', res)
                    showRequest()
                    if (res.success == true) {
                        toast.success(res.message)
                    } else
                        toast.error(res.message)

                })
                .catch((err) => console.error(err));
        }
    }

    const hideSellerPaymentCard = () => {
        setIsSellerFormOpen(false)
    }

    return (<>
        <ToastContainer position="top-right" autoClose={3000} />
        {isSellerOpen && (<SellerPaymentCard id={currentDealId} closeSellerForm={hideSellerPaymentCard} />)}
        {
            acceptedDeals.length === 0 ? (
                <p></p>
            ) : (acceptedDeals?.map((deal, index) =>
            (
                <>

                    <div className="border border-[var(--bg-color)] rounded-lg p-4 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 border-r-xl pl-4 rounded-bl-full text-[8px] font-semibold leading-4">Featured Deal</div>
                        <div className="flex justify-between items-center mb-1">
                            <div className="items-center flex">
                                <img src={UsdtIcon} className='shrink-0' />
                                <span className='ml-2 font-medium font-sm text-black'>{deal.buyer.name} {deal.buyer.country}</span>
                                <span className="ml-2">
                                    {/* Star icon */}
                                    <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 0.5L11.0206 6.71885H17.5595L12.2694 10.5623L14.2901 16.7812L9 12.9377L3.70993 16.7812L5.73056 10.5623L0.440492 6.71885H6.97937L9 0.5Z" fill="#A707F1" />
                                    </svg>
                                </span>
                                {/* <p><Timer expireAt={deal.timestamps.expireAt} /></p> */}
                            </div>
                        </div>
                        <div className="text-xs font-normal text-[var(--text-color)]">Trade(s) 1824 (89.40%)</div>
                        <div className='flex items-end justify-between'>
                            <div className='flex-1'>
                                <div className="text-lg"><span className='text-sm font-bold'>₹</span> 92.01<span className="text-sm text-[var(--text-color)]">/USDT</span></div>
                                <div className="text-xs  text-[var(--text-color)]">
                                    Amount req. ${deal.deal.availableAmount}
                                </div>
                            </div>
                            <div className="flex flex-col justify-end gap-2 shrink-0">
                                {deal.status === 'PENDING' ? (
                                    <> <button className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded" onClick={() => UpdateDealStatus(deal._id, 'REJECTED')} >Reject</button>
                                        <button className="bg-[var(--success)] text-white px-4 py-1 rounded" onClick={() => UpdateDealStatus(deal._id, 'ACCEPTED')}>Accept</button>
                                    </>
                                ) : deal.status === "PAID" ? (
                                    <button className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded" onClick={() => { setcurrentDealId(deal?._id), setIsSellerFormOpen(true) }} >View</button>
                                ) : (
                                    <p>Processing...</p>
                                )}
                            </div>
                        </div>
                        <div className="border-t border-dashed mt-4">
                            <p><Timer expireAt={deal.timestamps.expireAt} /></p>
                        </div>
                    </div>
                    <div className="">
                    </div>
                </>
            )
            )
            )}
    </>)
};

export default Accept;