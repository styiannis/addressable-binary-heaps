import { IHeapArray, maxHeap, minHeap } from '../../src';
import { isValidObjectInstance } from '../tests.util';
import {
  getLeftChildIndex,
  getRightChildIndex,
} from '../../src/core/heap.util';

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
  heap: A,
  value: number,
  expectedKeys: number[]
) {
  const node = { key: value };

  expect(isValidObjectInstance(node, 'heap-node')).toBe(true);
  expect(isValidHeap(instanceType, heap)).toBe(true);

  if ('max-heap' === instanceType) {
    expect(maxHeap.add(heap, node)).toBe(undefined);
  } else {
    expect(minHeap.add(heap, node)).toBe(undefined);
  }

  expect(heapKeys(heap)).toStrictEqual(expectedKeys);
}

export function popAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  heap: A,
  rootNodeKey: number,
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.peek(heap)?.key).toBe(rootNodeKey);
    expect(maxHeap.pop(heap)?.key).toBe(rootNodeKey);
  } else {
    expect(minHeap.peek(heap)?.key).toBe(rootNodeKey);
    expect(minHeap.pop(heap)?.key).toBe(rootNodeKey);
  }

  expect(isValidHeap(instanceType, heap)).toBe(true);
  expect(heapKeys(heap)).toStrictEqual(expectedKeys);
}

export function removeAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  heap: A,
  removeNode: A[0],
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.remove(heap, removeNode)).toBe(true);
  } else {
    expect(minHeap.remove(heap, removeNode)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expectedKeys);
}

export function increaseAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  heap: A,
  increaseNode: A[0],
  increaseValue: number,
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.increase(heap, increaseNode, increaseValue)).toBe(true);
  } else {
    expect(minHeap.increase(heap, increaseNode, increaseValue)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expectedKeys);
}

export function decreaseAndValidate<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  heap: A,
  decreaseNode: A[0],
  decreaseValue: number,
  expectedKeys: number[]
) {
  if ('max-heap' === instanceType) {
    expect(maxHeap.decrease(heap, decreaseNode, decreaseValue)).toBe(true);
  } else {
    expect(minHeap.decrease(heap, decreaseNode, decreaseValue)).toBe(true);
  }

  expect(heapKeys(heap)).toStrictEqual(expectedKeys);
}

export function isValidEmptyHeapObject<A extends IHeapArray>(
  instanceType: 'max-heap' | 'min-heap',
  heap: A
) {
  if ('max-heap' === instanceType) {
    return (
      0 === heap.length &&
      undefined === maxHeap.peek(heap) &&
      undefined === maxHeap.pop(heap)
    );
  }

  return (
    0 === heap.length &&
    undefined === minHeap.peek(heap) &&
    undefined === minHeap.pop(heap)
  );
}
