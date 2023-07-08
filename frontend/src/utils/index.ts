export const Noop = () => {};
export const mapify = <Key extends string, T extends Record<Key, string>>(
  key: Key,
  array?: Array<T>
) => {
  if (!array) {
    return {};
  }

  if (!Array.isArray(array)) {
    return {};
  }
  return array.reduce(
    (map, value) => ({ [value[key]]: value, ...map }),
    Object.create(null)
  );
};
