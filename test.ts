const ls = (path) => {
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
        const ret = {
            cwd: path,
            name: dirent.name,
          };
        if (dirent.isFile()) ret.size = byteSize(statSync(join(path, dirent.name)).size).toString();
        return ret;
      });
};
home = require('os').homedir()
const { readdirSync, statSync } = require('fs')
const { parse, join } = require('path')
const supportedFormats = ['.mp3', '.ogg', '.wma'];
ls(home)