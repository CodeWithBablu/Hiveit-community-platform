import { Dispatch, SetStateAction, useRef, useState } from "react";
import { FileWithUrl } from "./PostForm";
import clsx from "clsx";
import { RiArrowLeftLine, RiArrowRightLine, RiCloseLine } from "@remixicon/react";
import VideoWrapper from "./VideoWrapper";
import { truncateText } from "@/lib/Utils";

type Carouselprops = {
  isOverlayOpen: boolean;
  setIsOverlayOpen: Dispatch<SetStateAction<boolean>>;
  gallery: FileWithUrl[];
}

const Carousel = ({ isOverlayOpen, setIsOverlayOpen, gallery }: Carouselprops) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imgLoading, setImgLoading] = useState<boolean>(true);

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
            <div onClick={() => setIsOverlayOpen(prev => !prev)} ref={containerRef} className={`relative ${isOverlayOpen ? 'h-[calc(100dvh-64px)]' : 'h-full'} w-full flex transition-transform duration-700 ease-in-out`}>
              {gallery.map((media, index) => (
                <div
                  key={index}
                  className={clsx(
                    `h-full w-full shrink-0 transform overflow-hidden relative`,
                    {
                      "mx-auto": gallery.length > 1,
                      'flex justify-center items-center': isOverlayOpen
                    },
                  )}
                >
                  <div className={clsx(
                    `${imgLoading ? 'w-full' : 'w-fit'} rounded-2xl overflow-hidden ${gallery.length > 1 && 'mx-auto'}`,
                    {
                      'h-fit border-[1px] border-dimGray': !isOverlayOpen,
                      'h-full': isOverlayOpen,
                    }
                  )}>
                    {
                      imgLoading &&
                      <>
                        <div className="min-h-64 sm:min-h-72 w-full bg-zinc-900/50 animate-pulse"></div>
                      </>
                    }
                    <img
                      src={media.url}
                      loading="lazy"
                      alt={`Slide ${index}`}
                      onLoad={() => {
                        // console.log("img loaded");
                        // if (index === 0)
                        setImgLoading(false);
                      }}
                      className={clsx("object-contain",
                        {
                          'w-fit': gallery.length === 1,
                          'mx-auto': gallery.length > 1,
                          'max-h-[600px] min-h-64 sm:min-h-72': !isOverlayOpen && !imgLoading,
                          'h-full': isOverlayOpen,
                        })}
                    />
                  </div>

                  {(media.link || media.caption) &&
                    <div className={`absolute bottom-2 left-0 right-0 mx-auto rounded-b-2xl w-full px-2 ${isOverlayOpen && 'max-w-[700px]'}`}>
                      <div className="flex flex-col rounded-xl w-full bg-blackAplha400 backdrop-blur-2xl px-3 py-2">
                        {media.caption && (
                          <>
                            <h3 title={media.caption} className="inline-block sm:hidden">{truncateText(media.caption, 30)}</h3>
                            <h3 title={media.caption} className="hidden sm:inline-block">{truncateText(media.caption, 90)}</h3>
                          </>
                        )}
                        {media.link && <a title={media.link} href={media.link} target="_blank" className="text-blue-600 hover:underline">{truncateText(media.link, 50)}</a>}
                      </div>
                    </div>
                  }
                </div>

              ))}
            </div>
          </>
        )}

      </div>


      {/* onNavigation btn btn */}
      <button
        className={clsx(
          "absolute z-[5] left-0 top-1/2 -translate-y-1/2 transform rounded-full p-5 text-white hover:bg-zinc-700/20 hover:backdrop-blur-xl focus:outline-none",
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
          "absolute z-[5] right-0 top-1/2 -translate-y-1/2 transform rounded-full p-5 text-white hover:bg-zinc-700/20 hover:backdrop-blur-xl focus:outline-none",
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

