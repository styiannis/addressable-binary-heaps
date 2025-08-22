import { IHeapArray, maxHeap, minHeap } from '../../src';
import {
  getLeftChildIndex,
  getRightChildIndex,
} from '../../src/core/heap.util';
import { isValidObjectInstance } from '../tests-util';

/* ----------------------------------------- */
/* ---------- // Helper functions ---------- */
/* ----------------------------------------- */

function heapKeys<A extends IHeapArray>(heap: A) {
  return heap.reduce((acc, { key }) => {
    acc.push(key);
    return acc;
  }, [] as number[]);
}

function isValidHeap<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A
) {
  let isValid = true;

  const stack = [0];
  for (
    let index = stack.shift();
    isValid && index !== undefined;
    index = stack.shift()
  ) {
    isValid = [getLeftChildIndex(index), getRightChildIndex(index)].reduce(
      (acc, curr) => {
        if (acc && undefined !== instance[curr]) {
          acc =
            'max-heap' === instanceType
              ? instance[index].key >= instance[curr].key
              : instance[index].key <= instance[curr].key;

          if (acc) {
            stack.push(curr);
          }
        }

        return acc;
      },
      isValid
    );
  }

  return isValid;
}

/* ----------------------------------------- */
/* ---------- Helper functions // ---------- */
/* ----------------------------------------- */

export function addAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A,
  value: number,
  expectedKeys: number[]
) {
  const node = { key: value };

  expect(isValidObjectInstance('heap-node', node)).toBe(true);
  expect(isValidHeap(instanceType, instance)).toBe(true);

  if ('max-heap' === instanceType) {
    expect(maxHeap.add(instance, node)).toBe(undefined);
  } else {
    expect(minHeap.add(instance, node)).toBe(undefined);
  }

  expect(heapKeys(instance)).toStrictEqual(expectedKeys);
}

export function popAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A,
  key: number,
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.peek(instance)?.key).toBe(key);
    expect(maxHeap.pop(instance)?.key).toBe(key);
  } else {
    expect(minHeap.peek(instance)?.key).toBe(key);
    expect(minHeap.pop(instance)?.key).toBe(key);
  }

  expect(isValidHeap(instanceType, instance)).toBe(true);
  expect(heapKeys(instance)).toStrictEqual(expectedKeys);
}

export function removeAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A,
  removeNode: A[0],
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.remove(instance, removeNode)).toBe(true);
  } else {
    expect(minHeap.remove(instance, removeNode)).toBe(true);
  }

  expect(heapKeys(instance)).toStrictEqual(expectedKeys);
}

export function increaseAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A,
  increaseNode: A[0],
  increaseValue: number,
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.increase(instance, increaseNode, increaseValue)).toBe(true);
  } else {
    expect(minHeap.increase(instance, increaseNode, increaseValue)).toBe(true);
  }

  expect(heapKeys(instance)).toStrictEqual(expectedKeys);
}

export function decreaseAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A,
  decreaseNode: A[0],
  decreaseValue: number,
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.decrease(instance, decreaseNode, decreaseValue)).toBe(true);
  } else {
    expect(minHeap.decrease(instance, decreaseNode, decreaseValue)).toBe(true);
  }

  expect(heapKeys(instance)).toStrictEqual(expectedKeys);
}

export function isValidEmptyHeap<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A
) {
  if ('max-heap' === instanceType) {
    return (
      0 === instance.length &&
      undefined === maxHeap.peek(instance) &&
      undefined === maxHeap.pop(instance)
    );
  }

  return (
    0 === instance.length &&
    undefined === minHeap.peek(instance) &&
    undefined === minHeap.pop(instance)
  );
}
