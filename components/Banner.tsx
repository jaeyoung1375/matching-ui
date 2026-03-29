"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

import "swiper/css";
import "swiper/css/navigation";

interface BannerItem {
  image: string;
  link: string;
}

interface Props {
  list: BannerItem[];
}

export default function Banner({ list }: Props) {
  const [current, setCurrent] = useState(1);

  return (
    <div className="max-w-6xl mx-auto px-4 relative mb-14">
      <Swiper
        modules={[Autoplay, Navigation]}
        loop
        autoplay={{ delay: 3000 }}
        onSlideChange={(swiper) => setCurrent(swiper.realIndex + 1)}
        className="rounded-xl overflow-hidden"
      >
        {list.map((item, idx) => (
          <SwiperSlide key={idx}>
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              className="block relative h-55 md:h-70"
            >
              <Image
                src={item.image}
                alt="banner"
                fill
                className="object-cover"
                unoptimized
              />
            </a>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* index 표시 */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/60 backdrop-blur text-white px-3 py-1 rounded-full text-sm">
        {current} | {list.length}
      </div>
    </div>
  );
}
