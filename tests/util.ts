import { AbstractHeap, IHeapNode, MaxHeap, MinHeap } from '../src';
import { getLeftChildIndex, getRightChildIndex } from '../src/core/heap.util';

const arraysEqual = (a: any[], b: any[]) =>
  a.length === b.length && a.every((val, i) => val === b[i]);

export function isValidObjectInstance(
  instanceType: 'max-heap' | 'min-heap' | 'heap-node',
  instance: unknown
) {
  if ('object' !== typeof instance) {
    return false;
  }

  const props = Object.getOwnPropertyNames(instance).sort();

  if ('heap-node' === instanceType) {
    return (
      Object.getPrototypeOf(instance) === Object.prototype &&
      arraysEqual(props, ['key'])
    );
  }

  return Array.isArray(instance) && arraysEqual(props, ['indices', 'length']);
}

export function isValidClassInstance(
  instanceType: 'MaxHeap' | 'MinHeap',
  instance: unknown
) {
  if ('object' !== typeof instance) {
    return false;
  }

  const props = Object.getOwnPropertyNames(instance).sort();
  const proto = Object.getPrototypeOf(instance);
  const protoProps = Object.getOwnPropertyNames(proto).sort();

  if (
    !arraysEqual(props, []) ||
    !arraysEqual(protoProps, [
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
    proto === AbstractHeap.prototype
  ) {
    return false;
  }

  if ('MaxHeap' === instanceType) {
    return instance instanceof MaxHeap && proto === MaxHeap.prototype;
  }

  return instance instanceof MinHeap && proto === MinHeap.prototype;
}

export function isValidHeap<A extends IHeapNode[]>(
  instanceType: 'max-heap' | 'min-heap',
  instance: A
) {
  const stack = [0];

  let isValid = true;

  for (
    let index = stack.shift();
    isValid && index !== undefined;
    index = stack.shift()
  ) {
    const parent = instance[index];

    if (parent === undefined) {
      continue;
    }

    isValid = [getLeftChildIndex(index), getRightChildIndex(index)].reduce(
      (acc, curr) => {
        const child = instance[curr];

        if (acc && child) {
          acc =
            'max-heap' === instanceType
              ? parent.key >= child.key
              : parent.key <= child.key;

          if (acc) {
            stack.push(curr);
          }
        }

        return acc;
      },
      isValid
    );
  }

  return isValid;
}
