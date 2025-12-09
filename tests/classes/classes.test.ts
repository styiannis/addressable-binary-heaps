import { MaxHeap, MinHeap } from '../../src';
import { TESTS_DATA } from '../constants';
import { isValidClassInstance } from '../util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeap,
  popAndValidate,
  removeAndValidate,
} from './classes-util';

describe('Classes', () => {
  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.createAddPeekPop_1.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.createAddPeekPop_1.minHeap],
  ])(
    '[%s] Create, add, peek, and pop (1)',
    (
      instanceType,
      Heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = new Heap();

      expect(isValidClassInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instance)).toBe(true);

      addValues.forEach((key, i) =>
        addAndValidate(instance, key, expectedAfterAdditions[i])
      );

      expect(instance.size).toBe(addValues.length);

      removeValues.forEach((key, i) =>
        popAndValidate(instance, key, expectedAfterRemovals[i])
      );

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.createAddPeekPop_2.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.createAddPeekPop_2.minHeap],
  ])(
    '[%s] Create, add, peek, and pop (2)',
    (
      instanceType,
      Heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = new Heap();

      expect(isValidClassInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instance)).toBe(true);

      addValues.forEach((key, i) =>
        addAndValidate(instance, key, expectedAfterAdditions[i])
      );

      expect(instance.size).toBe(addValues.length);

      removeValues.forEach((key, i) =>
        popAndValidate(instance, key, expectedAfterRemovals[i])
      );

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.createAddClear.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.createAddClear.minHeap],
  ])(
    '[%s] Create, add and clear',
    (instanceType, Heap, { addValues, expectedAfterAdditions }) => {
      const instance = new Heap();

      expect(isValidClassInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instance)).toBe(true);

      addValues.forEach((num, i) =>
        addAndValidate(instance, num, expectedAfterAdditions[i])
      );

      expect(instance.size).toBe(addValues.length);

      instance.clear();

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.remove.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.remove.minHeap],
  ])(
    '[%s] Remove',
    (
      _instanceType,
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

      removeNodesIndices.forEach((nodeIndex, i) =>
        removeAndValidate(instance, nodes[nodeIndex], expectedAfterRemovals[i])
      );

      expect(isValidEmptyHeap(instance)).toBe(true);
    }
  );

  it.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.increase.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.increase.minHeap],
  ])(
    '[%s] Increase',
    (
      _instanceType,
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

      nodeIndexIncreaseValuePairs.forEach(([nodeIndex, increaseValue], i) =>
        increaseAndValidate(
          instance,
          nodes[nodeIndex],
          increaseValue,
          expectedAfterIncreases[i]
        )
      );

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
      _instanceType,
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

      nodeIndexDecreaseValuePairs.forEach(([nodeIndex, decreaseValue], i) =>
        decreaseAndValidate(
          instance,
          nodes[nodeIndex],
          decreaseValue,
          expectedAfterDecreases[i]
        )
      );

      expect(instance.decrease({ key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      instance.clear();
    }
  );

  describe.each([
    ['MaxHeap' as const, MaxHeap, TESTS_DATA.iterators.maxHeap],
    ['MinHeap' as const, MinHeap, TESTS_DATA.iterators.minHeap],
  ])('[%s] Iterators', (_instanceType, Heap, { values, expectedInOrder }) => {
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
  });
});
