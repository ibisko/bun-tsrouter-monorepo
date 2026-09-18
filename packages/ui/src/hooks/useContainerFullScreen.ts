import { useEffect, useState } from 'react';

export const useContainerFullScreen = (containerRef: React.RefObject<HTMLElement | null>) => {
  const [isFullScreen, setFullScreenStatus] = useState(false);
  useEffect(() => {
    if (!isFullScreen) {
      if (document.fullscreenElement) document.exitFullscreen();
      return;
    }

    const container = containerRef.current;
    // window 全屏
    container?.requestFullscreen();
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setFullScreenStatus(false);
    };
    container?.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      container?.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [isFullScreen]);

  return {
    isFullScreen,
    setFullScreenStatus,
  };
};
