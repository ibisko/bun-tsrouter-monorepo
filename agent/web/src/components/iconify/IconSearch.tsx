import { Button, Input } from '@packages/ui';
import { IconSubList } from './IconList';
import { useSearch } from './useSearch';
import { MaterialSymbolsSearchRounded } from '@packages/icons';

export const IconSearch = () => {
  const { iconListKey, svgs, setSearchValue, search } = useSearch();
  return (
    <>
      <div className="p-1.5 font-black">Search icons</div>
      <div className="sticky -top-px -bottom-px flex gap-2 p-1.5 bg-background backdrop-blur-2xl border-t border-b">
        <Input onChange={e => setSearchValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Search icons..." />
        <Button onClick={search}>
          <MaterialSymbolsSearchRounded className="size-5" />
        </Button>
      </div>

      <div className="flex flex-wrap p-1.5" key={iconListKey}>
        {svgs.map(item => (
          <IconSubList className="" iconsData={item.icons} key={item.key} />
        ))}
      </div>
    </>
  );
};
