
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { Autoplay } from "swiper/modules";


// Images (local and public folder)
import userprofile from "../assets/images/userprofile.png";
import userprofile2 from "../assets/images/userprofile2.png";
import userprofile3 from "../assets/images/userprofile3.png";
import userprofile4 from "../assets/images/userprofile4.png";
import userprofile5 from "../assets/images/userprofile5.png";
import userprofile6 from "../assets/images/userprofile6.png";
import userprofile7 from "../assets/images/userprofile7.png";

const reviews = [
    {
        name: "Stoffel Volkov",
        title: "Marketing Analyst",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile,
    },
    {
        name: "William Ramirez",
        title: "Professor",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile2,
    },
    {
        name: "Bright David",
        title: "CEO of Laptop Digital Lifestyle",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile3,
    },
    {
        name: "Stoffel Volkov",
        title: "Marketing Analyst",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile4,
    },
    {
        name: "William Ramirez",
        title: "Professor",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile5, // from public/images
    },
    {
        name: "Bright David",
        title: "CEO of Laptop Digital Lifestyle",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile6,
    },
    {
        name: "Stoffel Volkov",
        title: "Marketing Analyst",
        text: "I've tried other trading bots in the past, but Royal Q is by far the best. The results speak for themselves.",
        image: userprofile7,
    },

];

const Reviews = () => {
    return (
        <div className="bg-blue-50 py-16 px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">Reviews</h2>
            <p className="text-sm text-gray-700 mb-12">What successful traders say about us?</p>

            <div className="max-w-6xl mx-auto">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{
                        delay: 3000, // Time between transitions (in ms)
                        disableOnInteraction: false, // Continue autoplay after user interacts
                    }}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                        640: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {reviews.map((review, index) => (
                        <SwiperSlide key={index}>
                            <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100 mb-12 hover:shadow-lg transition h-full flex flex-col justify-between">
                                <div className="flex items-center gap-4 mb-4">
                                    <img
                                        src={review.image}
                                        alt={review.name}
                                        className="w-16 h-16 rounded-md object-cover"
                                    />
                                    <div className="text-left">
                                        <h4 className="font-semibold text-gray-800">{review.name}</h4>
                                        <p className="text-sm text-blue-400 font-medium">{review.title}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-700 text-left">{review.text}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Style the pagination bullets */}
                <style jsx>{`
    .swiper-pagination {
      bottom: 7 !important;
      text-align: center;
    }
  `}</style>
            </div>
        </div>
    );
};

export default Reviews;

