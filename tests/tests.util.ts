import { IHeapArray } from '../src';

/* ----------------------------------------- */
/* ---------- // Helper functions ---------- */
/* ----------------------------------------- */

function areIdenticalArrays(a: any[], b: any[]) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

/* ----------------------------------------- */
/* ---------- Helper functions // ---------- */
/* ----------------------------------------- */

export function heapKeys(heap: IHeapArray) {
  const keys: number[] = [];
  for (let node of heap) {
    keys.push(node.key);
  }
  return keys;
}

export function isValidObjectInstance(
  instance: unknown,
  instanceType: 'max-heap' | 'min-heap' | 'heap-node'
) {
  if ('object' !== typeof instance) {
    return false;
  }

  // Own property names (sorted).
  const props = Object.getOwnPropertyNames(instance).sort();

  if ('heap-node' === instanceType) {
    return (
      Object.getPrototypeOf(instance) === Object.prototype &&
      areIdenticalArrays(props, ['key'])
    );
  }

  if ('max-heap' === instanceType || 'min-heap' === instanceType) {
    return (
      Array.isArray(instance) &&
      areIdenticalArrays(props, ['indices', 'length'])
    );
  }

  return false;
}
