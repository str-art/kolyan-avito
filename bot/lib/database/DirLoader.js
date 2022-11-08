import path from "path";
import { readdir } from "node:fs/promises";

export default class DirLoader {
  async loadDir(dirName, recursive = false) {
    let functions = [];

    let files = await readdir(dirName, { withFileTypes: true });

    for (const { name, isDirectory } of files) {
      const __path = path.join(dirName, name);

      if (recursive && isDirectory()) {
        functions.push(this.loadDir(__path, recursive));
      } else {
        const { default: module } = await import(__path);
        functions.push(module);
      }
    }

    return functions;
  }
}
