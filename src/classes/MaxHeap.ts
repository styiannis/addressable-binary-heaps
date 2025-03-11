import {
  add,
  clear,
  create,
  decrease,
  entries,
  increase,
  keys,
  peek,
  pop,
  remove,
  size,
} from '../core/max-heap';
import { IHeapArray, IHeapNode } from '../types';
import { AbstractHeap } from './AbstractHeap';

/**
 * A concrete implementation of a max-heap data structure.
 *
 * In a max-heap, for any given node, the node's key value is greater than or equal
 * to the key values of its children.
 *
 * @template N - The type of nodes in the heap, must implement `IHeapNode` interface.
 */
export class MaxHeap<N extends IHeapNode = IHeapNode> extends AbstractHeap<N> {
  /** Private field holding the internal heap data structure */
  #heap: IHeapArray<N>;

  /**
   * Creates a new `MaxHeap` instance.
   *
   * @param [initialNodes] - Optional array of elements to initialize the heap with.
   */
  constructor(initialNodes?: N[] | Readonly<N[]>) {
    super();
    this.#heap = create(initialNodes);
  }

  /**
   * Gets the current number of elements in the max-heap.
   *
   * @returns The number of elements in the heap.
   */
  get size() {
    return size(this.#heap);
  }

  /**
   * Makes the `MaxHeap` iterable.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   *
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   * @returns An iterator yielding heap elements in the specified order.
   */
  [Symbol.iterator](reversed = false) {
    return entries(this.#heap, reversed);
  }

  /**
   * Adds a new element to the heap while maintaining the max-heap property.
   *
   * @param node - The element to add to the heap.
   */
  add(node: N) {
    return add(this.#heap, node);
  }

  /**
   * Clears the heap by removing all elements.
   */
  clear() {
    return clear(this.#heap);
  }

  /**
   * Decreases the key value of a heap element by a specified amount.
   *
   * @param node - The element to modify.
   * @param decreaseValue - Amount to decrease the key by.
   * @returns `true` if element was found and modified, `false` otherwise.
   */
  decrease(node: N, decreaseValue: number) {
    return decrease(this.#heap, node, decreaseValue);
  }

  /**
   * Returns an iterator for traversing all elements in the max-heap.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   *
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   * @returns An iterator yielding heap elements in the specified order.
   */
  entries(reversed = false) {
    return entries(this.#heap, reversed);
  }

  /**
   * Executes a callback function for each element in the heap.
   */
  forEach(
    /**
     * @param node - Element of each iteration.
     * @param index - The index of the current element being processed in the heap.
     * @param heapInstance - The heap instance being iterated.
     */
    callback: (node: N, index: number, heapInstance: typeof this) => void,
    /**
     * @param [thisArg] - A value to use as `this` when executing `callback`.
     */
    thisArg?: any
  ) {
    let i = 0;
    for (const node of this.entries()) {
      callback.call(thisArg, node, i++, this);
    }
  }

  /**
   * Increases the key value of a heap element by a specified amount.
   *
   * @param node - The element to modify.
   * @param increaseValue - Amount to increase the key by.
   * @returns `true` if element was found and modified, `false` otherwise.
   */
  increase(node: N, increaseValue: number) {
    return increase(this.#heap, node, increaseValue);
  }

  /**
   * Returns an iterator for traversing just the key values in the max-heap.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   *
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   * @returns An iterator yielding heap element keys in the specified order.
   */
  keys(reversed = false) {
    return keys(this.#heap, reversed);
  }

  /**
   * Returns the maximum element (root) of the max-heap without removing it.
   *
   * @returns The maximum element or `undefined` if the heap is empty.
   */
  peek() {
    return peek(this.#heap);
  }

  /**
   * Removes and returns the maximum element (root) from the max-heap.
   *
   * @returns The maximum element or `undefined` if the heap is empty.
   */
  pop() {
    return pop(this.#heap);
  }

  /**
   * Removes a specific element from anywhere in the max-heap.
   *
   * @param node - The element to remove.
   * @returns `true` if element was found and removed, `false` otherwise.
   */
  remove(node: N) {
    return remove(this.#heap, node);
  }
}
