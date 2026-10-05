import z from 'zod';
import prisma from '@/database/prisma';
import { procedure } from '@packages/tsrouter/server';
import { skipTaskTableSchema } from '@packages/utils/server';
import { Prisma } from '@prisma/generated/client';

const listIconSetsSchema = skipTaskTableSchema.extend({
  kw: z.string().optional(),
  categoryId: z.number().optional(),
  tags: z.array(z.number()).optional(),
  palette: z.boolean().optional(),
});

const listIconSets = procedure.post(listIconSetsSchema, async ({ skip, take, kw, categoryId, tags, palette }) => {
  const iconSetWhereAND: Prisma.IconSetWhereInput[] = [];
  if (categoryId) {
    iconSetWhereAND.push({
      tag_relationships: {
        some: {
          icon_set_tag_id: categoryId,
        },
      },
    });
  }

  if (tags?.length) {
    const target = tags.map(id => ({
      tag_relationships: {
        some: {
          icon_set_tag: {
            type: 'tag',
            id: id,
          },
        },
      },
    }));
    iconSetWhereAND.push(...target);
  }

  const where: Prisma.IconSetWhereInput = {
    deleted_at: null,
    palette: palette,
    hidden: null,
  };

  if (kw) {
    const words = kw
      .trim()
      .split(/[\s-]+/)
      .filter(Boolean);

    where.OR = [
      {
        AND: words.map(word => ({ name: { contains: word } })),
      },
      {
        AND: words.map(word => ({ prefix: { contains: word } })),
      },
    ];
  }

  if (iconSetWhereAND.length) {
    where.AND = iconSetWhereAND;
  }

  const data = await prisma.iconSet.findMany({
    where: where,
    skip,
    take,
    include: { _count: true, tag_relationships: { select: { icon_set_tag: true } } },
  });

  const total = await prisma.iconSet.count({ where: where });

  return {
    skip,
    take,
    data,
    total,
  };
});

const listTags = procedure.get(
  z.object({
    type: z.enum(['tag', 'category']),
  }),
  async ({ type }) => {
    return await prisma.iconSetTag.findMany({ where: { type } });
  },
);

export const iconSetRouter = {
  list: listIconSets,
  listTags,
};
