export const toCamelCase = (key) => {
  return key
    .split('_')
    .map((w, idx) => {
      if (idx > 0) {
        return w[0].toUpperCase() + w.substr(1).toLowerCase();
      } else {
        return w;
      }
    })
    .join('');
};
