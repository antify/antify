import jiti from 'jiti';

export function tryRequire(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true, esmResolve: true });

  try {
    return _require(id);
  } catch (error: any) {
    if (error.code !== 'MODULE_NOT_FOUND') {
      throw error;

      // console.error(`Error trying import ${id} from ${rootDir}`, error);
    }

    return {};
  }
}

export function require(id: string, rootDir: string = process.cwd()) {
  const _require = jiti(rootDir, { interopDefault: true, esmResolve: true });

  return _require(id);
}

export function convertTwoDigits(number: number): string {
  return number < 10 ? `0${number}` : `${number}`;
}
