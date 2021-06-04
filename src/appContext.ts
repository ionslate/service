import { AsyncLocalStorage } from 'async_hooks';
import { User } from './__generatedTypes__';

const appContext = new AsyncLocalStorage<Map<'user', User | undefined>>();
export default appContext;

export function setAppContext({ user }: { user?: User }): void {
  appContext.getStore()?.set('user', user);
}

export function getAppContext(): { user?: User } {
  return { user: appContext.getStore()?.get('user') };
}
