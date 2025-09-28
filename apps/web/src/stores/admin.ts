import { proxy } from 'valtio';
import { type Nullable } from '@packages/utils';

type AuthStore = Nullable<{
  token: string;
  refreshToken: string;
}>;
const initialAuthStore: AuthStore = {
  token: null,
  refreshToken: null,
};

export const authStore = proxy(initialAuthStore);
