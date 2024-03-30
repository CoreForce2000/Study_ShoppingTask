// hooks/useScrollRestoration.ts
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setScrollPosition } from '../../store/shopSlice';
import { RootState } from '../../store/store';

export const useScrollRestoration = (scrollKey: string, disable:boolean) => {
  const dispatch = useDispatch();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollPosition = useSelector(
    (state: RootState) => state.shop.scrollPositions[scrollKey] || 3
  );

  useEffect(() => {
    if(!disable) {
        const handleScroll = () => {
            if (scrollRef.current) {
                if(scrollRef.current.scrollTop > 2) {
                    dispatch(setScrollPosition({ key: scrollKey, position: scrollRef.current.scrollTop }));
                }
            }
            };
            
            const scrollElement = scrollRef.current;
            if (scrollElement) { 
                scrollElement.scrollTop = scrollPosition;
                scrollElement.addEventListener('scroll', handleScroll);
            }
        
            return () => {
            if (scrollElement) {
                scrollElement.removeEventListener('scroll', handleScroll);
            }
            }
            
    }
  }, [dispatch, scrollPosition, scrollKey, disable]);

  return scrollRef;
};
