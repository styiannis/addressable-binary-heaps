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
 * Rebalances the min-heap by moving an element down to maintain heap property.
 * Compares the element with its children and swaps with the smaller child if necessary.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance to rebalance.
 * @param index - Starting index of the element to move down.
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
 * Rebalances the min-heap by moving an element up to maintain heap property.
 * Compares the element with its parent and swaps if the element is smaller.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance to rebalance.
 * @param index - Starting index of the element to move up.
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
 * Creates a new min-heap instance, optionally initialized with elements.
 *
 * @typeParam H - The type of min-heap array.
 * @param [initialNodes] - Array of unsorted heap elements to initialize with.
 * @returns A new min-heap instance
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
 * Clears a min-heap instance by removing all elements and their index mappings.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance to clear.
 */
export function clear<H extends IHeapArray>(instance: H) {
  return heap.clear(instance);
}

/**
 * Returns the current number of elements in the min-heap.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @returns The number of elements in the heap.
 */
export function size<H extends IHeapArray>(instance: H) {
  return heap.size(instance);
}

/**
 * Adds a new element to the min-heap while maintaining the heap property.
 * The element is initially added at the end and then bubbled up as needed.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @param node - The new element to add.
 */
export function add<H extends IHeapArray>(instance: H, node: H[0]) {
  instance.indices.set(node, instance.length);
  instance.push(node);
  heapifyUp(instance, instance.length - 1);
}

/**
 * Returns the minimum element (root) of the min-heap without removing it.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @returns The minimum element or `undefined` if heap is empty.
 */
export function peek<H extends IHeapArray>(instance: H) {
  return heap.peek(instance);
}

/**
 * Removes and returns the minimum element (root) from the heap.
 * Replaces root with last element and restores heap property.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @returns The minimum element or `undefined` if heap is empty
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
 * Removes a specific element from anywhere in the heap.
 * Maintains heap property after removal.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @param node - The element to remove.
 * @returns `true` if element was found and removed, `false` otherwise.
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
 * Increases the key value of a heap element by a specified amount.
 * After increase, element may need to sink down to maintain heap property.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @param node - The element to modify.
 * @param increaseValue - Amount to increase the key by.
 * @returns `true` if element was found and modified, `false` otherwise.
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
 * Decreases the key value of a heap element by a specified amount.
 * After decrease, element may need to bubble up to maintain heap property.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @param node - The element to modify.
 * @param dencreaseValue - Amount to decrease the key by.
 * @returns `true` if element was found and modified, `false` otherwise.
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
 * Returns an iterator for traversing all elements in the min-heap.
 *
 * *Note*: The traversal follows the order of the underlying array, not the priority order.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
 * @returns An iterator yielding heap elements in the specified order.
 */
export function entries<H extends IHeapArray>(instance: H, reversed = false) {
  return heap.entries(instance, reversed);
}

/**
 * Returns an iterator for traversing just the key values in the min-heap.
 *
 * *Note*: The traversal follows the order of the underlying array, not the priority order.
 *
 * @typeParam H - The type of min-heap array.
 * @param instance - The min-heap instance.
 * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
 * @returns An iterator yielding heap elements in the specified order.
 */
export function keys<H extends IHeapArray>(instance: H, reversed = false) {
  return heap.keys(instance, reversed);
}
