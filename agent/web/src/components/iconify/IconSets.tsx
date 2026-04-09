import { cn } from '@packages/ui';
import { useIconSets, type IconCollection } from './useIconSets';
import { IconSubList } from './IconList';

export const IconSets = () => {
  const { collections } = useIconSets();

  return (
    <>
      <div className="p-1.5 font-black">Icon sets</div>
      <div className={cn('flex flex-col gap-1 text-wrap m-1.5')}>
        {collections.map(item => (
          <IconSetBox item={item} key={item.key} />
        ))}
      </div>
    </>
  );
};

type IconSetBoxProps = {
  item: IconCollection;
};
const IconSetBox = ({ item }: IconSetBoxProps) => {
  return (
    <div
      className={cn('flex gap-2 h-20 border rounded p-2 shadow cursor-pointer', 'hover:bg-foreground/5')}
      /* onClick={async () => {
        const response = await iconifyApi.collection({ prefix: item.key, info: true, chars: true });
        console.log(response);
      }} */
    >
      <div className="flex-1 overflow-hidden">
        <div className="truncate font-black">{item.name}</div>
        <div className="text-sm">{item.licenseTitle}</div>
        <div className="text-sm">{item.total} icons</div>
      </div>

      <div className="grid grid-cols-3 place-items-center gap-0.5">
        <IconSubList
          className="text-2xl text-foreground/80"
          iconsData={{
            prefix: item.key,
            ids: item.samples,
            size: item.height,
          }}
          key={item.key}
        />
      </div>
    </div>
  );
};
