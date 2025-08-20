import { MaxHeap, MinHeap } from '../../src';
import { isValidClassInstance } from '../tests.util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeapInstance,
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
        expectedOnAdd: [
          [10],
          [15, 10],
          [30, 10, 15],
          [40, 30, 15, 10],
          [50, 40, 15, 10, 30],
          [100, 40, 50, 10, 30, 15],
          [100, 40, 50, 10, 30, 15, 40],
        ],
        removeValues: [100, 50, 40, 40, 30, 15, 10],
        expectedOnRemove: [
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
        expectedOnAdd: [
          [10],
          [10, 15],
          [10, 15, 30],
          [10, 15, 30, 40],
          [10, 15, 30, 40, 50],
          [10, 15, 30, 40, 50, 100],
          [10, 15, 30, 40, 50, 100, 40],
        ],
        removeValues: [10, 15, 30, 40, 40, 50, 100],
        expectedOnRemove: [
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
      { addValues, expectedOnAdd, removeValues, expectedOnRemove }
    ) => {
      const heap = new Heap();

      expect(isValidClassInstance(heap, instanceType)).toBe(true);
      expect(isValidEmptyHeapInstance(heap)).toBe(true);

      addValues.forEach((num, i) =>
        addAndValidate(heap, num, expectedOnAdd[i])
      );

      expect(heap.size).toBe(addValues.length);
      expect(isValidEmptyHeapInstance(heap)).toBe(false);

      removeValues.forEach((num, i) =>
        popAndValidate(heap, num, expectedOnRemove[i])
      );

      expect(isValidEmptyHeapInstance(heap)).toBe(true);
    }
  );

  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        addValues: [40, 100, 50, 40, 30, 15, 10],
        expectedOnAdd: [
          [40],
          [100, 40],
          [100, 40, 50],
          [100, 40, 50, 40],
          [100, 40, 50, 40, 30],
          [100, 40, 50, 40, 30, 15],
          [100, 40, 50, 40, 30, 15, 10],
        ],
        removeValues: [100, 50, 40, 40, 30, 15, 10],
        expectedOnRemove: [
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
        expectedOnAdd: [
          [40],
          [40, 100],
          [40, 100, 50],
          [40, 40, 50, 100],
          [30, 40, 50, 100, 40],
          [15, 40, 30, 100, 40, 50],
          [10, 40, 15, 100, 40, 50, 30],
        ],
        removeValues: [10, 15, 30, 40, 40, 50, 100],
        expectedOnRemove: [
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
      { addValues, expectedOnAdd, removeValues, expectedOnRemove }
    ) => {
      const heap = new Heap();

      expect(isValidClassInstance(heap, instanceType)).toBe(true);
      expect(isValidEmptyHeapInstance(heap)).toBe(true);

      addValues.forEach((num, i) =>
        addAndValidate(heap, num, expectedOnAdd[i])
      );

      expect(heap.size).toBe(addValues.length);
      expect(isValidEmptyHeapInstance(heap)).toBe(false);

      removeValues.forEach((num, i) =>
        popAndValidate(heap, num, expectedOnRemove[i])
      );

      expect(isValidEmptyHeapInstance(heap)).toBe(true);
    }
  );

  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        addValues: [40, 100, 50, 40, 30, 15, 10],
        expectedOnAdd: [
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
        expectedOnAdd: [
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
    (instanceType, Heap, { addValues, expectedOnAdd }) => {
      const heap = new Heap();

      expect(isValidClassInstance(heap, instanceType)).toBe(true);
      expect(isValidEmptyHeapInstance(heap)).toBe(true);

      addValues.forEach((num, i) =>
        addAndValidate(heap, num, expectedOnAdd[i])
      );

      expect(heap.size).toBe(addValues.length);
      expect(isValidEmptyHeapInstance(heap)).toBe(false);

      heap.clear();

      expect(isValidEmptyHeapInstance(heap)).toBe(true);
    }
  );

  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        values: [4, 7, 6, 1, 9, 3],
        expectedOnInit: [9, 7, 6, 1, 4, 3],
        removeNodesIndices: [1, 2, 0, 4, 3, 5],
        expectedOnRemove: [
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
        expectedOnInit: [1, 4, 3, 7, 9, 6],
        removeNodesIndices: [0, 5, 2, 3, 4, 1],
        expectedOnRemove: [
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
      _,
      Heap,
      { values, expectedOnInit, removeNodesIndices, expectedOnRemove }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const heap = new Heap();

      expect(heap.size).toBe(0);
      expect(heap.remove({ key: 999 })).toBe(false); // Try to remove a node from an empty heap.
      expect(heap.size).toBe(0);

      nodes.forEach((node) => heap.add(node)); // Add heap nodes.

      let i = 0;
      heap.forEach((node) => {
        expect(node.key).toStrictEqual(expectedOnInit[i]);
        i += 1;
      });

      expect(heap.size).toBe(values.length);
      expect(heap.remove({ key: 999 })).toBe(false); // Try to remove an invalid node.
      expect(heap.size).toBe(values.length);

      removeNodesIndices.forEach((nodeIndex, i) =>
        removeAndValidate(heap, nodes[nodeIndex], expectedOnRemove[i])
      );

      expect(isValidEmptyHeapInstance(heap)).toBe(true);
    }
  );

  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        values: [4, 7, 6, 1, 9],
        expectedOnInit: [9, 7, 6, 1, 4],
        increaseNodesValues: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedOnIncrease: [
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
        expectedOnInit: [1, 4, 6, 7, 9],
        increaseNodesValues: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedOnIncrease: [
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
      _,
      Heap,
      { values, expectedOnInit, increaseNodesValues, expectedOnIncrease }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const heap = new Heap(nodes);

      let i = 0;
      heap.forEach((node) => {
        expect(node.key).toStrictEqual(expectedOnInit[i]);
        i += 1;
      });

      increaseNodesValues.forEach(([nodeIndex, increaseValue], i) =>
        increaseAndValidate(
          heap,
          nodes[nodeIndex],
          increaseValue,
          expectedOnIncrease[i]
        )
      );

      expect(heap.increase({ key: 999 }, 111)).toBe(false); // Try to increase the value of an invalid node.

      heap.clear();
    }
  );

  it.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        values: [4, 7, 6, 1, 9],
        expectedOnInit: [9, 7, 6, 1, 4],
        decreaseNodesValues: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedOnDecrease: [
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
        expectedOnInit: [1, 4, 6, 7, 9],
        decreaseNodesValues: [
          [2, 0],
          [0, 4],
          [1, 3],
          [3, 2],
          [3, 7],
          [2, 10],
        ],
        expectedOnDecrease: [
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
      _,
      Heap,
      { values, expectedOnInit, decreaseNodesValues, expectedOnDecrease }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const heap = new Heap(nodes);

      let i = 0;
      heap.forEach((node) => {
        expect(node.key).toStrictEqual(expectedOnInit[i]);
        i += 1;
      });

      decreaseNodesValues.forEach(([nodeIndex, increaseValue], i) =>
        decreaseAndValidate(
          heap,
          nodes[nodeIndex],
          increaseValue,
          expectedOnDecrease[i]
        )
      );

      expect(heap.decrease({ key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

      heap.clear();
    }
  );

  describe.each([
    [
      'MaxHeap' as const,
      MaxHeap,
      {
        initialValues: [8, 6, 5, 2, 9, 4, 1, 7, 3],
        expectedValues: [9, 8, 5, 7, 6, 4, 1, 2, 3],
      },
    ],
    [
      'MinHeap' as const,
      MinHeap,
      {
        initialValues: [8, 6, 5, 2, 9, 4, 1, 7, 3],
        expectedValues: [1, 3, 2, 5, 9, 6, 4, 8, 7],
      },
    ],
  ])('[%s] Iterators', (_, Heap, { initialValues, expectedValues }) => {
    const expectedValuesReversed = [...expectedValues].reverse();

    it('Entries', () => {
      const heap = new Heap(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (const entry of heap.entries()) {
        values.push(entry.key);
      }

      const valuesReversed: number[] = [];
      for (const entry of heap.entries(true)) {
        valuesReversed.push(entry.key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      heap.clear();
    });

    it('Keys', () => {
      const heap = new Heap(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (const key of heap.keys()) {
        values.push(key);
      }

      const valuesReversed: number[] = [];
      for (const key of heap.keys(true)) {
        valuesReversed.push(key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      heap.clear();
    });

    it('For-each', () => {
      const heap = new Heap(initialValues.map((key) => ({ key })));

      heap.forEach(({ key }, index, heapInstance) => {
        expect(key).toBe(expectedValues[index]);
        expect(heapInstance).toStrictEqual(heap);
      });

      heap.clear();
    });

    it('For-of', () => {
      const heap = new Heap(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (let { key } of heap) {
        values.push(key);
      }

      expect(values).toStrictEqual(expectedValues);

      heap.clear();
    });
  });
});
