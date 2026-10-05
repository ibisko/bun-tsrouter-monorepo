import type { ExtendedIconifyIcon, IconifyInfo, IconifyJSON } from '@iconify/types';
import prisma from '@/database/prisma';
import { logger } from '@/router/tsrouter';
import { checkSvgIsAnimation } from '@packages/icons/server';

export const saveIconSet = async (data: IconifyJSON, fileName: string, sha: string) => {
  const iconSetInfo = data.info;
  if (!iconSetInfo) {
    logger.error({ msg: '没有 data.info 的 iconSet' });
    return;
  }

  await prisma.$transaction(async ctx => {
    // ========== icon-set 录入 ==========

    let lastModified;
    if (data.lastModified) {
      lastModified = new Date(data.lastModified * 1e3);
    }

    const iconSetUpdateData: any = {
      filename: fileName,
      sha,
      samples: [],
      last_modified: lastModified,
      name: iconSetInfo.name,
      palette: iconSetInfo.palette || false,
      version: iconSetInfo.version,
    };
    if (iconSetInfo.hidden || iconSetInfo.total === 0) {
      iconSetUpdateData.hidden = true; // 总数为0也算隐藏了
    }

    const iconSet = await ctx.iconSet.upsert({
      where: { prefix: data.prefix },
      update: iconSetUpdateData,
      create: {
        prefix: data.prefix,
        ...iconSetUpdateData,
      },
    });

    if (iconSetInfo.hidden) return; // 隐藏就不继续录入了

    // ========== icon-set 标签 ==========

    if (iconSetInfo.category) {
      const iconSetTagData = { name: iconSetInfo.category, type: 'category' };
      const tag = await ctx.iconSetTag.upsert({
        where: { name_type: iconSetTagData },
        update: {},
        create: iconSetTagData,
      });
      const iconSetTagRelationshipData = { icon_set_tag_id: tag.id, icon_set_id: iconSet.id };
      await ctx.iconSetTagRelationship.upsert({
        where: { icon_set_id_icon_set_tag_id: iconSetTagRelationshipData },
        update: {},
        create: iconSetTagRelationshipData,
      });
    }

    if (iconSetInfo.tags?.length) {
      for (const tagName of iconSetInfo.tags) {
        const iconSetTagData = { name: tagName, type: 'tag' };
        const tag = await ctx.iconSetTag.upsert({
          where: { name_type: iconSetTagData },
          update: {},
          create: iconSetTagData,
        });
        const iconSetTagRelationshipData = { icon_set_tag_id: tag.id, icon_set_id: iconSet.id };
        await ctx.iconSetTagRelationship.upsert({
          where: { icon_set_id_icon_set_tag_id: iconSetTagRelationshipData },
          update: {},
          create: iconSetTagRelationshipData,
        });
      }
    }

    // ========== icons 录入 ==========

    const iconMap: Map<string, number> = new Map();

    const icons = Object.entries(data.icons);
    for (const [name, icon] of icons) {
      if (icon.hidden) continue;

      const iconUpdateData = {
        body: icon.body,
        top: icon.top ?? data.top ?? 0,
        left: icon.left ?? data.left ?? 0,
        width: icon.width ?? data.width ?? 16,
        height: icon.height ?? data.height ?? 16,
        h_flip: icon.hFlip,
        v_flip: icon.vFlip,
        animate: checkSvgIsAnimation(icon.body),
      };

      const savedIcon = await ctx.icon.upsert({
        where: { icon_set_id_name: { name, icon_set_id: iconSet.id } },
        update: iconUpdateData,
        create: {
          name,
          icon_set_id: iconSet.id,
          ...iconUpdateData,
        },
      });

      iconMap.set(name, savedIcon.id);
    }

    // ========== 设置 icon-set 的 sample ==========

    const samples = setIconSetSample(iconSetInfo, iconMap, icons);
    await ctx.iconSet.update({
      where: { id: iconSet.id },
      data: { samples },
    });

    // ========== icons 别名录入 ==========

    if (!data.aliases) return;

    for (const [name, alias] of Object.entries(data.aliases)) {
      const parentIconId = iconMap.get(alias.parent);
      if (!parentIconId) {
        console.error(`【${iconSetInfo.name}】`, '没有 parentIconId 的 alias:', alias.parent);
        return;
      }

      const iconUpdateData = {
        pid: parentIconId,
        top: alias.top,
        left: alias.left,
        width: alias.width,
        height: alias.height,
        h_flip: alias.hFlip,
        v_flip: alias.vFlip,
      };

      await ctx.icon.upsert({
        where: { icon_set_id_name: { name, icon_set_id: iconSet.id } },
        update: iconUpdateData,
        create: {
          name,
          icon_set_id: iconSet.id,
          ...iconUpdateData,
        },
      });
    }
  });
};

const setIconSetSample = (iconSetInfo: IconifyInfo, iconMap: Map<string, number>, icons: [string, ExtendedIconifyIcon][]) => {
  const sample: number[] = [];
  if (iconSetInfo.samples?.length) {
    for (const iconName of iconSetInfo.samples) {
      const iconId = iconMap.get(iconName);
      if (!iconId) continue;
      sample.push(iconId);
      if (sample.length === 6) break;
    }
  }

  if (sample.length === 6) return sample;

  for (const [name] of icons) {
    const id = iconMap.get(name);
    if (!id) continue;
    if (sample.includes(id)) continue;
    sample.push(id);
    if (sample.length === 6) break;
  }

  return sample;
};
