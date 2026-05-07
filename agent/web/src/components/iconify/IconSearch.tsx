import { Button, Input } from '@packages/ui';
import { IconSubList } from './IconList';
import { useSearch } from './useSearch';
import { MaterialSymbolsSearchRounded } from '@packages/icons';

export const IconSearch = () => {
  const { iconListKey, svgs, setSearchValue, search } = useSearch();
  return (
    <div className="flex flex-col">
      <div className="p-1.5 font-black">Search icons</div>

      <div className="sticky -top-px -bottom-px flex gap-2 p-1.5 border-t border-b bg-popover">
        <Input onChange={e => setSearchValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Search icons..." />
        <Button onClick={search}>
          <MaterialSymbolsSearchRounded className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 mx-auto" key={iconListKey}>
        {svgs.map(item => (
          <IconSubList className="" iconsData={item.icons} key={item.key} />
        ))}
      </div>
    </div>
  );
};
