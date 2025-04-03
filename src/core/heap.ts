import { IHeapArray } from '../types';

/**
 * Clears the heap by removing all elements and their index mappings.
 *
 * @typeParam H - The type of heap array, must extend `IHeapArray`.
 * @param instance - The heap instance to clear.
 */
export function clear<H extends IHeapArray>(instance: H) {
  instance.forEach((node) => instance.indices.delete(node));
  instance.length = 0;
}

/**
 * Returns the current number of elements in the heap.
 *
 * @typeParam H - The type of heap array, must extend `IHeapArray`.
 * @param instance - The heap instance to check.
 * @returns The number of elements in the heap.
 */
export function size<H extends IHeapArray>(instance: H) {
  return instance.length;
}

/**
 * Returns the top element of heap without removing it.
 * - For min-heaps, this is the minimum element.
 * - For max-heaps, this is the maximum element.
 *
 * @typeParam H - The type of heap array, must extend `IHeapArray`.
 * @param instance - The heap instance to peek.
 * @returns The top element if heap is not empty, `undefined` otherwise.
 */
export function peek<H extends IHeapArray>(instance: H) {
  return 0 === instance.length ? undefined : (instance[0] as H[0]);
}

/**
 * Generates an iterator that traverses the heap elements.
 *
 * *Note*: The traversal follows the order of the underlying array, not the priority order.
 *
 * @typeParam H - The type of heap array, must extend `IHeapArray`.
 * @param instance - The heap instance to traverse.
 * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
 * @returns A generator yielding heap elements in the specified order.
 */
export function* entries<H extends IHeapArray>(instance: H, reversed: boolean) {
  if (reversed) {
    for (let i = instance.length - 1; i >= 0; i--) {
      yield instance[i] as H[0];
    }
  } else {
    for (let i = 0; i < instance.length; i++) {
      yield instance[i] as H[0];
    }
  }
}

/**
 * Generates an iterator that traverses the keys of heap elements.
 *
 * *Note*: The traversal follows the order of the underlying array, not the priority order.
 *
 * @typeParam H - The type of heap array, must extend `IHeapArray`.
 * @param instance - The heap instance to traverse.
 * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
 * @returns A generator yielding heap element keys in the specified order.
 */
export function* keys<H extends IHeapArray>(instance: H, reversed: boolean) {
  if (reversed) {
    for (let i = instance.length - 1; i >= 0; i--) {
      yield instance[i].key;
    }
  } else {
    for (let i = 0; i < instance.length; i++) {
      yield instance[i].key;
    }
  }
}
