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
    <div className='flex flex-col'>
      <div className="p-1.5 font-black">Local icons</div>
      <div className="grid grid-cols-7 mx-auto my-1.5">
        {localIcons.map(item => (
          <SvgIcon className="text-4xl" item={item} key={item.key} />
        ))}
      </div>
    </div>
  );
};
