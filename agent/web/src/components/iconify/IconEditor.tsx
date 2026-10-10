import { Button, cn, useInitial } from '@packages/ui';
import { useState } from 'react';
import { IconSvg } from './IconSvg';
import { IconifyApi } from './api';
import { ElShoppingCartSign } from '@packages/icons';
import { CodemirrorEditor } from '@/components/editor';
import { toast } from 'sonner';
import { camelCase } from 'lodash-es';
import { Api } from '@/api';

type IconEditorProps = {
  name: string;
  body: string;
  top: number;
  left: number;
  width: number;
  height: number;
  sign: string;
  animate?: boolean;
  content?: string;
  filePath?: string;
};

export const IconEditor = ({ name, body, top, left, width, height, sign, animate, content, filePath }: IconEditorProps) => {
  const [fileName, setFileName] = useState('');
  const [code, setCode] = useState(content);

  useInitial(async () => {
    const camel = camelCase(name);
    const fileName = camel.slice(0, 1).toUpperCase() + camel.slice(1);
    setFileName(fileName);

    if (!content) {
      const res = await IconifyApi.iconifyLocal.reactCompoment.post({ body, top, left, width, height, sign });
      setCode(res.code);
    }
  });

  const appendIcon = async () => {
    await Api.iconifyLocal.appendIcon.post({
      sign: sign,
      body: body,
      top: top,
      left: left,
      width: width,
      height: height,
    });
    toast.success(`添加图标成功 ${fileName}.tsx`);
  };

  return (
    <div>
      <div className="flex gap-4">
        <div>
          <IconSvg className={cn('size-32')} body={body} top={top} left={left} width={width} height={height} animate={animate} />
          <div className="flex justify-center gap-2 text-xs mt-2">
            {(!!left || !!top) && <span>{`(${left},${top})`}</span>}
            <span>{`${width}x${height}`}</span>
          </div>
        </div>

        <CodemirrorEditor className="flex-1 xl:w-[60vw] not-xl:w-[80vw] min-h-80 max-h-120 shadow" value={code} readOnly />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          className=""
          variant="outline"
          onClick={() => {
            window.location.assign(`vscode://file/${filePath}`);
          }}
          disabled={!filePath}>
          Open in Vscode
        </Button>

        {/* local 就重写 */}
        <Button className="" variant={filePath ? 'outline' : 'default'} onClick={appendIcon}>
          {filePath ? 'Rewrite' : 'Add'} <span className="">{fileName}</span>
          <ElShoppingCartSign className="size-5" />
        </Button>
      </div>
    </div>
  );
};
