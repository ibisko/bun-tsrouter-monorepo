import { useEffect, useState } from 'react';

export const useContainerFullScreen = (containerRef: React.RefObject<HTMLElement | null>) => {
  const [isFullScreen, setFullScreenStatus] = useState(false);
  useEffect(() => {
    if (isFullScreen) {
      // window 全屏
      containerRef.current?.requestFullscreen();
      containerRef.current?.addEventListener('fullscreenchange', e => {
        if (!document.fullscreenElement) {
          setFullScreenStatus(false);
        }
      });
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, [isFullScreen]);

  return {
    isFullScreen,
    setFullScreenStatus,
  };
};
