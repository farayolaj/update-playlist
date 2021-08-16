import { fileURLToPath } from 'url';
import { getHome } from '../controllers';
export { default as metaSearch } from './AcrApi';

const context = {
  cwd: getHome(),
};

export const getCwd = () => context.cwd;
export const setCwd = (cwd: string) => (context.cwd = cwd);
