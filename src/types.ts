/**
 * An interface representing a node in the binary heap data structure.
 * Each node must have a numeric key that determines its position in the heap.
 */
export interface IHeapNode {
  /**
   * The numeric key value used for heap ordering.
   * - Lower values have higher priority in a min-heap,
   * - higher values have higher priority in a max-heap.
   *
   * Expected to be a finite number. Nothing validates this: a key is only
   * ever compared with `<`, `>`, `<=` and `>=`, so one of another type is
   * ordered by whatever those return for it, and a `NaN` by nothing at all.
   */
  key: number;
}

/**
 * A specialized array type that maintains heap properties and node indices.
 * Extends the standard `Array` with a `WeakMap` to track node positions.
 *
 * @typeParam N - The type of heap node.
 */
export type IHeapArray<N extends IHeapNode = IHeapNode> = Array<N> & {
  /**
   * Maps heap nodes to their current indices in the array.
   */
  indices: WeakMap<N, number>;
};
