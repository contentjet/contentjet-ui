export function immutableMove(list, fromIndex, toIndex) {
  let fromItem = list.get(fromIndex);
  let toItem = list.get(toIndex);
  return list.set(fromIndex, toItem).set(toIndex, fromItem);
}
