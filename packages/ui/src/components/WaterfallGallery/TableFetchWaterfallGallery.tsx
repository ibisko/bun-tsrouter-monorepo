import { useRef, useState } from 'react';
import type { TableResponse } from '../../../../utils/types';
import { WaterfallGallery } from '.';
import { useReachBottom } from './useReachBottom';
import { EosIconsThreeDotsLoading } from '@packages/icons';

type TableRequest = {
  skip: number;
  take: number;
};

type TableFetchWaterfallGalleryProps<T> = React.ComponentProps<'div'> & {
  take?: number;
  api: (param: TableRequest) => Promise<TableResponse<T>>;
  render: (data: T) => React.ReactNode;
  keyField?: string;
  pageScroll?: boolean;
};

export const TableFetchWaterfallGallery = <T = any,>({
  take = 30,
  api,
  render,
  keyField,
  pageScroll,
  ...props
}: TableFetchWaterfallGalleryProps<T>) => {
  const [total, setTotal] = useState(0);
  const [bottom, setBottom] = useState(false); // 撤 foot 即终态
  const [dataSource, setDataSource] = useState<T[]>([]);
  const skipRef = useRef(0);
  const existedKeysRef = useRef(new Set<unknown>());
  const apiRef = useRef(api);
  apiRef.current = api;

  // 续载链持有发起时的 fetchData,api/take 视为挂载期常量
  const fetchData = async () => {
    const res = await apiRef.current({ skip: skipRef.current, take });
    setTotal(res.total);
    // 只追加 key 未出现过的项;项需有 key,缺失会互判重复
    const key = (keyField ?? 'id') as keyof T;
    const existed = existedKeysRef.current;
    const fresh = res.data.filter(item => {
      const itemKey = item[key];
      if (existed.has(itemKey)) return false;
      existed.add(itemKey);
      return true;
    });
    setDataSource(v => [...v, ...fresh]);
    // 绝对推进:重复响应推进同值,不会跳页
    skipRef.current = res.skip + res.take;
    setBottom(res.total === 0 || res.skip + res.take >= res.total);
  };

  const { reachBottomRef } = useReachBottom<T>({ data: dataSource, total, onReachBottom: fetchData });

  return (
    <WaterfallGallery<T>
      {...props}
      data={dataSource}
      keyField={keyField}
      render={render}
      pageScroll={pageScroll}
      foot={
        !bottom && (
          <div className="w-full mt-auto flex" ref={reachBottomRef}>
            <EosIconsThreeDotsLoading className="mx-auto size-10" />
          </div>
        )
      }
    />
  );
};
