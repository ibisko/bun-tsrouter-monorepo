import { cn, Dialog } from '@packages/ui';
import { useLayoutEffect, useState } from 'react';
import { IconSvg } from './IconSvg';
import { IconEditor } from './IconEditor';
import { iconifyAction } from './action';

type IconProps = {
  className?: string;
  id?: number;
  fileName?: string;
};

type IconInfoData = {
  name: string;
  body: string;
  top: number;
  left: number;
  width: number;
  height: number;
  sign: string;
  animate?: boolean;
  filePath?: string;
  content?: string;
};

export const Icon = ({ className, id, fileName, ...props }: IconProps) => {
  const [data, setData] = useState<IconInfoData>();

  const initial = async () => {
    let res;
    if (id) {
      res = await iconifyAction.getIconInfo({ id });
    } else if (fileName) {
      res = await iconifyAction.getIconInfo({ fileName });
    }
    if (!res) return;
    if (!res.body) return;

    const sign = res.prefix === 'CUSTOM' ? res.name : `${res.prefix}:${res.name}`;

    const data: IconInfoData = {
      name: res.name,
      sign: sign,
      body: res.body,
      top: res.top,
      left: res.left,
      width: res.width,
      height: res.height,
      animate: res.animate,
    };

    if ('filePath' in res) {
      data.filePath = res.filePath;
    }
    if ('content' in res) {
      data.content = res.content;
    }

    setData(data);
  };

  useLayoutEffect(() => {
    initial();
  }, []);

  if (!data?.body) return;

  return (
    <Dialog
      className="z-10"
      trigger={
        <IconSvg
          {...props}
          className={cn('w-full h-full cursor-pointer', className)}
          body={data.body}
          top={data.top}
          left={data.left}
          width={data.width}
          height={data.height}
          animate={data.animate}
        />
      }
      title={data.sign}>
      <IconEditor
        name={data.name}
        body={data.body}
        top={data.top}
        left={data.left}
        width={data.width}
        height={data.height}
        sign={data.sign}
        animate={data.animate}
        filePath={data.filePath}
        content={data.content}
      />
    </Dialog>
  );
};
