import { MaxHeap, MinHeap } from '../../src';
import { IHeapArray } from '../../src/types';
import { heapKeys } from '../tests.util';

export function addAndValidate(
  instance: MaxHeap | MinHeap,
  key: number,
  expected: number[]
) {
  expect(instance.add({ key })).toBe(undefined);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function popAndValidate(
  instance: MaxHeap | MinHeap,
  key: number,
  expected: number[]
) {
  expect(instance.peek()?.key).toBe(key);
  expect(instance.pop()?.key).toBe(key);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function removeAndValidate(
  instance: MaxHeap | MinHeap,
  node: IHeapArray[0],
  expected: number[]
) {
  expect(instance.remove(node)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function increaseAndValidate(
  instance: MaxHeap | MinHeap,
  node: IHeapArray[0],
  increaseValue: number,
  expected: number[]
) {
  expect(instance.increase(node, increaseValue)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function decreaseAndValidate(
  instance: MaxHeap | MinHeap,
  node: IHeapArray[0],
  decreaseValue: number,
  expected: number[]
) {
  expect(instance.decrease(node, decreaseValue)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expected);
}

export function isValidEmptyHeap(instance: MaxHeap | MinHeap) {
  return (
    0 === instance.size &&
    undefined === instance.peek() &&
    undefined === instance.pop()
  );
}
