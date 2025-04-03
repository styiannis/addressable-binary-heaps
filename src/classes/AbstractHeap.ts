import { IHeapNode } from '../types';

/**
 * An abstract base class for implementing heap data structures.
 *
 * Provides a common interface for both min-heap and max-heap implementations.
 *
 * @template N - The type of nodes in the heap, must extend `IHeapNode`.
 */
export abstract class AbstractHeap<N extends IHeapNode = IHeapNode> {
  /**
   * Returns the current number of elements in the heap.
   *
   * @returns The number of elements in the heap.
   */
  abstract get size(): number;

  /**
   * Makes the `AbstractHeap` iterable.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   *
   * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
   * @returns An iterator yielding heap elements in the specified order.
   */
  abstract [Symbol.iterator](reversed: boolean): Generator<N, void, void>;

  /**
   * Adds a new node to the heap while maintaining the heap property.
   *
   * @param node - The node to add to the heap.
   */
  abstract add(node: N): void;

  /**
   * Removes all elements from the heap.
   */
  abstract clear(): void;

  /**
   * Decreases the key value of a heap element by a specified amount.
   *
   * @param node - The element to modify.
   * @param decreaseValue - Amount to decrease the key by.
   * @returns `true` if element was found and modified, `false` otherwise.
   */
  abstract decrease(node: N, decreaseValue: N['key']): boolean;

  /**
   * Returns an iterator for traversing all elements in the heap.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   *
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   * @returns An iterator yielding heap elements in the specified order.
   */
  abstract entries(reversed: boolean): Generator<N, void, void>;

  /**
   * Executes a callback function for each element in the heap.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   */
  abstract forEach(
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
  ): void;

  /**
   * Increases the key value of a heap element by a specified amount.
   *
   * @param node - The element to modify.
   * @param increaseValue - Amount to increase the key by.
   * @returns `true` if element was found and modified, `false` otherwise.
   */
  abstract increase(node: N, increaseValue: N['key']): boolean;

  /**
   * Returns an iterator for traversing just the key values in the heap.
   *
   * *Note*: The traversal follows the order of the underlying array, not the priority order.
   *
   * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
   */
  abstract keys(reversed: boolean): Generator<N['key'], void, void>;

  /**
   * Returns the top element of the heap without removing it.
   * - For min-heaps, returns the minimum element.
   * - For max-heaps, returns the maximum element.
   * 
   @returns The top element or `undefined` if heap is empty.
   */
  abstract peek(): N | undefined;

  /**
   * Removes and returns the top element of the heap.
   * - For min-heaps, removes the minimum element.
   * - For max-heaps, removes the maximum element.
   *
   * @returns The removed top element or `undefined` if heap is empty.
   */
  abstract pop(): N | undefined;

  /**
   * Removes a specific element from anywhere in the heap.
   *
   * @param node - The element to remove.
   * @returns `true` if element was found and removed, `false` if not found.
   */
  abstract remove(node: N): boolean;
}
