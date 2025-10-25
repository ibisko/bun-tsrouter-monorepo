import { EosIconsBubbleLoading, IxCertificateErrorFilled, IxCertificateSuccessFilled } from '@packages/ui';

type StatusProps = {
  status: 'ok' | 'failed' | '';
};
export const Status = ({ status }: StatusProps) => {
  return (
    <>
      {!status && <EosIconsBubbleLoading className="text-xl" />}
      {status === 'ok' && <IxCertificateSuccessFilled className="text-xl text-green-500" />}
      {status === 'failed' && <IxCertificateErrorFilled className="text-xl text-red-500" />}
    </>
  );
};
