import { useMemo, useSyncExternalStore } from 'react';

const useScreenDim = () => {
  const screenDimStr = useSyncExternalStore(
    (listener) => {
      window.addEventListener('resize', listener);
      return () => {
        window.removeEventListener('resize', listener);
      };
    },
    () => [window.innerWidth, window.innerHeight].join(','),
    () => ''
  );

  const screenDim = useMemo(() => {
    const data = screenDimStr.split(',');

    return {
      width: isNaN(parseInt(data?.[0])) ? undefined : parseInt(data?.[0]),
      height: isNaN(parseInt(data?.[1])) ? undefined : parseInt(data?.[1]),
    };
  }, [screenDimStr]);

  return screenDim;
};

export default useScreenDim;
