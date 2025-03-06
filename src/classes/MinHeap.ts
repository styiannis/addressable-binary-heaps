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
} from '../core/min-heap';
import { IHeapArray, IHeapNode } from '../types';
import { AbstractHeap } from './AbstractHeap';

/**
 * A concrete implementation of a min-heap.
 *
 * @template N - The type of nodes in the heap.
 */
export class MinHeap<N extends IHeapNode = IHeapNode> extends AbstractHeap<N> {
  /**
   * Heap object (private field).
   */
  #heap: IHeapArray<N>;

  /**
   * Class instance constructor.
   *
   * @param [initialNodes] - Array of unsorted heap elements.
   */
  constructor(initialNodes?: N[] | Readonly<N[]>) {
    super();
    this.#heap = create(initialNodes);
  }

  /**
   * Returns an iterator for traversing the heap.
   *
   * @override
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   * @returns A generator that yields heap elements in the requested order.
   */
  [Symbol.iterator](reversed = false) {
    return entries(this.#heap, reversed);
  }

  /**
   * Getter method that returns heap size.
   *
   * @override
   */
  get size() {
    return size(this.#heap);
  }

  /**
   * Adds an element to the heap.
   *
   * @override
   * @param node - The element to add.
   */
  add(node: N) {
    return add(this.#heap, node);
  }

  /**
   * Clears the heap by removing all elements.
   *
   * @override
   */
  clear() {
    return clear(this.#heap);
  }

  /**
   * Decreases the key value of a heap element.
   *
   * @override
   * @param node - The element whose key value will be decreased.
   * @param decreaseValue - The value of decrease.
   * @returns `true` or `false` depending on the outcome of the decrease process.
   */
  decrease(node: N, decreaseValue: number) {
    return decrease(this.#heap, node, decreaseValue);
  }

  /**
   * Returns an iterator for traversing the heap elements.
   *
   * @override
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   */
  entries(reversed = false) {
    return entries(this.#heap, reversed);
  }

  /**
   * Executes a provided function once per element in the heap.
   *
   * @override
   */
  forEach(
    /**
     * @param node - Element of each iteration.
     * @param index - The index of the current element being processed in the heap.
     * @param heapInstance - The heap instance being iterated.
     */
    callbackFn: (node: N, index: number, heapInstance: typeof this) => void,
    /**
     * @param [thisArg] - A value to use as `this` when executing `callbackFn`.
     */
    thisArg?: any
  ) {
    for (
      let i = 0, iter = this.entries(), curr = iter.next();
      !curr.done;
      i++, curr = iter.next()
    ) {
      callbackFn.call(thisArg, curr.value, i, this);
    }
  }

  /**
   * Increases the key value of a heap element.
   *
   * @override
   * @param node - The element whose key value will be increased.
   * @param increaseValue - The value of increase.
   * @returns `true` or `false` depending on the outcome of the increase process.
   */
  increase(node: N, increaseValue: number) {
    return increase(this.#heap, node, increaseValue);
  }

  /**
   * Returns an iterator for traversing the heap element keys.
   *
   * @override
   * @param [reversed=false] - If `true`, the iterator will traverse the heap in reverse order.
   */
  keys(reversed = false) {
    return keys(this.#heap, reversed);
  }

  /**
   * Returns the top element of the heap or `undefined` if the heap is empty.
   *
   * @override
   */
  peek() {
    return peek(this.#heap);
  }

  /**
   * Removes and returns the top element of the heap, or returns `undefined` if the heap is empty.
   *
   * @override
   */
  pop() {
    return pop(this.#heap);
  }

  /**
   * Removes an element from the heap.
   *
   * @override
   * @param node - The element to remove.
   * @returns `true` or `false` depending on the outcome of the removal process.
   */
  remove(node: N) {
    return remove(this.#heap, node);
  }
}
