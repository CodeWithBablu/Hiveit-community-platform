import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FileWithUrl } from "./PostForm";
import clsx from "clsx";
import { RiArrowLeftLine, RiArrowRightLine, RiCloseLine } from "@remixicon/react";
import VideoWrapper from "./VideoWrapper";

type Carouselprops = {
  isOverlayOpen: boolean;
  setIsOverlayOpen: Dispatch<SetStateAction<boolean>>;
  gallery: FileWithUrl[];
}

const Carousel = ({ isOverlayOpen, setIsOverlayOpen, gallery }: Carouselprops) => {
  const [currentIndex, setCurrentIndex] = useState(0);
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
    <div onClick={(e) => { e.stopPropagation() }} className="flex-grow relative">
      {/* //// media container */}
      <div className={clsx("w-full h-full overflow-hidden")}>
        {gallery.length === 1 && gallery[0].type.includes("video") ? (
          <>
            <VideoWrapper src={gallery[0].url} />
          </>
        ) : (
          <>
            <div onClick={() => setIsOverlayOpen(prev => !prev)} ref={containerRef} className={`h-full w-full flex transition-transform duration-700 ease-in-out`}>
              {gallery.map((media, index) => (
                <div
                  key={index}
                  className={clsx(
                    `h-full w-full shrink-0 transform overflow-hidden`,
                    {
                      "mx-auto": gallery.length > 1,
                      'flex justify-center items-center': isOverlayOpen
                    },
                  )}
                >
                  <div className={clsx(
                    `w-fit rounded-2xl overflow-hidden ${gallery.length > 1 && 'mx-auto'}`,
                    {
                      'h-fit border-[1px] border-gray-800': !isOverlayOpen,
                      'h-full': isOverlayOpen,
                    }
                  )}>
                    <img
                      src={media.url}
                      loading="lazy"
                      alt={`Slide ${index}`}
                      className={clsx("object-contain",
                        {
                          'w-fit': gallery.length === 1,
                          'mx-auto': gallery.length > 1,
                          'max-h-[600px]': !isOverlayOpen,
                          'h-full': isOverlayOpen,
                        })}
                    />
                  </div>
                </div>

              ))}
            </div>
          </>
        )}

      </div>


      {/* onNavigation btn btn */}
      <button
        className={clsx(
          "absolute z-10 left-0 top-1/2 -translate-y-1/2 transform rounded-full p-5 text-white hover:bg-zinc-700/20 hover:backdrop-blur-xl focus:outline-none",
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
          "absolute z-10 right-0 top-1/2 -translate-y-1/2 transform rounded-full p-5 text-white hover:bg-zinc-700/20 hover:backdrop-blur-xl focus:outline-none",
          {
            hidden: gallery.length === 1 || currentIndex === gallery.length - 1,
          },
        )}
        onClick={goToNext}
      >
        <RiArrowRightLine size={25} />
      </button>

      <div onClick={(e) => { setIsOverlayOpen(false) }} className={clsx(
        "w-[60px] h-[60px] group absolute top-0 left-0 sm:top-5 sm:left-5 flex items-center justify-center",
        {
          "hidden": !isOverlayOpen,
          "inline-block": isOverlayOpen,
        }
      )}>
        <span className=" bg-blackAplha800 p-3 rounded-full group-hover:bg-zinc-800/70">
          <RiCloseLine size={25} />
        </span>
      </div>

      {/* //// media container END */}
    </div >
  );
};

export default Carousel;

