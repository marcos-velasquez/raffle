export const deepClone = <T>(obj: T): T => {
  const cloned = Object.create(Object.getPrototypeOf(obj));
  for (const key of Object.getOwnPropertyNames(obj)) {
    const desc = Object.getOwnPropertyDescriptor(obj, key);
    if (desc && typeof desc.value === 'function') {
      Object.defineProperty(cloned, key, desc);
    } else if (desc && desc.value && typeof desc.value === 'object') {
      Object.defineProperty(cloned, key, { ...desc, value: deepClone(desc.value) });
    } else if (desc) {
      Object.defineProperty(cloned, key, desc);
    }
  }
  return cloned;
};
