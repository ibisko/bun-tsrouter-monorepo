import z from 'zod';
import prisma from '@/database/prisma';
import { Icon, type Prisma } from '@prisma/generated/client';
import { procedure } from '@packages/tsrouter/server';
import { skipTaskTableSchema } from '@packages/utils/server';
import { IconFindManyArgs } from '@prisma/generated/models';
import { omit } from 'lodash-es';
import { checkSvgIsAnimation } from '@packages/icons/server';

const select: IconFindManyArgs['select'] = {
  // created_at: true,
  // updated_at: true,

  id: true,
  name: true,
  body: true,
  pid: true,

  top: true,
  left: true,
  width: true,
  height: true,

  h_flip: true,
  v_flip: true,
  animate: true,

  icon_set: {
    select: {
      id: true,
      prefix: true,
    },
  },
};

/** 组装基础返回字段；target 为别名指向的父项，item 缺省的字段回落取父项值（body 由调用方自行补充） */
function buildIconData(item: IconRecord, target?: Omit<IconRecord, 'icon_set'>) {
  const base = target ?? item;
  return {
    id: base.id,
    ...(item.pid ? { pid: item.pid } : {}),
    prefix: item.icon_set.prefix,
    name: item.name,
    top: item.top ?? base.top!,
    left: item.left ?? base.left!,
    width: item.width ?? base.width!,
    height: item.height ?? base.height!,
    h_flip: item.h_flip ?? base.h_flip ?? undefined,
    v_flip: item.v_flip ?? base.v_flip ?? undefined,
    animate: item.animate ?? base.animate ?? undefined,
  };
}

const searchIconSchema = skipTaskTableSchema.extend({
  kw: z.string(),
  iconSets: z.array(z.number()).optional(),
  categoryId: z.number().nullish(),
  tags: z.array(z.number()).optional(),
  palette: z.boolean().optional(),
});

const listIcons = procedure.post(searchIconSchema, async ({ skip, take, kw, iconSets = [], categoryId, tags = [], palette }) => {
  const whereAND: Prisma.IconWhereInput[] = [];
  const iconSetWhereAND: Prisma.IconSetWhereInput[] = [];

  if (iconSets.length) {
    whereAND.push({
      icon_set_id: {
        in: iconSets,
      },
    });
  }

  if (categoryId) {
    iconSetWhereAND.push({
      tag_relationships: {
        some: {
          icon_set_tag_id: categoryId,
        },
      },
    });
  }

  if (tags.length) {
    const tagConditions = tags.map(id => ({
      tag_relationships: {
        some: {
          icon_set_tag: { type: 'tag', id },
        },
      },
    }));
    iconSetWhereAND.push(...tagConditions);
  }

  whereAND.push({
    icon_set: { palette },
  });

  if (iconSetWhereAND.length) {
    whereAND.push({
      icon_set: { AND: iconSetWhereAND },
    });
  }

  const where: Prisma.IconWhereInput = {
    deleted_at: null,
    AND: whereAND,
  };

  if (kw) {
    const words = kw
      .trim()
      .split(/[\s-]+/)
      .filter(Boolean);

    whereAND.push(
      ...words.map(word => ({
        OR: [{ name: word }, { name: { startsWith: `${word}-` } }, { name: { contains: `-${word}-` } }, { name: { endsWith: `-${word}` } }],
      })),
    );
  }

  const listSelect = omit(select, 'body'); // icon列表优化不要 body
  const total = await prisma.icon.count({ where });
  const rows = await prisma.icon.findMany({ select: listSelect, where, skip, take });

  const aliasIds = rows.filter(item => item.pid).map(item => item.pid!);
  const aliasIcons = await prisma.icon.findMany({
    select: listSelect,
    where: { id: { in: aliasIds }, deleted_at: null },
  });
  const aliasIconMap = new Map(aliasIcons.map(item => [item.id, item]));

  const data: Omit<IconInfo, 'body' | 'pid'>[] = [];

  rows.forEach(item => {
    const target = item.pid ? aliasIconMap.get(item.pid) : undefined;
    if (item.pid && !target) return;
    data.push(buildIconData(item, target));
  });

  return {
    skip,
    take,
    data,
    total,
  };
});

/** 这里仅从库里查 */
const getIconsInfo = procedure.post(
  z.object({
    icons: z.array(z.number()),
  }),
  async ({ icons }) => {
    const where: Prisma.IconWhereInput = {
      id: { in: icons },
      deleted_at: null,
    };
    const rows = await prisma.icon.findMany({ select, where });

    const aliasIds = rows.filter(item => item.pid).map(item => item.pid!);
    const aliasIcons = await prisma.icon.findMany({
      select,
      where: { id: { in: aliasIds }, deleted_at: null },
    });
    const aliasIconMap = new Map(aliasIcons.map(item => [item.id, item]));

    const data: IconInfo[] = [];

    rows.forEach(item => {
      const target = item.pid ? aliasIconMap.get(item.pid) : undefined;
      if (item.pid && !target) return;
      data.push({
        ...buildIconData(item, target),
        body: (target ?? item).body!,
        animate: checkSvgIsAnimation((target ?? item).body!),
      });
    });

    return data;
  },
);

export const iconRouter = {
  list: listIcons,
  getIcons: getIconsInfo,
};

type IconInfo = {
  id: number;
  pid?: number;

  name: string;
  body: string;
  top: number;
  left: number;
  width: number;
  height: number;
  h_flip?: boolean; // 存在的
  v_flip?: boolean; // 存在的
  animate?: boolean; // 是否存在动画

  // 单独拿出来
  prefix: string;
};

type IconRecord = Pick<Icon, 'id' | 'name' | 'pid' | 'top' | 'left' | 'width' | 'height' | 'h_flip' | 'v_flip' | 'animate'> & {
  icon_set: { prefix: string };
};
