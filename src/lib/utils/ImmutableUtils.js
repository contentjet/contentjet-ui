export function immutableMove(list, fromIndex, toIndex) {
  const fromItem = list.get(fromIndex);
  const toItem = list.get(toIndex);
  return list.set(fromIndex, toItem).set(toIndex, fromItem);
}
