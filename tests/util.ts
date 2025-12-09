import { AbstractHeap, MaxHeap, MinHeap } from '../src';

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
