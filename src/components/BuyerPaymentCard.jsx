
import React, { useState,useEffect } from 'react'

import { getData ,postData ,postFileData } from '../api/protectedApi';
import { toast , ToastContainer } from 'react-toastify';
const BuyerPaymentCard = ({id , closeBuyerForm}) => {
    const [dealDetail , setdealDetail] = useState('') 
    const [file, setFile] = useState(null);
      const [preview, setPreview] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };
    const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('receiptImage', file);
    formData.append('id', id);

    try {
        setUploading(true);

        let imageResp = await postData('user/payToSeller',formData) 
            console.log(' image Resp ' , imageResp)
            console.log ( 'imageResp.data.data.message ', imageResp)
            if(imageResp.success == true){
               
                toast.success(imageResp.message)
                setTimeout(() => {
                   closeBuyerForm()
                }, 3000); // 3 seconds
                
            }else{
                toast.error(imageResp.message)
            }
        setFile(null);
        setPreview('');
        } catch (err) {
            console.log('err  ' , err)
             toast.error(err.message)
                 alert('Upload failed');
        } finally {
        setUploading(false);
        }
    };
      useEffect(() => {
         getData('/user/billDetails?id='+id, {})
              .then((res) => { 
                if(res.data.success == true) {
                    setdealDetail(res.data.data[0] )
                    // setSellerName(res.data.data[0].sellerName)
                    console.log('selletname  ', res.data.data[0].sellerName)
                }  else{
                    console.log('we are in else case')
                }
                console.log('data p ', res.data)
                

                 , console.log('data oo', res.data.data) })
              .catch((err) => console.error(err));
      }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="w-[320px] mx-auto bg-white rounded-2xl shadow-lg p-4 text-gray-800 font-sans">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold">Please Send to Seller’</h2>
            <button className="text-gray-400 text-xl leading-none" onClick={() => {closeBuyerForm()}}>&times;</button>
        </div>

        {/* Amount Section */}
        <div className="text-sm space-y-1 border-b border-t py-5">
            <div className="flex justify-between">
            <span>Amount</span>
            <span>{dealDetail?.fiatAmount }</span>
            </div>
            <div className="flex justify-between">
            <span>Commission (2.5%)</span>
            <span>{dealDetail?.buyerCommission }rs</span>
            </div>
            <div className="flex justify-between font-semibold text-green-600 border-t pt-5 mt-5">
            <span>Total Amount</span>
            <span>{parseFloat(dealDetail?.fiatAmount) + parseFloat(dealDetail?.buyerCommission) }rs</span>
            </div>
        </div>

        {/* Payment method */}
        {/* <div className="py-3 border-b text-sm">
            <label className="text-gray-500">Choose payment method</label>
            <div className="mt-1 h-[1px] bg-gray-300" />
        </div> */}

        {/* Bank Info */}
        {(dealDetail?.bankDetails?.name && (
        <div className="py-3 space-y-1 text-sm border-b">
            <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{dealDetail?.bankDetails?.name }</span>
            </div>
            <div className="flex justify-between">
            <span className="text-gray-500">Acc. No.</span>
            <span>{dealDetail?.bankDetails?.accountNumber }</span>
            </div>
            <div className="flex justify-between">
            <span className="text-gray-500">IFSC Code.</span>
            <span>{dealDetail?.bankDetails?.ifscCode }</span>
            </div>
            <div className="flex justify-between items-center">
            <span className="text-gray-500">Bank</span>
            <div className="flex items-center space-x-1">
                <span>{dealDetail?.bankDetails?.bankName }</span>
                {/* <span className="bg-yellow-200 text-yellow-800 text-[10px] px-2 py-0.5 rounded">unknown</span> */}
            </div>
            </div>
        </div>
        ))}

        {/* UPI ID */}
        {(dealDetail?.bankDetails?.upi && (
             <div className="py-4 space-y-1 text-sm border-b ">
               <div className="flex items-center justify-center text-gray-500 text-xs w-full">
                            {/* <div className="flex-1 h-[1px] bg-gray-400 block"></div>
                            <span className="px-3">or</span>
                            <div className="flex-1 h-[1px] bg-gray-400 block"></div> */}
                        </div>
                <div className="flex justify-between">
                <span className="text-gray-500">UPI ID</span>
                <span>{dealDetail?.bankDetails?.upi }</span>
                </div>
            </div>
        ))}
       

        {/* Receipt Upload */}
             {preview && (
                <div className="pt-5">
                <img
                    src={preview}
                    alt="Receipt Preview"
                    className="w-full h-32 object-contain border rounded"
                />
                </div>
            )}

            {/* Upload Receipt */}
            <div className="flex justify-between items-center border-t pt-5">
                <span>Receipt</span>
                <label className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded cursor-pointer">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                Upload
                </label>
            </div>

        {/* Submit Button */}
             <button
                onClick={handleUpload}
                disabled={!file || uploading}
                className={`w-full text-white text-sm mt-9 py-2 rounded transition ${
                file ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
                {uploading ? 'Uploading...' : 'Sent payment to seller'}
            </button>
        </div>
    </div>
  );
};

export default BuyerPaymentCard;
