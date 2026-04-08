import { useEffect } from 'react';
import { SvgIcon } from './IconSvg';
import { iconifyAction, iconifyStore } from '@/stores/iconify';
import { useSnapshot } from 'valtio';

export const LocalIcons = () => {
  const { localIcons } = useSnapshot(iconifyStore);

  useEffect(() => {
    iconifyAction.fetchLocalIcons();
  }, []);

  return (
    <div>
      <div>local icons</div>
      <div className="flex flex-wrap mt-2">
        {localIcons.map(item => (
          <SvgIcon item={item} key={item.key} />
        ))}
      </div>
    </div>
  );
};
