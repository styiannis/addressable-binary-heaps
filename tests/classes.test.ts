import { MaxHeap, MinHeap } from '../src';
import { TESTS_DATA } from './constants';
import { isValidHeap, isValidClassInstance, toCoreInstanceType } from './util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeap,
  popAndValidate,
  removeAndValidate,
} from './util-classes';

describe('Classes', () => {
  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.createAddPeekPop_1.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.createAddPeekPop_1.minHeap],
  ])(
    '[%s] Create, add, peek, and pop (1)',
    (
      classInstanceType,
      Heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = new Heap();

      expect(isValidClassInstance(classInstanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instance)).toBe(true);

      addValues.forEach((key, i) => {
        const expectedKeys = expectedAfterAdditions[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          addAndValidate(instance, key, expectedKeys);
        }
      });

      expect(instance.size).toBe(addValues.length);

      removeValues.forEach((key, i) => {
        const expectedKeys = expectedAfterRemovals[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          popAndValidate(instance, key, expectedKeys);
        }
      });

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.createAddPeekPop_2.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.createAddPeekPop_2.minHeap],
  ])(
    '[%s] Create, add, peek, and pop (2)',
    (
      classInstanceType,
      Heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = new Heap();

      expect(isValidClassInstance(classInstanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instance)).toBe(true);

      addValues.forEach((key, i) => {
        const expectedKeys = expectedAfterAdditions[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          addAndValidate(instance, key, expectedKeys);
        }
      });

      expect(instance.size).toBe(addValues.length);

      removeValues.forEach((key, i) => {
        const expectedKeys = expectedAfterRemovals[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          popAndValidate(instance, key, expectedKeys);
        }
      });

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.createAddClear.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.createAddClear.minHeap],
  ])(
    '[%s] Create, add and clear',
    (classInstanceType, Heap, { addValues, expectedAfterAdditions }) => {
      const instance = new Heap();

      expect(isValidClassInstance(classInstanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instance)).toBe(true);

      addValues.forEach((key, i) => {
        const expectedKeys = expectedAfterAdditions[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          addAndValidate(instance, key, expectedKeys);
        }
      });

      expect(instance.size).toBe(addValues.length);

      instance.clear();

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap],
    ['MinHeap' as const, MinHeap],
  ])(
    '[%s] Insertions with equal keys never swap',
    (classInstanceType, Heap) => {
      const instanceType = toCoreInstanceType(classInstanceType);

      const nodes = Array.from({ length: 6 }, (_, id) => ({ key: 1, id }));
      const instance = new Heap();

      nodes.forEach((node) => instance.add(node));

      const entries = [...instance];

      expect(isValidHeap(instanceType, entries)).toBe(true);
      expect(entries.every((node, i) => node === nodes[i])).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap],
    ['MinHeap' as const, MinHeap],
  ])(
    '[%s] Bulk construction with equal keys never swaps',
    (classInstanceType, Heap) => {
      const instanceType = toCoreInstanceType(classInstanceType);

      const nodes = Array.from({ length: 7 }, (_, id) => ({ key: 1, id }));
      const instance = new Heap(nodes);

      const entries = [...instance];
      expect(isValidHeap(instanceType, entries)).toBe(true);
      expect(entries.every((node, i) => node === nodes[i])).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.infiniteKeys.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.infiniteKeys.minHeap],
  ])(
    '[%s] Infinities are ordered like any other key',
    (classInstanceType, Heap, { values, expectedPopOrderWithInfinities }) => {
      const instanceType = toCoreInstanceType(classInstanceType);

      const instance = new Heap(
        [...values, Infinity, -Infinity].map((key) => ({ key }))
      );

      expect(isValidHeap(instanceType, [...instance])).toBe(true);

      const keys: number[] = [];

      for (let node = instance.pop(); node; node = instance.pop()) {
        keys.push(node.key);
      }

      expect(keys).toStrictEqual(expectedPopOrderWithInfinities);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.remove.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.remove.minHeap],
  ])(
    '[%s] Remove',
    (
      _classInstanceType,
      Heap,
      { values, expectedInitial, removeNodesIndices, expectedAfterRemovals }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = new Heap();

      expect(instance.remove({ key: 999 })).toBe(false); // Try to remove a node from an empty heap.

      nodes.forEach((node) => instance.add(node));

      instance.forEach((node, i) => {
        expect(node.key).toStrictEqual(expectedInitial[i]);
      });

      expect(instance.remove({ key: 999 })).toBe(false); // Try to remove an invalid node.
      expect(instance.size).toBe(values.length);

      removeNodesIndices.forEach((nodeIndex, i) => {
        const removeNode = nodes[nodeIndex];
        const expectedKeys = expectedAfterRemovals[i];

        expect(removeNode).not.toBe(undefined);
        expect(Array.isArray(expectedKeys)).toBe(true);

        if (removeNode && expectedKeys) {
          removeAndValidate(instance, removeNode, expectedKeys);
        }
      });

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.removeRebalanceTowardRoot.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.removeRebalanceTowardRoot.minHeap],
  ])(
    '[%s] Remove rebalances toward the root when required',
    (_classInstanceType, Heap, { values, expectedPopOrderDirection }) => {
      const nodes = values.map((key) => ({ key }));
      const instance = new Heap(nodes);

      const removeNode = nodes[1];

      expect(removeNode).not.toBe(undefined);

      if (removeNode) {
        expect(instance.remove(removeNode)).toBe(true);
      }

      const popped: number[] = [];

      for (let node = instance.pop(); node; node = instance.pop()) {
        popped.push(node.key);
      }

      expect(popped.length).toBe(values.length - 1);

      popped.reduce((prev, curr) => {
        expect(
          expectedPopOrderDirection * (curr - prev)
        ).toBeGreaterThanOrEqual(0);
        return curr;
      });
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap],
    ['MinHeap' as const, MinHeap],
  ])(
    '[%s] Remove clears the index when the target is the last element',
    (_classInstanceType, Heap) => {
      const nodes = [10, 20, 30, 40, 50].map((key) => ({ key }));
      const instance = new Heap(nodes);
      const lastNode = instance.entries(true).next().value;

      expect(lastNode).not.toBe(undefined);

      if (lastNode) {
        expect(instance.remove(lastNode)).toBe(true);

        expect(instance.increase(lastNode, 1)).toBe(false);
        expect(instance.decrease(lastNode, 1)).toBe(false);
      }
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap],
    ['MinHeap' as const, MinHeap],
  ])(
    '[%s] Pop on a single-element heap clears the index of the popped node',
    (_classInstanceType, Heap) => {
      const node = { key: 1 };
      const instance = new Heap([node]);

      expect(instance.pop()).toBe(node);

      expect(instance.increase(node, 1)).toBe(false);
      expect(instance.decrease(node, 1)).toBe(false);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.increase.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.increase.minHeap],
  ])(
    '[%s] Increase',
    (
      _classInstanceType,
      Heap,
      {
        values,
        expectedValuesOrder,
        nodeIndexIncreaseValuePairs,
        expectedAfterIncreases,
      }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = new Heap(nodes);

      instance.forEach((node, i) => {
        expect(node.key).toStrictEqual(expectedValuesOrder[i]);
      });

      nodeIndexIncreaseValuePairs.forEach(([nodeIndex, increaseValue], i) => {
        const increaseNode = nodes[nodeIndex];
        const expectedKeys = expectedAfterIncreases[i];

        expect(increaseNode).not.toBe(undefined);
        expect(Array.isArray(expectedKeys)).toBe(true);

        if (increaseNode && expectedKeys) {
          increaseAndValidate(
            instance,
            increaseNode,
            increaseValue,
            expectedKeys
          );
        }
      });

      expect(instance.increase({ key: 999 }, 111)).toBe(false); // Try to increase the value of an invalid node.

      instance.clear();
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.decrease.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.decrease.minHeap],
  ])(
    '[%s] Decrease',
    (
      _classInstanceType,
      Heap,
      {
        values,
        expectedValuesOrder,
        nodeIndexDecreaseValuePairs,
        expectedAfterDecreases,
      }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = new Heap(nodes);

      instance.forEach((node, i) => {
        expect(node.key).toStrictEqual(expectedValuesOrder[i]);
      });

      nodeIndexDecreaseValuePairs.forEach(([nodeIndex, decreaseValue], i) => {
        const decreaseNode = nodes[nodeIndex];
        const expectedKeys = expectedAfterDecreases[i];

        expect(decreaseNode).not.toBe(undefined);
        expect(Array.isArray(expectedKeys)).toBe(true);

        if (decreaseNode && expectedKeys) {
          decreaseAndValidate(
            instance,
            decreaseNode,
            decreaseValue,
            expectedKeys
          );
        }
      });

      expect(instance.decrease({ key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      instance.clear();
    }
  );

  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      TESTS_DATA.increaseDecreaseNegativeAmount.maxHeap,
    ],
    [
      'MinHeap' as const,
      MinHeap,
      TESTS_DATA.increaseDecreaseNegativeAmount.minHeap,
    ],
  ])(
    '[%s] Increase and decrease restore the heap property with a negative amount',
    (
      classInstanceType,
      Heap,
      { values, increaseNodeIndex, decreaseNodeIndex, negativeAmount }
    ) => {
      const instanceType = toCoreInstanceType(classInstanceType);

      const nodes = values.map((key) => ({ key }));
      const instance = new Heap(nodes);

      const extreme = () =>
        'max-heap' === instanceType
          ? nodes.reduce((a, b) => (a.key >= b.key ? a : b))
          : nodes.reduce((a, b) => (a.key <= b.key ? a : b));

      expect(nodes[increaseNodeIndex]).not.toBe(undefined);

      if (nodes[increaseNodeIndex]) {
        expect(
          instance.increase(nodes[increaseNodeIndex], negativeAmount)
        ).toBe(true);
        expect(isValidHeap(instanceType, [...instance])).toBe(true);
        expect(instance.peek()).toBe(extreme());
      }

      expect(nodes[decreaseNodeIndex]).not.toBe(undefined);

      if (nodes[decreaseNodeIndex]) {
        expect(
          instance.decrease(nodes[decreaseNodeIndex], negativeAmount)
        ).toBe(true);
        expect(isValidHeap(instanceType, [...instance])).toBe(true);
        expect(instance.peek()).toBe(extreme());
      }
    }
  );

  describe.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.iterators.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.iterators.minHeap],
  ])(
    '[%s] Iterators',
    (_classInstanceType, Heap, { values, expectedInOrder }) => {
      const expectedInReverseOrder = [...expectedInOrder].reverse();

      let instance: MaxHeap | MinHeap;

      beforeEach(() => {
        instance = new Heap(values.map((key) => ({ key })));
      });

      afterEach(() => {
        instance.clear();
      });

      it('Entries', () => {
        const arr: number[] = [];

        for (const entry of instance.entries()) {
          arr.push(entry.key);
        }

        expect(arr).toStrictEqual(expectedInOrder);

        arr.length = 0;

        for (const entry of instance.entries(true)) {
          arr.push(entry.key);
        }

        expect(arr).toStrictEqual(expectedInReverseOrder);
      });

      it('Keys', () => {
        const arr: number[] = [];

        for (const key of instance.keys()) {
          arr.push(key);
        }

        expect(arr).toStrictEqual(expectedInOrder);

        arr.length = 0;

        for (const key of instance.keys(true)) {
          arr.push(key);
        }

        expect(arr).toStrictEqual(expectedInReverseOrder);
      });

      it('For-each', () => {
        instance.forEach(({ key }, index, heapInstance) => {
          expect(key).toBe(expectedInOrder[index]);
          expect(heapInstance).toStrictEqual(instance);
        });
      });

      it('For-of', () => {
        const arr: number[] = [];

        for (let { key } of instance) {
          arr.push(key);
        }

        expect(arr).toStrictEqual(expectedInOrder);
      });
    }
  );
});
