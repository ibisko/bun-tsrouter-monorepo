import { proxy } from 'valtio';
import type { Nullable } from '@packages/utils';
import type { UserRole } from '@apps/prisma';
import { Api } from '@/api';
import { redirect } from '@tanstack/react-router';

type UserStore = Nullable<{
  token: string;
  refreshToken: string;
  userId: number;
  account: string;
  role: UserRole;
}>;

const initialUserStore: UserStore = {
  token: null,
  refreshToken: null,
  userId: null,
  account: null,
  role: null,
};

export const userStore = proxy(initialUserStore);

const login = async (account: string, password: string) => {
  const response = await Api.auth.login.post({ account, password });
  userStore.token = response.token;
  userStore.refreshToken = response.refreshToken;
  userStore.account = response.account;
  userStore.userId = response.id;
  userStore.role = response.role;

  localStorage.setItem('token', userStore.token);
  localStorage.setItem('refreshToken', userStore.refreshToken);
};

const initUserInfo = async () => {
  if (!userStore.token) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw redirect({ to: '/', replace: true });
    }
    userStore.token = token;
  }

  if (!userStore.refreshToken) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw redirect({ to: '/', replace: true });
    }
    userStore.refreshToken = refreshToken;
  }

  if (!userStore.role) {
    try {
      const res = await Api.user.getUserInfo.get();
      userStore.account = res.account;
      userStore.role = res.role;
      userStore.userId = res.id;
    } catch (error) {
      throw redirect({ to: '/', replace: true });
    }
  }
};

export const userActions = {
  login,
  initUserInfo,
};
