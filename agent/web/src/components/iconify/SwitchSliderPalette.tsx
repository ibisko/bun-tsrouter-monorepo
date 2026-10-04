import { useMemo } from 'react';
import { SwitchSlider } from '@packages/ui';
import { IcBaselineInvertColors, IcBaselineInvertColorsOff } from '@packages/icons';

type PaletteValue = 'mono' | 'both' | 'palette';

type SwitchSliderPaletteProps = Omit<React.ComponentProps<typeof SwitchSlider>, 'onChange' | 'value' | 'options'> & {
  palette?: boolean;
  onChange: (palette?: boolean) => void;
};

export const SwitchSliderPalette = ({ palette, onChange, ...props }: SwitchSliderPaletteProps) => {
  const defaultValue = useMemo<PaletteValue>(() => {
    switch (palette) {
      case undefined:
        return 'both';
      case true:
        return 'palette';
      case false:
        return 'mono';
    }
  }, [palette]);

  const onChangeBefore = (e: PaletteValue) => {
    switch (e) {
      case 'mono':
        onChange(false);
        break;
      case 'both':
        onChange(undefined);
        break;
      case 'palette':
        onChange(true);
        break;
    }
  };

  return (
    <SwitchSlider<PaletteValue>
      {...props}
      onChange={onChangeBefore}
      value={defaultValue}
      options={[
        { label: <IcBaselineInvertColorsOff className="size-5" />, value: 'mono' },
        { label: <span className="">Both</span>, value: 'both' },
        { label: <IcBaselineInvertColors className="size-5" />, value: 'palette' },
      ]}
    />
  );
};
