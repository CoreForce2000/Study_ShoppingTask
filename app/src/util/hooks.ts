import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

type ScrollPosition = Record<string, number>;
const scrollPositionAtom = atom<ScrollPosition>({});

export const useScrollRestoration = (scrollKey: string, disable: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [scrollPosition, setScrollPosition] = useAtom(scrollPositionAtom);

  useEffect(() => {
    if (!disable) {
      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop } = scrollRef.current;
          if (scrollTop > 2) {
            setScrollPosition((prevScrollPosition) => ({
              ...prevScrollPosition,
              [scrollKey]: scrollTop,
            }));
          }
        }
      };

      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.scrollTop = scrollPosition[scrollKey] || 0;
        scrollElement.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (scrollElement) {
          scrollElement.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [scrollPosition, scrollKey, disable, setScrollPosition]);

  return scrollRef;
};

// const useScrollRestoration = () => {
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state?.scrollPosition) {
//       window.scrollTo(0, location.state.scrollPosition);
//     } else {
//       window.scrollTo(0, 0);
//     }
//   }, [location]);
// };
