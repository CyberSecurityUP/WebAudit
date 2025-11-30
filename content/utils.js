export function entropy(str) {
  const map = new Map();
  for (const c of str) map.set(c, (map.get(c) || 0) + 1);
  return [...map].reduce((sum, [, count]) => {
    const p = count / str.length;
    return sum - p * Math.log2(p);
  }, 0);
}

export function maskKey(str) {
  return str.slice(0, 6) + "..." + str.slice(-4);
}
