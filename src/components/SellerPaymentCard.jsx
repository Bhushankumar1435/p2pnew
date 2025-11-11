
import React, { useState, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';

import { getData, postData, postFileData } from '../api/protectedApi';

const BuyerPaymentCard = ({ id, closeSellerForm }) => {
    const [dealDetail, setdealDetail] = useState('')
    useEffect(() => {
        getData('/user/billDetails?id=' + id, {})
            .then((res) => {
                if (res.data.success == true) {
                    setdealDetail(res.data.data[0])
                } else {
                    console.log('we are in else case')
                }
                console.log('data p ', res.data)


                    , console.log('data oo', res.data.data)
            })
            .catch((err) => console.error(err));
    }, []);

    const updateOrderStatus = async (status) => {
        let showStatus = status == 'CONFIRMED' ? 'Confirm' : 'REJECT'
        const confirmed = window.confirm("Are you sure you want to " + showStatus + " this order?");
        if (confirmed) {
            let resp = await postData('user/confirmCurrency', { id: id, status: status })
            if (resp.data.success == true) {

                toast.success(resp.data.message)
                setTimeout(() => {
                    closeBuyerForm()
                }, 3000); // 3 seconds

            } else {
                toast.error(imageResp.message)
            }
        }
    }
    return <>

        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-[320px] mx-auto bg-white rounded-2xl shadow-lg p-4 text-gray-800 font-sans">
                <ToastContainer position="top-right" autoClose={3000} />
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-semibold">Buyer Info</h2>
                    <button className="text-gray-400 text-xl leading-none" onClick={() => { closeSellerForm() }}>&times;</button>
                </div>

                <div className="text-sm space-y-1 border-b pb-2">
                    <div className="flex justify-between pb-1">
                        <span>Name</span>
                        <span>{dealDetail?.buyerName}</span>
                    </div>
                </div>
                {/* Amount Section */}
                <div className="text-sm space-y-1 border-b py-3">
                    <div className="flex justify-between">
                        <span>Amount</span>
                        <span>{dealDetail?.fiatAmount}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Commission (2.5%)</span>
                        <span>{dealDetail?.buyerCommission}rs</span>
                    </div>
                    <div className="flex justify-between font-semibold text-green-600 border-t pt-5 mt-5">
                        <span>Total Amount</span>
                        <span>{parseFloat(dealDetail?.fiatAmount) + parseFloat(dealDetail?.buyerCommission)}rs</span>
                    </div>
                </div>

                {/* Bank Info */}
                {(dealDetail?.bankDetails?.name && (
                    <div className="py-3 space-y-1 text-sm border-b">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Name</span>
                            <span className="font-medium">{dealDetail?.bankDetails?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Acc. No.</span>
                            <span>{dealDetail?.bankDetails?.accountNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">IFSC Code.</span>
                            <span>{dealDetail?.bankDetails?.ifscCode}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Bank</span>
                            <div className="flex items-center space-x-1">
                                <span>{dealDetail?.bankDetails?.bankName}</span>
                                {/* <span className="bg-yellow-200 text-yellow-800 text-[10px] px-2 py-0.5 rounded">unknown</span> */}
                            </div>
                        </div>
                    </div>
                ))}

                {/* UPI ID */}
                {(dealDetail?.bankDetails?.upi && (
                    <div className="py-4 space-y-1 text-sm border-b">
                        <div className="flex items-center justify-center text-gray-500 text-xs w-full">
                            {/* <div className="flex-1 h-px bg-gray-400 block"></div>
                            <span className="px-3">or</span>
                            <div className="flex-1 h-px bg-gray-400 block"></div> */}
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">UPI ID</span>
                            <span>{dealDetail?.bankDetails?.upi}</span>
                        </div>
                    </div>
                ))}

                <div className="flex flex-col pt-7 gap-5">
                    <img
                        src={dealDetail?.buyerReceipt}
                        alt="Receipt Preview"
                        className="w-full h-32 object-contain border rounded"
                    />
                    <div className="flex m-auto">
                        <button className="bg-[var(--button-light)] text-[var(--red)] px-4 py-1 rounded" onClick={() => { updateOrderStatus('CONFIRMED') }}>CONFIRM</button> &nbsp; &nbsp; &nbsp; &nbsp;
                        <button className="bg-[var(--button-light)] text-[var(--blue)] px-4 py-1 rounded" onClick={() => { updateOrderStatus('REJECTED') }}>REJECTED</button>
                    </div>
                </div>
            </div>
        </div>
    </>
}


export default BuyerPaymentCard;