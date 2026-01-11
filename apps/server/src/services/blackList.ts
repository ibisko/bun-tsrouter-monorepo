import prisma from '@/database/prisma';
import { limitRateInstance } from '@/middlewares/limitRate';
import { Context } from '@packages/tsrouter/server';
import z from 'zod';

const addBlackListSchema = z.object({ ip: z.string() });

export const addBlackList = async (ip: string) => {
  const blackListInfo = await prisma.blackList.findFirst({ where: { ip } });
  if (blackListInfo?.deleted_at) {
    await prisma.blackList.update({ where: { ip }, data: { deleted_at: null } });
  } else {
    await prisma.blackList.create({ data: { ip } });
  }
  limitRateInstance.blackList.push(ip);
};

export const addBlackListService = async ({ ip }: z.output<typeof addBlackListSchema>, ctx: Context) => {
  ctx.logger.info({ msg: '新增黑名单', data: { ip } });
  await addBlackList(ip);
};

export const deleteBlackList = async ({ ip }: z.output<typeof addBlackListSchema>, ctx: Context) => {
  ctx.logger.info({ msg: '移出黑名单', data: { ip } });
  await prisma.blackList.update({
    where: { ip },
    data: { deleted_at: new Date() },
  });
};
