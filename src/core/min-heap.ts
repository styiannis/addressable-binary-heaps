import { IHeapArray } from '../types';
import * as heap from './heap';
import {
  getLeftChildIndex,
  getParentIndex,
  getRightChildIndex,
  swapHeapNodes,
} from './heap.util';

/* ----------------------------------------- */
/* ---------- // Helper functions ---------- */
/* ----------------------------------------- */

/**
 * Rebalance the min-heap array by moving one of its elements down.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param index - The array index of heap element.
 */
function heapifyDown<H extends IHeapArray>(instance: H, index: number) {
  let i = index;
  let li = getLeftChildIndex(i);
  while (li < instance.length) {
    const ri = getRightChildIndex(i);

    const lowerKeyIndex =
      ri < instance.length && instance[ri].key < instance[li].key ? ri : li;

    if (instance[i].key <= instance[lowerKeyIndex].key) {
      break;
    }

    swapHeapNodes(instance, i, lowerKeyIndex);

    i = lowerKeyIndex;
    li = getLeftChildIndex(i);
  }
}

/**
 * Rebalance the min-heap array by moving one of its elements up.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param index - The array index of heap element.
 */
function heapifyUp<H extends IHeapArray>(instance: H, index: number) {
  for (
    let i = index, pi = getParentIndex(i);
    0 <= pi && instance[pi].key > instance[i].key;
    i = pi, pi = getParentIndex(i)
  ) {
    swapHeapNodes(instance, i, pi);
  }
}

/* ----------------------------------------- */
/* ---------- Helper functions // ---------- */
/* ----------------------------------------- */

/**
 * Creates a new min-heap instance.
 *
 * @typeParam H - The type of min-heap.
 * @param [initialNodes] - Array of unsorted heap elements.
 */
export function create<H extends IHeapArray>(
  initialNodes?: H[0][] | Readonly<H[0][]>
) {
  const instance = [] as unknown as H;
  instance.indices = new WeakMap();
  initialNodes?.forEach((node) => add(instance, node));
  return instance;
}

/**
 * Clears a min-heap instance.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 */
export function clear<H extends IHeapArray>(instance: H) {
  return heap.clear(instance);
}

/**
 * Returns the size of min-heap.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 */
export function size<H extends IHeapArray>(instance: H) {
  return heap.size(instance);
}

/**
 * Adds an element to the min-heap.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param node - The element to add.
 */
export function add<H extends IHeapArray>(instance: H, node: H[0]) {
  instance.indices.set(node, instance.length);
  instance.push(node);
  heapifyUp(instance, instance.length - 1);
}

/**
 * Returns the top element of the min-heap.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @returns The top element or `undefined` if the heap is empty.
 */
export function peek<H extends IHeapArray>(instance: H) {
  return heap.peek(instance);
}

/**
 * Removes and returns the top element of the min-heap.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @returns The removed element or `undefined` if the heap is empty.
 */
export function pop<H extends IHeapArray>(instance: H) {
  if (0 === instance.length) {
    return;
  }

  if (1 === instance.length) {
    return instance.pop() as H[0];
  }

  swapHeapNodes(instance, 0, instance.length - 1);

  const ret = instance.pop() as H[0];

  if (ret) {
    instance.indices.delete(ret);
  }

  heapifyDown(instance, 0);

  return ret;
}

/**
 * Removes an element from the min-heap.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param node - The element to remove.
 * @returns `true` or `false` depending on the outcome of the removal process.
 */
export function remove<H extends IHeapArray>(instance: H, node: H[0]) {
  if (0 === instance.length) {
    return false;
  }

  if (node === instance[instance.length - 1]) {
    instance.pop();
    return true;
  }

  const index = instance.indices.get(node);

  if (undefined === index) {
    return false;
  }

  swapHeapNodes(instance, index, instance.length - 1);

  let ret = false;

  const poppedNode = instance.pop();

  if (poppedNode) {
    ret = instance.indices.delete(poppedNode);
  }

  if (ret) {
    heapifyDown(instance, index);
  }

  return ret;
}

/**
 * Increases the key value of a min-heap element.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param node - The element whose key value will be increased.
 * @param increaseValue - The value of increase.
 * @returns `true` or `false` depending on the outcome of the increase process.
 */
export function increase<H extends IHeapArray>(
  instance: H,
  node: H[0],
  increaseValue: number
) {
  const index = instance.indices.get(node);

  if (undefined === index) {
    return false;
  }

  node.key += increaseValue;
  heapifyDown(instance, index);

  return true;
}

/**
 * Decreases the key value of a min-heap element.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param node - The element whose key value will be decreased.
 * @param dencreaseValue - The value of decrease.
 * @returns `true` or `false` depending on the outcome of the decrease process.
 */
export function decrease<H extends IHeapArray>(
  instance: H,
  node: H[0],
  dencreaseValue: number
) {
  const index = instance.indices.get(node);

  if (undefined === index) {
    return false;
  }

  node.key -= dencreaseValue;
  heapifyUp(instance, index);

  return true;
}

/**
 * Returns an iterator for traversing the min-heap elements.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param [reversed=false] - If `true`, the iterator will traverse the min-heap in reverse order.
 * @returns A generator that yields min-heap elements in the provided order.
 */
export function entries<H extends IHeapArray>(instance: H, reversed = false) {
  return heap.entries(instance, reversed);
}

/**
 * Returns an iterator for traversing the min-heap element keys.
 *
 * @typeParam H - The type of min-heap.
 * @param instance - The min-heap instance.
 * @param [reversed=false] - If `true`, the iterator will traverse the min-heap in reverse order.
 * @returns A generator that yields min-heap element keys in the provided order.
 */
export function keys<H extends IHeapArray>(instance: H, reversed = false) {
  return heap.keys(instance, reversed);
}
