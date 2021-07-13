import { AsyncLocalStorage } from 'async_hooks';
import { User } from './__generatedTypes__';

const USER_KEY = 'user';

interface AppContext {
  [USER_KEY]?: User;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const appContext = new AsyncLocalStorage<Map<string, any>>();
export default appContext;

export function setAppContext({ user }: AppContext): void {
  appContext.getStore()?.set(USER_KEY, user);
}

export function getAppContext(): AppContext {
  return { user: appContext.getStore()?.get(USER_KEY) };
}
