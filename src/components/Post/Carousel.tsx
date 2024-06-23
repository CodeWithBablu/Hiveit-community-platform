import { useRef, useState } from "react";
import { FileWithUrl } from "./PostForm";
import clsx from "clsx";
import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import VideoWrapper from "./VideoWrapper";

const Carousel = ({ gallery }: { gallery: FileWithUrl[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToPrevious = () => {

    const newIndex = (currentIndex === 0) ? 0 : currentIndex - 1;
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }

    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? gallery.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    const newIndex = (currentIndex === (gallery.length - 1)) ? gallery.length - 1 : currentIndex + 1;

    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${newIndex * 100}%)`;
    }

    setCurrentIndex((prevIndex) =>
      prevIndex === gallery.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div onClick={(e) => e.stopPropagation()} >

      {/* //// media container */}
      <div className={clsx(
        {
          "relative mt-2 w-full": !isOverlayOpen,
          'fixed top-0 left-0 w-[100dvw] h-[100dvh] bg-blackAplha800 z-[60]': isOverlayOpen
        }
      )}>
        <div className="w-full h-full max-h-[600px] rounded-2xl overflow-hidden">
          {gallery.length === 1 && gallery[0].type.includes("video") ? (
            <>
              <VideoWrapper src={gallery[0].url} />
            </>
          ) : (
            <>
              <div onClick={() => setIsOverlayOpen(true)} ref={containerRef} className={`h-full w-full flex transition-transform duration-700 ease-in-out`}>
                {gallery.map((media, index) => (

                  <div
                    key={index}
                    className={clsx(
                      `h-full w-full shrink-0 transform rounded-2xl`,
                      {
                        "mx-auto": gallery.length > 1,
                      },
                    )}
                  >
                    <div className={`w-fit h-full border-[1px] border-gray-800 rounded-2xl ${gallery.length > 1 && 'mx-auto'}`}>
                      <img
                        src={media.url}
                        loading="lazy"
                        alt={`Slide ${index}`}
                        className={clsx("h-full rounded-2xl object-contain", { 'w-fit': gallery.length === 1, 'mx-auto': gallery.length > 1 })}
                      />
                    </div>
                  </div>

                ))}
              </div>
            </>
          )}
        </div>
        <button
          className={clsx(
            "absolute z-10 left-0 top-1/2 -translate-y-1/2 transform rounded-full p-2 text-white hover:bg-zinc-700/20 focus:outline-none",
            {
              hidden: gallery.length === 1 || currentIndex === 0,
            },
          )}
          onClick={goToPrevious}
        >
          <RiArrowLeftLine size={25} />
        </button>
        <button
          className={clsx(
            "absolute z-50 right-0 top-1/2 -translate-y-1/2 transform rounded-full p-2 text-white hover:bg-zinc-700/20 focus:outline-none",
            {
              hidden: gallery.length === 1 || currentIndex === gallery.length - 1,
            },
          )}
          onClick={goToNext}
        >
          <RiArrowRightLine size={25} />
        </button>
      </div >
      {/* //// media container END */}

      {/* overlay container
      <div onScroll={(e) => e.stopPropagation()} className={clsx(
        "z-50 top-0 left-0 w-[100dvw] h-[100dvh] bg-blackAplha900",
        {
          'hidden scale-50 opacity-30': !isOverlayOpen,
          'fixed scale-100 opacity-100': isOverlayOpen,
        })}>

      </div> */}

    </div>
  );
};

export default Carousel;

