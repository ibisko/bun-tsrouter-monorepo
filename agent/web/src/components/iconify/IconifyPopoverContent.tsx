import { useMemo, useRef, useState } from 'react';
import { Button, cn, HR, InputGroup, MultiSelect, Popover, Select, Tooltip, useInitial, useLocalStorageState } from '@packages/ui';
import { ReiconLibraryFilled, LucideX, CodiconSearchLarge, BoxiconsArrowToTopStrokeFilled } from '@packages/icons';
import { IconifyApi } from './api';
import { IconSetGallery } from './IconSet';
import { IconSearch } from './IconSearch';
import { SwitchSliderPalette } from './SwitchSliderPalette';
import { LocalIcon } from './LocalIcon';

type IconifyPopoverContentProps = {
  className?: string;
};
export const IconifyPopoverContent = ({ className }: IconifyPopoverContentProps) => {
  const wrapperDomRef = useRef<HTMLDivElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchKw, setSearchKw] = useState('');
  const [searchIconSetInput, setSearchIconSetInput] = useState('');
  const [searchIconSetKw, setSearchIconSetKw] = useState('');
  const [palette, setPalette] = useLocalStorageState<boolean | undefined>(undefined, 'CURRENT_PALETTE');
  const [categorys, setCategorys] = useState<{ label: string; value: number }[]>([]);
  const [tags, setTags] = useState<{ label: string; value: number }[]>();
  const [currentCategoryId, setCurrentCategory] = useLocalStorageState<number | undefined>(undefined, 'CURRENT_CATEGORYS');
  const [currentTags, setCurrentTags] = useLocalStorageState<number[]>([], 'CURRENT_TAGS');
  const [currentIconSetIds, setCurrentIconSetIds] = useLocalStorageState<{ id: number; name: string }[]>([], 'CURRENT_ICONSETID');

  useInitial(async () => {
    const categorysRes = await IconifyApi.iconSet.listTags.get({ type: 'category' });
    setCategorys(categorysRes.map(item => ({ label: item.name, value: item.id })));
    const tagsRes = await IconifyApi.iconSet.listTags.get({ type: 'tag' });
    setTags(tagsRes.map(item => ({ label: item.name, value: item.id })));
  });

  const visibleIconSearch = useMemo(() => {
    return !!searchKw || !!currentIconSetIds.length;
  }, [searchKw, currentIconSetIds]);

  return (
    <>
      <div className={cn('relative h-full pt-2', className)} ref={wrapperDomRef}>
        {/* toolbar */}
        <div className={cn('z-10 transition-[top,left,width,height]', 'max-w-full w-full px-3')}>
          <div
            className={cn(
              'flex flex-wrap justify-center gap-x-2 gap-y-2',
              'px-2 py-2 rounded-lg bg-background/80 backdrop-blur-sm shadow-2xl border mx-auto w-auto',
              'ring-2 ring-sidebar-primary/20 border',
            )}>
            <Popover
              className="flex flex-col w-60 py-2 z-10 bg-popover shadow-2xl border ring-2 ring-sidebar-primary"
              trigger={
                <Tooltip title="icon sets">
                  <Button size="icon-sm">
                    <ReiconLibraryFilled />
                  </Button>
                </Tooltip>
              }>
              <InputGroup
                value={searchIconSetInput}
                onChange={e => {
                  setSearchIconSetInput(e.target.value);
                }}
                placeholder="search icon-set"
                onKeyDown={e => {
                  if (e.code === 'Enter') {
                    setSearchIconSetKw(searchIconSetInput);
                  }
                }}
                suffixSlot={
                  <>
                    {searchIconSetInput && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => {
                          setSearchIconSetInput('');
                          setSearchIconSetKw('');
                        }}>
                        <LucideX className="size-4" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon-sm" disabled={!searchIconSetInput} onClick={() => setSearchIconSetKw(searchIconSetInput)}>
                      <CodiconSearchLarge />
                    </Button>
                  </>
                }
              />

              <Select
                className="mt-2"
                options={categorys}
                defaultValue={undefined}
                value={currentCategoryId}
                onChange={setCurrentCategory}
                placeholder="select categories"
              />

              <MultiSelect className="mt-2" options={tags} value={currentTags} onChange={setCurrentTags} placeholder="select tags" />

              {/* 三段，线性连接 */}
              <div className="flex gap-1 items-center mt-2 mx-2">
                <span className="">Palette</span>
                <SwitchSliderPalette className="" palette={palette} onChange={setPalette} />
              </div>

              <IconSetGallery
                className="flex-1 mt-2 px-1"
                currentCategoryId={currentCategoryId}
                currentTags={currentTags}
                currentIconSetIds={currentIconSetIds}
                palette={palette}
                kw={searchIconSetKw}
                onClick={data => {
                  if (currentIconSetIds.find(item => item.id === data.id)) {
                    setCurrentIconSetIds(currentIconSetIds.filter(item => item.id !== data.id));
                  } else {
                    setCurrentIconSetIds([...currentIconSetIds, { id: data.id, name: data.name }]);
                  }
                }}
                key={'ICONSETGALLERY' + palette + currentTags.join() + currentCategoryId + searchIconSetKw}
              />
            </Popover>

            <InputGroup
              className="flex-1"
              value={searchInput}
              onChange={e => {
                setSearchInput(e.target.value);
              }}
              placeholder={`search icons, try "folder upload"`}
              onKeyDown={e => {
                if (e.code === 'Enter') {
                  setSearchKw(searchInput);
                }
              }}
              suffixSlot={
                <>
                  {searchInput && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        setSearchInput('');
                        setSearchKw('');
                      }}>
                      <LucideX className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon-sm" disabled={!searchInput} onClick={() => setSearchKw(searchInput)}>
                    <CodiconSearchLarge />
                  </Button>
                </>
              }
            />
          </div>
        </div>

        <HR className="my-6" title="Local Icon" />
        <LocalIcon className="max-h-full px-4 pt-1" />

        {visibleIconSearch && (
          <>
            <HR className="my-6" title="Icon Search" />
            <IconSearch
              className={cn('max-h-full px-4 pb-8')}
              searchKw={searchKw}
              currentCategoryId={currentCategoryId}
              currentTags={currentTags}
              palette={palette}
              currentIconSetIds={currentIconSetIds.map(item => item.id)}
              key={'ICONSEARCH' + searchKw + palette + currentTags.join() + currentCategoryId + `${currentIconSetIds.length}`}
            />
          </>
        )}

        {/* page: */}
        {/* - 本地已用的图标，编辑图标 */}
        {/* - 搜索图标 (agent辅助多个提示词模糊搜索，集合范围内搜索) */}
      </div>

      {!!currentIconSetIds.length && (
        <div
          className={cn(
            'absolute top-0 left-full max-h-4/5 overflow-auto py-3',
            'overflow-y-auto',
            'flex flex-col justify-start items-start w-auto gap-x-2 gap-y-1 text-xs mx-2 transition rounded-sm text-nowrap',
          )}
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 16px, black calc(100% - 16px), transparent)',
          }}>
          {currentIconSetIds.map(item => (
            <div
              className="relative flex gap-2 p-1 px-2 rounded bg-primary/80 backdrop-blur-xs text-background dark:text-foreground group"
              key={item.id}>
              {item.name}
              <LucideX
                className="absolute left-1 rounded text-xs size-4 cursor-pointer text-inherit group-hover:bg-primary hidden group-hover:block border shadow"
                onClick={e => {
                  e.stopPropagation();
                  const ids = currentIconSetIds.filter(a => a.name !== item.name);
                  setCurrentIconSetIds(ids);
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-full flex flex-col gap-2 w-auto text-xs mx-2 transition rounded-sm text-nowrap">
        <BoxiconsArrowToTopStrokeFilled
          className="p-1 size-7 rounded-lg bg-primary/80 backdrop-blur-xs text-background dark:text-foreground hover:bg-primary cursor-pointer"
          onClick={() => {
            if (!wrapperDomRef.current) return;
            wrapperDomRef.current.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
        <BoxiconsArrowToTopStrokeFilled
          className="p-1 size-7 rounded-lg bg-primary/80 backdrop-blur-xs text-background dark:text-foreground hover:bg-primary cursor-pointer rotate-180"
          onClick={() => {
            if (!wrapperDomRef.current) return;
            wrapperDomRef.current.scrollTo({ top: wrapperDomRef.current.scrollHeight, behavior: 'smooth' });
          }}
        />
      </div>
    </>
  );
};
