type TestCardProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
};
export const TestCard = ({ title, description, children }: TestCardProps) => {
  return (
    <div className="shadow flex justify-between gap-4 p-2">
      <div>
        <div className="">{title}</div>
        <div className="text-sm text-gray-500">{description}</div>
      </div>
      {children}
    </div>
  );
};
