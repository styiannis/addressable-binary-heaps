/**
 * An interface representing a heap node.
 */
export interface IHeapNode {
  key: number;
}

/**
 * A type alias representing an array-based heap.
 *
 * @typeParam N - The type of heap node.
 */
export type IHeapArray<N extends IHeapNode = IHeapNode> = Array<N> & {
  indices: WeakMap<N, number>;
};
