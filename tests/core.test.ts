import { maxHeap, minHeap } from '../src';
import { TESTS_DATA } from './constants';
import { isValidObjectInstance } from './util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeap,
  popAndValidate,
  removeAndValidate,
} from './util-core';

describe('Core', () => {
  it.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.createAddPeekPop_1.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.createAddPeekPop_1.minHeap],
  ])(
    '[%s] Create, add, peek, and pop (1)',
    (
      instanceType,
      heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = heap.create();

      expect(isValidObjectInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);

      addValues.forEach((key, i) => {
        const expectedKeys = expectedAfterAdditions[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          addAndValidate(instanceType, instance, key, expectedKeys);
        }
      });

      expect(heap.size(instance)).toBe(addValues.length);

      removeValues.forEach((key, i) => {
        const expectedKeys = expectedAfterRemovals[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          popAndValidate(instanceType, instance, key, expectedKeys);
        }
      });

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.createAddPeekPop_2.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.createAddPeekPop_2.minHeap],
  ])(
    '[%s] Create, add, peek, and pop (2)',
    (
      instanceType,
      heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = heap.create();

      expect(isValidObjectInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);

      addValues.forEach((key, i) => {
        const expectedKeys = expectedAfterAdditions[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          addAndValidate(instanceType, instance, key, expectedKeys);
        }
      });

      expect(heap.size(instance)).toBe(addValues.length);

      removeValues.forEach((key, i) => {
        const expectedKeys = expectedAfterRemovals[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          popAndValidate(instanceType, instance, key, expectedKeys);
        }
      });

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.createAddClear.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.createAddClear.minHeap],
  ])(
    '[%s] Create, add and clear',
    (instanceType, heap, { addValues, expectedAfterAdditions }) => {
      const instance = heap.create();

      expect(isValidObjectInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);

      addValues.forEach((key, i) => {
        const expectedKeys = expectedAfterAdditions[i];
        expect(Array.isArray(expectedKeys)).toBe(true);
        if (expectedKeys) {
          addAndValidate(instanceType, instance, key, expectedKeys);
        }
      });

      expect(heap.size(instance)).toBe(addValues.length);

      heap.clear(instance);

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.remove.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.remove.minHeap],
  ])(
    '[%s] Remove',
    (
      instanceType,
      heap,
      { values, expectedInitial, removeNodesIndices, expectedAfterRemovals }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = heap.create();

      expect(heap.remove(instance, { key: 999 })).toBe(false); // Try to remove a node from an empty heap.

      nodes.forEach((node) => heap.add(instance, node));

      instance.forEach((node, i) => {
        expect(node.key).toStrictEqual(expectedInitial[i]);
      });

      expect(heap.remove(instance, { key: 999 })).toBe(false); // Try to remove an invalid node.
      expect(instance.length).toBe(values.length);

      removeNodesIndices.forEach((nodeIndex, i) => {
        const removeNode = nodes[nodeIndex];
        const expectedKeys = expectedAfterRemovals[i];

        expect(removeNode).not.toBe(undefined);
        expect(Array.isArray(expectedKeys)).toBe(true);

        if (removeNode && expectedKeys) {
          removeAndValidate(instanceType, instance, removeNode, expectedKeys);
        }
      });

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.increase.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.increase.minHeap],
  ])(
    '[%s] Increase',
    (
      instanceType,
      heap,
      {
        values,
        expectedValuesOrder,
        nodeIndexIncreaseValuePairs,
        expectedAfterIncreases,
      }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = heap.create(nodes);

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
            instanceType,
            instance,
            increaseNode,
            increaseValue,
            expectedKeys
          );
        }
      });

      expect(maxHeap.increase(instance, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      maxHeap.clear(instance);
    }
  );

  it.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.decrease.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.decrease.minHeap],
  ])(
    '[%s] Decrease',
    (
      instanceType,
      heap,
      {
        values,
        expectedValuesOrder,
        nodeIndexDecreaseValuePairs,
        expectedAfterDecreases,
      }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = heap.create(nodes);

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
            instanceType,
            instance,
            decreaseNode,
            decreaseValue,
            expectedKeys
          );
        }
      });

      expect(maxHeap.decrease(instance, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      heap.clear(instance);
    }
  );

  describe.each([
    ['max-heap' as const, maxHeap, TESTS_DATA.iterators.maxHeap],
    ['min-heap' as const, minHeap, TESTS_DATA.iterators.minHeap],
  ])('[%s] Iterators', (_instanceType, heap, { values, expectedInOrder }) => {
    const expectedInReverseOrder = [...expectedInOrder].reverse();

    let instance: ReturnType<typeof heap.create>;

    beforeEach(() => {
      instance = heap.create(values.map((key) => ({ key })));
    });

    afterEach(() => {
      heap.clear(instance);
    });

    it('Entries', () => {
      const arr: number[] = [];

      for (const entry of heap.entries(instance)) {
        arr.push(entry.key);
      }

      expect(arr).toStrictEqual(expectedInOrder);

      arr.length = 0;

      for (const entry of heap.entries(instance, true)) {
        arr.push(entry.key);
      }

      expect(arr).toStrictEqual(expectedInReverseOrder);
    });

    it('Keys', () => {
      const arr: number[] = [];

      for (const key of heap.keys(instance)) {
        arr.push(key);
      }

      expect(arr).toStrictEqual(expectedInOrder);

      arr.length = 0;

      for (const key of heap.keys(instance, true)) {
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
  });
});
