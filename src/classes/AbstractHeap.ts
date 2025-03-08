import { IHeapNode } from '../types';

/**
 * An abstract class representing a heap.
 *
 * @template N - The type of nodes in the heap.
 */
export abstract class AbstractHeap<N extends IHeapNode = IHeapNode> {
  /**
   * Returns an iterator for traversing the heap.
   *
   * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
   * @returns A generator that yields `N` type elements.
   */
  abstract [Symbol.iterator](reversed: boolean): Generator<N, void, void>;

  /**
   * Getter method that returns heap size.
   */
  abstract get size(): number;

  /**
   * Adds a node to the heap.
   *
   * @param node - The node to add.
   */
  abstract add(node: N): void;

  /**
   * Clears the heap by removing all elements.
   */
  abstract clear(): void;

  /**
   * Decreases the key value of a heap element.
   *
   * @param node - The element whose key value will be decreased.
   * @param decreaseValue - The value of decrease.
   * @returns `true` or `false` depending on the outcome of the decrease process.
   */
  abstract decrease(node: N, decreaseValue: N['key']): boolean;

  /**
   * Returns an iterator for traversing the heap elements.
   *
   * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
   */
  abstract entries(reversed: boolean): Generator<N, void, void>;

  /**
   * Executes a provided function (`callback`) once per element in the heap.
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
   * Increases the key value of a heap element.
   *
   * @param node - The element whose key value will be increased.
   * @param increaseValue - The value of increase.
   * @returns `true` or `false` depending on the outcome of the increase process.
   */
  abstract increase(node: N, increaseValue: N['key']): boolean;

  /**
   * Returns an iterator for traversing the heap element keys.
   *
   * @param reversed - If `true`, the iterator will traverse the heap in reverse order.
   */
  abstract keys(reversed: boolean): Generator<N['key'], void, void>;

  /**
   * Returns the top element of the heap, or `undefined` if the heap is empty.
   */
  abstract peek(): N | undefined;

  /**
   * Removes and returns the top element of the heap, or returns `undefined` if the heap is empty.
   */
  abstract pop(): N | undefined;

  /**
   * Removes a node from the heap.
   *
   * @param node - The node to remove.
   * @returns `true` or `false` depending on the outcome of the removal process.
   */
  abstract remove(node: N): boolean;
}
