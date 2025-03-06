import { IHeapArray, maxHeap, minHeap } from '../../src';
import { isValidObjectInstance } from '../tests.util';
import {
  getLeftChildIndex,
  getRightChildIndex,
} from '../../src/core/heap.util';

/* ----------------------------------------- */
/* ---------- // Helper functions ---------- */
/* ----------------------------------------- */

function heapKeys(heap: IHeapArray) {
  const ret: number[] = [];

  for (let i = 0; i < heap.length; i++) {
    ret.push(heap[i].key);
  }

  return ret;
}

function isValidMaxHeap<A extends IHeapArray>(instance: A) {
  let isValid = true;

  const fn = (index: number) => {
    if (undefined !== instance[index]) {
      const li = getLeftChildIndex(index);
      const ri = getRightChildIndex(index);

      if (undefined !== instance[li]) {
        if (instance[index].key < instance[li].key) {
          isValid = false;
          return;
        }

        fn(li);
      }

      if (undefined !== instance[ri]) {
        if (instance[index].key < instance[ri].key) {
          isValid = false;
          return;
        }

        fn(ri);
      }
    }
  };

  fn(0);

  return isValid;
}

function isValidMinHeap<A extends IHeapArray>(instance: A) {
  let isValid = true;

  const fn = (index: number) => {
    if (undefined !== instance[index]) {
      const li = getLeftChildIndex(index);
      const ri = getRightChildIndex(index);

      if (undefined !== instance[li]) {
        if (instance[index].key > instance[li].key) {
          isValid = false;
          return;
        }

        fn(li);
      }

      if (undefined !== instance[ri]) {
        if (instance[index].key > instance[ri].key) {
          isValid = false;
          return;
        }

        fn(ri);
      }
    }
  };

  fn(0);

  return isValid;
}

/* ----------------------------------------- */
/* ---------- Helper functions // ---------- */
/* ----------------------------------------- */

export function addAndValidate(
  instanceType: 'max-heap' | 'min-heap',
  heap: IHeapArray,
  value: number,
  expected: number[]
) {
  const node = { key: value };

  expect(isValidObjectInstance(node, 'heap-node')).toBe(true);

  if ('max-heap' === instanceType) {
    expect(isValidMaxHeap(heap)).toBe(true);
    expect(maxHeap.add(heap, node)).toBe(undefined);
  } else {
    expect(isValidMinHeap(heap)).toBe(true);
    expect(minHeap.add(heap, node)).toBe(undefined);
  }

  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function popAndValidate(
  instanceType: 'max-heap' | 'min-heap',
  heap: IHeapArray,
  key: number,
  expected: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.peek(heap)?.key).toBe(key);
    expect(maxHeap.pop(heap)?.key).toStrictEqual(key);
    expect(isValidMaxHeap(heap)).toBe(true);
  } else {
    expect(minHeap.peek(heap)?.key).toBe(key);
    expect(minHeap.pop(heap)?.key).toStrictEqual(key);
    expect(isValidMinHeap(heap)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function removeAndValidate(
  instanceType: 'max-heap' | 'min-heap',
  heap: IHeapArray,
  node: IHeapArray[0],
  expected: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.remove(heap, node)).toBe(true);
  } else {
    expect(minHeap.remove(heap, node)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function increaseAndValidate(
  instanceType: 'max-heap' | 'min-heap',
  heap: IHeapArray,
  node: IHeapArray[0],
  increaseValue: number,
  expected: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.increase(heap, node, increaseValue)).toBe(true);
  } else {
    expect(minHeap.increase(heap, node, increaseValue)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function decreaseAndValidate(
  instanceType: 'max-heap' | 'min-heap',
  heap: IHeapArray,
  node: IHeapArray[0],
  decreaseValue: number,
  expected: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.decrease(heap, node, decreaseValue)).toBe(true);
  } else {
    expect(minHeap.decrease(heap, node, decreaseValue)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expected);
}

export function isValidEmptyMaxHeapObj(heap: IHeapArray) {
  return (
    0 === heap.length &&
    undefined === maxHeap.peek(heap) &&
    undefined === maxHeap.pop(heap)
  );
}

export function isValidEmptyMinHeapObj(heap: IHeapArray) {
  return (
    0 === heap.length &&
    undefined === minHeap.peek(heap) &&
    undefined === minHeap.pop(heap)
  );
}
