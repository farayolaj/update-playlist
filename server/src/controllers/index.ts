import { readdirSync, statSync } from 'fs';
import { parse, join } from 'path';
import os from 'os';

const HOME_DIR = os.homedir();

export const getHome = () => HOME_DIR;

const supportedFormats = ['.mp3', '.ogg', '.wma'];

export const ls = (path: string) => {
  return readdirSync(path, {
    withFileTypes: true,
  })
    .filter((dirent) => {
      return (
        dirent.isDirectory() ||
        (dirent.isFile() && supportedFormats.includes(parse(join(path, dirent.name)).ext))
      );
    })
    .map((dirent) => {
      const ret: {
        cwd: string;
        name: string;
        size?: number;
      } = {
        cwd: path,
        name: dirent.name,
      };
      if (dirent.isFile()) ret.size = statSync(join(path, dirent.name)).size;
      return ret;
    });
};

export const fileExists = (path: string) => {
  let res = true;

  try {
    statSync(path);
  } catch (error: unknown) {
    res = false;
  }

  return res;
}

export const isChild = (child: string, parent: string) => {
  return readdirSync(parent).includes(child) || child === '..';
};
