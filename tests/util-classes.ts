import { IHeapArray, MaxHeap, MinHeap } from '../src';

function heapKeys<H extends MaxHeap | MinHeap>(heap: H) {
  const keys: number[] = [];
  for (let node of heap) {
    keys.push(node.key);
  }
  return keys;
}

export function addAndValidate<H extends MaxHeap | MinHeap>(
  instance: H,
  key: number,
  expected: number[]
) {
  expect(instance.add({ key })).toBe(undefined);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function popAndValidate<H extends MaxHeap | MinHeap>(
  instance: H,
  key: number,
  expected: number[]
) {
  expect(instance.peek()?.key).toBe(key);
  expect(instance.pop()?.key).toBe(key);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function removeAndValidate<H extends MaxHeap | MinHeap>(
  instance: H,
  node: IHeapArray[0],
  expected: number[]
) {
  expect(instance.remove(node)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function increaseAndValidate<H extends MaxHeap | MinHeap>(
  instance: H,
  node: IHeapArray[0],
  increaseValue: number,
  expected: number[]
) {
  expect(instance.increase(node, increaseValue)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function decreaseAndValidate<H extends MaxHeap | MinHeap>(
  instance: H,
  node: IHeapArray[0],
  decreaseValue: number,
  expected: number[]
) {
  expect(instance.decrease(node, decreaseValue)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function isValidEmptyHeap<H extends MaxHeap | MinHeap>(instance: H) {
  return (
    0 === instance.size &&
    undefined === instance.peek() &&
    undefined === instance.pop()
  );
}
