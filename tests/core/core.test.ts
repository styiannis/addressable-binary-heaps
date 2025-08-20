import { maxHeap, minHeap } from '../../src';
import { isValidObjectInstance } from '../tests.util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeap,
  popAndValidate,
  removeAndValidate,
} from './tests.core.util';

describe('Core', () => {
  it.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        addValues: [10, 15, 30, 40, 50, 100, 40],
        removeValues: [100, 50, 40, 40, 30, 15, 10],
        expectedAfterAdditions: [
          [10],
          [15, 10],
          [30, 10, 15],
          [40, 30, 15, 10],
          [50, 40, 15, 10, 30],
          [100, 40, 50, 10, 30, 15],
          [100, 40, 50, 10, 30, 15, 40],
        ],
        expectedAfterRemovals: [
          [50, 40, 40, 10, 30, 15],
          [40, 30, 40, 10, 15],
          [40, 30, 15, 10],
          [30, 10, 15],
          [15, 10],
          [10],
          [],
        ],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        addValues: [10, 15, 30, 40, 50, 100, 40],
        removeValues: [10, 15, 30, 40, 40, 50, 100],
        expectedAfterAdditions: [
          [10],
          [10, 15],
          [10, 15, 30],
          [10, 15, 30, 40],
          [10, 15, 30, 40, 50],
          [10, 15, 30, 40, 50, 100],
          [10, 15, 30, 40, 50, 100, 40],
        ],
        expectedAfterRemovals: [
          [15, 40, 30, 40, 50, 100],
          [30, 40, 100, 40, 50],
          [40, 40, 100, 50],
          [40, 50, 100],
          [50, 100],
          [100],
          [],
        ],
      },
    ],
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

      addValues.forEach((key, i) =>
        addAndValidate(instanceType, instance, key, expectedAfterAdditions[i])
      );

      expect(heap.size(instance)).toBe(addValues.length);

      removeValues.forEach((key, i) =>
        popAndValidate(instanceType, instance, key, expectedAfterRemovals[i])
      );

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        addValues: [40, 100, 50, 40, 30, 15, 10],
        removeValues: [100, 50, 40, 40, 30, 15, 10],
        expectedAfterAdditions: [
          [40],
          [100, 40],
          [100, 40, 50],
          [100, 40, 50, 40],
          [100, 40, 50, 40, 30],
          [100, 40, 50, 40, 30, 15],
          [100, 40, 50, 40, 30, 15, 10],
        ],
        expectedAfterRemovals: [
          [50, 40, 15, 40, 30, 10],
          [40, 40, 15, 10, 30],
          [40, 30, 15, 10],
          [30, 10, 15],
          [15, 10],
          [10],
          [],
        ],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        addValues: [40, 100, 50, 40, 30, 15, 10],
        removeValues: [10, 15, 30, 40, 40, 50, 100],
        expectedAfterAdditions: [
          [40],
          [40, 100],
          [40, 100, 50],
          [40, 40, 50, 100],
          [30, 40, 50, 100, 40],
          [15, 40, 30, 100, 40, 50],
          [10, 40, 15, 100, 40, 50, 30],
        ],
        expectedAfterRemovals: [
          [15, 40, 30, 100, 40, 50],
          [30, 40, 50, 100, 40],
          [40, 40, 50, 100],
          [40, 100, 50],
          [50, 100],
          [100],
          [],
        ],
      },
    ],
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

      addValues.forEach((key, i) =>
        addAndValidate(instanceType, instance, key, expectedAfterAdditions[i])
      );

      expect(heap.size(instance)).toBe(addValues.length);

      removeValues.forEach((key, i) =>
        popAndValidate(instanceType, instance, key, expectedAfterRemovals[i])
      );

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        addValues: [40, 100, 50, 40, 30, 15, 10],
        expectedAfterAdditions: [
          [40],
          [100, 40],
          [100, 40, 50],
          [100, 40, 50, 40],
          [100, 40, 50, 40, 30],
          [100, 40, 50, 40, 30, 15],
          [100, 40, 50, 40, 30, 15, 10],
        ],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        addValues: [40, 100, 50, 40, 30, 15, 10],
        expectedAfterAdditions: [
          [40],
          [40, 100],
          [40, 100, 50],
          [40, 40, 50, 100],
          [30, 40, 50, 100, 40],
          [15, 40, 30, 100, 40, 50],
          [10, 40, 15, 100, 40, 50, 30],
        ],
      },
    ],
  ])(
    '[%s] Create, add and clear',
    (instanceType, heap, { addValues, expectedAfterAdditions }) => {
      const instance = heap.create();

      expect(isValidObjectInstance(instanceType, instance)).toBe(true);
      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);

      addValues.forEach((num, i) =>
        addAndValidate(instanceType, instance, num, expectedAfterAdditions[i])
      );

      expect(heap.size(instance)).toBe(addValues.length);

      heap.clear(instance);

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        values: [4, 7, 6, 1, 9, 3],
        expectedInitial: [9, 7, 6, 1, 4, 3],
        removeNodesIndices: [1, 2, 0, 4, 3, 5],
        expectedAfterRemovals: [
          [9, 4, 6, 1, 3],
          [9, 4, 3, 1],
          [9, 1, 3],
          [3, 1],
          [3],
          [],
        ],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        values: [4, 7, 6, 1, 9, 3],
        expectedInitial: [1, 4, 3, 7, 9, 6],
        removeNodesIndices: [0, 5, 2, 3, 4, 1],
        expectedAfterRemovals: [
          [1, 6, 3, 7, 9],
          [1, 6, 9, 7],
          [1, 7, 9],
          [7, 9],
          [7],
          [],
        ],
      },
    ],
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

      removeNodesIndices.forEach((nodeIndex, i) =>
        removeAndValidate(
          instanceType,
          instance,
          nodes[nodeIndex],
          expectedAfterRemovals[i]
        )
      );

      expect(isValidEmptyHeap(instanceType, instance)).toBe(true);
    }
  );

  it.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        values: [4, 7, 6, 1, 9],
        expectedValuesOrder: [9, 7, 6, 1, 4],
        nodeIndexIncreaseValuePairs: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedAfterIncreases: [
          [9, 7, 6, 1, 4],
          [9, 8, 6, 1, 7],
          [10, 9, 6, 1, 8],
          [10, 9, 6, 3, 8],
          [10, 10, 6, 9, 8],
          [16, 10, 10, 9, 8],
        ],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        values: [4, 7, 6, 1, 9],
        expectedValuesOrder: [1, 4, 6, 7, 9],
        nodeIndexIncreaseValuePairs: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedAfterIncreases: [
          [1, 4, 6, 7, 9],
          [1, 7, 6, 8, 9],
          [1, 8, 6, 10, 9],
          [3, 8, 6, 10, 9],
          [6, 8, 10, 10, 9],
          [8, 9, 10, 10, 16],
        ],
      },
    ],
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

      nodeIndexIncreaseValuePairs.forEach(([nodeIndex, increaseValue], i) =>
        increaseAndValidate(
          instanceType,
          instance,
          nodes[nodeIndex],
          increaseValue,
          expectedAfterIncreases[i]
        )
      );

      expect(maxHeap.increase(instance, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      maxHeap.clear(instance);
    }
  );

  it.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        values: [4, 7, 6, 1, 9],
        expectedValuesOrder: [9, 7, 6, 1, 4],
        nodeIndexDecreaseValuePairs: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedAfterDecreases: [
          [9, 7, 6, 1, 4],
          [9, 7, 6, 1, 0],
          [9, 4, 6, 1, 0],
          [9, 4, 6, -1, 0],
          [9, 4, 6, -8, 0],
          [9, 4, -4, -8, 0],
        ],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        values: [4, 7, 6, 1, 9],
        expectedValuesOrder: [1, 4, 6, 7, 9],
        nodeIndexDecreaseValuePairs: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedAfterDecreases: [
          [1, 4, 6, 7, 9],
          [0, 1, 6, 7, 9],
          [0, 1, 6, 4, 9],
          [-1, 0, 6, 4, 9],
          [-8, 0, 6, 4, 9],
          [-8, 0, -4, 4, 9],
        ],
      },
    ],
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

      nodeIndexDecreaseValuePairs.forEach(([nodeIndex, decreaseValue], i) =>
        decreaseAndValidate(
          instanceType,
          instance,
          nodes[nodeIndex],
          decreaseValue,
          expectedAfterDecreases[i]
        )
      );

      expect(maxHeap.decrease(instance, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      heap.clear(instance);
    }
  );

  describe.each([
    [
      'max-heap' as const,
      maxHeap,
      {
        values: [8, 6, 5, 2, 9, 4, 1, 7, 3],
        expectedInOrder: [9, 8, 5, 7, 6, 4, 1, 2, 3],
      },
    ],
    [
      'min-heap' as const,
      minHeap,
      {
        values: [8, 6, 5, 2, 9, 4, 1, 7, 3],
        expectedInOrder: [1, 3, 2, 5, 9, 6, 4, 8, 7],
      },
    ],
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
