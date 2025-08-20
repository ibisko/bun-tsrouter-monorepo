import { proxy } from 'valtio';

type DemoStore = {
  data1: string;
};

const initialDemoStore: DemoStore = {
  data1: '',
};

export const demoStore = proxy<DemoStore>(initialDemoStore);

/** 重置状态 */
export const resetDemoStore = () => Object.assign(demoStore, initialDemoStore);
