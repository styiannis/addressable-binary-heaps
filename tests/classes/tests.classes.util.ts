import { MaxHeap, MinHeap } from '../../src';
import { IHeapArray } from '../../src/types';
import { heapKeys } from '../tests.util';

export function addAndValidate(
  heap: MaxHeap | MinHeap,
  key: number,
  expected: number[]
) {
  expect(heap.add({ key })).toBe(undefined);
  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function popAndValidate(
  heap: MaxHeap | MinHeap,
  key: number,
  expected: number[]
) {
  expect(heap.peek()?.key).toBe(key);
  expect(heap.pop()?.key).toBe(key);
  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function removeAndValidate(
  heap: MaxHeap | MinHeap,
  node: IHeapArray[0],
  expected: number[]
) {
  expect(heap.remove(node)).toBe(true);
  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function increaseAndValidate(
  heap: MaxHeap | MinHeap,
  node: IHeapArray[0],
  increaseValue: number,
  expected: number[]
) {
  expect(heap.increase(node, increaseValue)).toBe(true);
  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function decreaseAndValidate(
  heap: MaxHeap | MinHeap,
  node: IHeapArray[0],
  decreaseValue: number,
  expected: number[]
) {
  expect(heap.decrease(node, decreaseValue)).toBe(true);
  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function isValidEmptyHeapInstance(heap: MaxHeap | MinHeap) {
  return (
    0 === heap.size && undefined === heap.peek() && undefined === heap.pop()
  );
}
