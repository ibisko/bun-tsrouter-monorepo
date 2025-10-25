type FormErrorMessageProps = {
  children: React.ReactNode;
};
export const FormErrorMessage = ({ children }: FormErrorMessageProps) => {
  return <div className="px-2 text-red-500/90 text-sm font-bold">{children}</div>;
};
