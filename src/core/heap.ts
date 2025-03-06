import { IHeapArray } from '../types';

/**
 * Clears the heap by resetting the length of heap array.
 *
 * @typeParam H - The type of heap.
 * @param instance - The heap instance.
 */
export function clear<H extends IHeapArray>(instance: H) {
  instance.length = 0;
}

/**
 * Returns the heap size.
 *
 * @typeParam H - The type of heap.
 * @param instance - The heap instance.
 */
export function size<H extends IHeapArray>(instance: H) {
  return instance.length;
}

/**
 * Returns the top element of heap.
 *
 * @typeParam H - The type of heap.
 * @param instance - The heap instance.
 */
export function peek<H extends IHeapArray>(instance: H) {
  return 0 === instance.length ? undefined : (instance[0] as H[0]);
}

/**
 * Generates an iterator that traverses the heap elements.
 *
 * @typeParam H - The type of heap.
 * @param instance - The heap instance.
 * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
 * @returns A generator that yields heap elements in the provided order.
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
 * @typeParam H - The type of heap.
 * @param instance - The heap instance.
 * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
 * @returns A generator that yields heap element keys in the provided order.
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
