import type { LoginTestData } from '../utils/types/LoginTestData';

/** Shared state between Cucumber steps in the same scenario. */
export const world = {
  loginData: null as LoginTestData | null,
  dataSource: '' as string,
};
