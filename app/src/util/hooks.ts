import { useEffect, useRef } from "react";
import useTaskStore from "../store/store";

export const useScrollRestoration = (scrollKey: string, disable: boolean) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const store = useTaskStore();

  useEffect(() => {
    if (!disable) {
      const handleScroll = () => {
        if (scrollRef.current) {
          const { scrollTop } = scrollRef.current;
          if (scrollTop > 2) {
            store.setScrollPosition(scrollKey, scrollTop);
          }
        }
      };

      const scrollElement = scrollRef.current;
      if (scrollElement) {
        scrollElement.scrollTop = store.scrollPositions[scrollKey];
        scrollElement.addEventListener("scroll", handleScroll);
      }

      return () => {
        if (scrollElement) {
          scrollElement.removeEventListener("scroll", handleScroll);
        }
      };
    }
  }, [scrollKey, disable, store]);

  return scrollRef;
};
