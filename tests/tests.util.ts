import { AbstractHeap, IHeapArray, MaxHeap, MinHeap } from '../src';

/* ----------------------------------------- */
/* ---------- // Helper functions ---------- */
/* ----------------------------------------- */

function areIdenticalArrays(a: any[], b: any[]) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

/* ----------------------------------------- */
/* ---------- Helper functions // ---------- */
/* ----------------------------------------- */

export function heapKeys(heap: IHeapArray | MaxHeap | MinHeap) {
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

export function isValidClassInstance(
  instance: unknown,
  instanceType: 'MaxHeap' | 'MinHeap'
) {
  if ('object' !== typeof instance) {
    return false;
  }

  // Own property names (sorted)
  const props = Object.getOwnPropertyNames(instance).sort();

  // Prototype property names (sorted)
  const protoProps = Object.getOwnPropertyNames(
    Object.getPrototypeOf(instance)
  ).sort();

  if (
    !areIdenticalArrays(props, []) ||
    !areIdenticalArrays(protoProps, [
      'add',
      'clear',
      'constructor',
      'decrease',
      'entries',
      'forEach',
      'increase',
      'keys',
      'peek',
      'pop',
      'remove',
      'size',
    ]) ||
    !(instance instanceof AbstractHeap) ||
    Object.getPrototypeOf(instance) === AbstractHeap.prototype
  ) {
    return false;
  }

  if ('MaxHeap' === instanceType) {
    return (
      instance instanceof MaxHeap &&
      Object.getPrototypeOf(instance) === MaxHeap.prototype
    );
  }

  if ('MinHeap' === instanceType) {
    return (
      instance instanceof MinHeap &&
      Object.getPrototypeOf(instance) === MinHeap.prototype
    );
  }

  return false;
}
