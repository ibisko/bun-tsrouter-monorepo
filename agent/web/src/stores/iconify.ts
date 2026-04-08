import { Api } from '@/api';
import { proxy } from 'valtio';

type IconifyStore = {
  localIcons: ListIconResponse;
};

const initialIconifyStore: IconifyStore = {
  localIcons: [],
};

export const iconifyStore = proxy<IconifyStore>(initialIconifyStore);

const fetchLocalIcons = async () => {
  const list = await Api.iconifyRouter.local.listIcon.get();
  iconifyStore.localIcons = list;
};

type ListIconResponse = Awaited<ReturnType<typeof Api.iconifyRouter.local.listIcon.get>>;

export const iconifyAction = {
  fetchLocalIcons,
};
