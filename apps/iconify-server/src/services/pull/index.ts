import pLimit from 'p-limit';
import prisma from '@/database/prisma';
import { retryHandle } from '@packages/utils';
import { fetchAllIconSet, fetchIconSet, type SyncIconSetsItem } from './fetchIconSet';
import { saveIconSet } from './saveIconSet';

const plimitFetch = pLimit(10);
const plimitWrite = pLimit(1);

export const syncIconSets = async () => {
  console.log('更新图标集');

  const data = await fetchAllIconSet();
  console.log('total:', data.length);

  let countUpdate = 0;
  let countAdd = 0;

  const handle = async (item: SyncIconSetsItem) => {
    const target = await prisma.iconSet.findFirst({
      where: { filename: item.name },
    });

    if (target?.sha === item.sha) return;

    if (target) {
      console.log('更新', target.name);
      countUpdate++;
    } else {
      console.log('新增', item.name);
      countAdd++;
    }

    const res = await retryHandle(() => fetchIconSet(item.name));
    await plimitWrite(() => saveIconSet(res, item.name, item.sha));
  };

  await Promise.all(
    data.map(item =>
      plimitFetch(async () => {
        try {
          await retryHandle(() => handle(item));
        } catch (error) {
          console.log('执行失败', item);
          console.log(error);
        }
      }),
    ),
  );

  if (!countUpdate && !countAdd) console.log('今日无更新');
  if (countAdd) console.log('新增:', countAdd);
  if (countUpdate) console.log('更新:', countAdd);
};
