// import React, { useState, useEffect, useRef } from 'react';

// const CountdownTimer = ({ expireAt, label }) => {
//   const calculateRemainingSeconds = () => {
//     const expireTime = new Date(expireAt).getTime();
//     const now = new Date().getTime();
//     return Math.max(Math.floor((expireTime - now) / 1000), 0);
//   };

//   const formatTime = (totalSeconds) => {
//     const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
//     const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
//     const seconds = String(totalSeconds % 60).padStart(2, '0');
//     return `${hours}:${minutes}:${seconds}`;
//   };

//   const [remaining, setRemaining] = useState(calculateRemainingSeconds());
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     if (remaining <= 0) return;

//     intervalRef.current = setInterval(() => {
//       setRemaining(prev => {
//         if (prev <= 1) {
//           clearInterval(intervalRef.current);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(intervalRef.current);
//   }, []);

//   return (
//     <div className="  rounded-b-xl  w-full  max-w-xs overflow-auto ">
//       <div className="text-sm font-medium mb-1">{label}</div>
//       <div className="flex items-center gap-1.5">
//         <p className='text-gray-800'>Expires In : </p>
//       <div className="text-center text-lg font-medium tracking-widest text-red-600">
//         {formatTime(remaining)}
//       </div>
//       </div>
//       {/* {remaining === 0 && (
//         <p className="text-red-500 text-xs text-center mt-1">⏰ Time's up!</p>
//       )} */}
//     </div>
//   );
// };

// export default CountdownTimer;


import React, { useState, useEffect } from "react";

const CountdownTimer = ({ expireAt, label, status }) => {

  const calculateRemainingSeconds = () => {
    const expireTime = new Date(expireAt).getTime();
    const now = Date.now();

    if (isNaN(expireTime)) return 0;

    return Math.max(Math.floor((expireTime - now) / 1000), 0);
  };

  const [remaining, setRemaining] = useState(calculateRemainingSeconds());

  useEffect(() => {
    if (!expireAt) return;
    if (status === "DONE" || status === "REJECTED") return;

    const interval = setInterval(() => {
      const secondsLeft = calculateRemainingSeconds();
      setRemaining(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireAt, status]); 

  if (remaining <= 0) return null;

  const formatTime = (totalSeconds) => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const s = String(totalSeconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="rounded-b-xl w-full max-w-xs overflow-auto">
      {/* <div className="text-sm font-medium mb-1">{label}</div> */}
      <div className="flex items-center gap-1.5">
        <p className="text-gray-800">Expires In :</p>
        <div className="text-center text-lg font-medium tracking-widest text-red-600">
          {formatTime(remaining)}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;





{/* <CountdownTimer expireAt={deal.expireAt} label="Deal Timer" status={deal.status} />  */}

