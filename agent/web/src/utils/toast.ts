// import { toast } from 'sonner';

// type WrapperToastOptions = {
//   success?: string;
// };
// export const wrapperToast = async <T>(cb: () => Promise<T>, optional?: WrapperToastOptions) => {
//   try {
//     await cb();
//     toast.success(optional?.success || '执行成功');
//   } catch (error) {
//     error instanceof Error && toast.error(error.message);
//   }
// };

// type WrapperLoadingToastParam<T> = {
//   setLoading: (loading: boolean) => void;
//   api: () => Promise<T>;
//   reload: () => void;
// };
// export const wrapperLoadingToast = async <T>(
//   { setLoading, api, reload }: WrapperLoadingToastParam<T>,
//   optional?: WrapperToastOptions,
// ) => {
//   setLoading(true);
//   try {
//     await api();
//     reload();
//     toast.success(optional?.success || '执行成功');
//   } catch (error) {
//     error instanceof Error && toast.error(error.message);
//   }
//   setLoading(false);
// };
