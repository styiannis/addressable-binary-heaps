import { IHeapArray } from '../types';

/**
 * Returns the index of the parent of a heap array element.
 *
 * @param index - The index of heap array element.
 * @returns The index of the parent element.
 */
export function getParentIndex(index: number) {
  return 0 === index ? -1 : Math.floor((index - 1) / 2);
}

/**
 * Returns the index of the left child of a heap array element.
 *
 * @param index - The index of heap array element.
 * @returns The index of the left child element.
 */
export function getLeftChildIndex(index: number) {
  return 2 * index + 1;
}

/**
 * Returns the index of the right child of a heap array element.
 *
 * @param index - The index of heap array element.
 * @returns The index of the right child element.
 */
export function getRightChildIndex(index: number) {
  return 2 * index + 2;
}

/**
 * Swaps the position of two elements in a heap array.
 *
 * @typeParam H - The type of heap.
 * @param instance - The heap instance.
 * @param firstIndex - The array index of the first element.
 * @param secondIndex - The array index of the second element.
 */
export function swapHeapNodes<H extends IHeapArray = IHeapArray>(
  instance: H,
  firstIndex: number,
  secondIndex: number
) {
  const node = instance[firstIndex];
  instance[firstIndex] = instance[secondIndex];
  instance[secondIndex] = node;
  instance.indices.set(instance[firstIndex], firstIndex);
  instance.indices.set(instance[secondIndex], secondIndex);
}
