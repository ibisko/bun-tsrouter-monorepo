import { Card, Descriptions, type DescriptionsData } from '@packages/ui';
import { useEffect, useState } from 'react';

export const DescriptionComps = () => {
  const [descs, setDescs] = useState<DescriptionsData[]>([]);
  useEffect(() => {
    const data: DescriptionsData[] = [];
    for (let i = 0; i < 10; i++) {
      const uuid = crypto.randomUUID();
      data.push({ id: i, title: `${i}-${uuid.slice(0, 8)}`, value: uuid.slice(9) });
    }
    setDescs(data);
  }, []);

  return (
    <Card>
      <div>{'<Descriptions/>'}</div>
      <Descriptions data={descs} />
    </Card>
  );
};
