import { MaxHeap, MinHeap } from '../../src';
import { isValidClassInstance } from '../tests.util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeap,
  popAndValidate,
  removeAndValidate,
} from './tests.classes.util';

describe('Classes', () => {
  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
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
      'MinHeap' as const,
      MinHeap,
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
    [
      'MaxHeap' as const,
      MaxHeap,
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
      'MinHeap' as const,
      MinHeap,
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
    [
      'MaxHeap' as const,
      MaxHeap,
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
      'MinHeap' as const,
      MinHeap,
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
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        values: [4, 7, 6, 1, 9, 3],
        expectedValuesOrder: [9, 7, 6, 1, 4, 3],
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
      'MinHeap' as const,
      MinHeap,
      {
        values: [4, 7, 6, 1, 9, 3],
        expectedValuesOrder: [1, 4, 3, 7, 9, 6],
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
      _instanceType,
      Heap,
      { values, expectedValuesOrder, removeNodesIndices, expectedAfterRemovals }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = new Heap();

      expect(instance.remove({ key: 999 })).toBe(false); // Try to remove a node from an empty heap.

      nodes.forEach((node) => instance.add(node));

      instance.forEach((node, i) => {
        expect(node.key).toStrictEqual(expectedValuesOrder[i]);
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
    [
      'MaxHeap' as const,
      MaxHeap,
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
      'MinHeap' as const,
      MinHeap,
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
    [
      'MaxHeap' as const,
      MaxHeap,
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
      'MinHeap' as const,
      MinHeap,
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
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        values: [8, 6, 5, 2, 9, 4, 1, 7, 3],
        expectedInOrder: [9, 8, 5, 7, 6, 4, 1, 2, 3],
      },
    ],
    [
      'MinHeap' as const,
      MinHeap,
      {
        values: [8, 6, 5, 2, 9, 4, 1, 7, 3],
        expectedInOrder: [1, 3, 2, 5, 9, 6, 4, 8, 7],
      },
    ],
  ])('[%s] Iterators', (_instanceType, Heap, { values, expectedInOrder }) => {
    const expectedInReverseOrder = [...expectedInOrder].reverse();

    let instance;

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
