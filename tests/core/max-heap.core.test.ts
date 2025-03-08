import { maxHeap } from '../../src';
import { isValidObjectInstance } from '../tests.util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyMaxHeapObj,
  popAndValidate,
  removeAndValidate,
} from './tests.core.util';

describe('core >> max-heap', () => {
  const instanceType = 'max-heap';

  it('Create, add, peek, and pop [1]', () => {
    const heap = maxHeap.create();

    expect(isValidObjectInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);

    const addValues = [10, 15, 30, 40, 50, 100, 40];
    const removeValues = [100, 50, 40, 40, 30, 15, 10];

    const expectedOnAdd = [
      [10],
      [15, 10],
      [30, 10, 15],
      [40, 30, 15, 10],
      [50, 40, 15, 10, 30],
      [100, 40, 50, 10, 30, 15],
      [100, 40, 50, 10, 30, 15, 40],
    ];

    const expectedOnRemove = [
      [50, 40, 40, 10, 30, 15],
      [40, 30, 40, 10, 15],
      [40, 30, 15, 10],
      [30, 10, 15],
      [15, 10],
      [10],
      [],
    ];

    addValues.forEach((num, i) =>
      addAndValidate(instanceType, heap, num, expectedOnAdd[i])
    );

    removeValues.forEach((num, i) =>
      popAndValidate(instanceType, heap, num, expectedOnRemove[i])
    );

    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);
  });

  it('Create, add, peek, and pop [2]', () => {
    const heap = maxHeap.create();

    expect(isValidObjectInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);

    const addValues = [40, 100, 50, 40, 30, 15, 10];
    const removeValues = [100, 50, 40, 40, 30, 15, 10];

    const expectedOnAdd = [
      [40],
      [100, 40],
      [100, 40, 50],
      [100, 40, 50, 40],
      [100, 40, 50, 40, 30],
      [100, 40, 50, 40, 30, 15],
      [100, 40, 50, 40, 30, 15, 10],
    ];

    const expectedOnRemove = [
      [50, 40, 15, 40, 30, 10],
      [40, 40, 15, 10, 30],
      [40, 30, 15, 10],
      [30, 10, 15],
      [15, 10],
      [10],
      [],
    ];

    addValues.forEach((num, i) =>
      addAndValidate(instanceType, heap, num, expectedOnAdd[i])
    );

    removeValues.forEach((num, i) =>
      popAndValidate(instanceType, heap, num, expectedOnRemove[i])
    );

    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);
  });

  it('Create, add and clear', () => {
    const heap = maxHeap.create();

    expect(isValidObjectInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);

    const addValues = [3, 1, 4, 2, 5];

    const expectedOnAdd = [
      [3],
      [3, 1],
      [4, 1, 3],
      [4, 2, 3, 1],
      [5, 4, 3, 1, 2],
    ];

    addValues.forEach((num, i) =>
      addAndValidate(instanceType, heap, num, expectedOnAdd[i])
    );

    expect(maxHeap.size(heap)).toBe(addValues.length);

    maxHeap.clear(heap);

    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);
  });

  it('Remove', () => {
    const values = [4, 7, 6, 1, 9, 3];
    const nodes = values.map((key) => ({ key }));
    const heap = maxHeap.create();

    const expectedOnInit = [9, 7, 6, 1, 4, 3];

    expect(heap.length).toBe(0);
    expect(maxHeap.remove(heap, { key: 999 })).toBe(false); // Try to remove a node from an empty heap.
    expect(heap.length).toBe(0);

    nodes.forEach((node) => maxHeap.add(heap, node)); // Add heap nodes.

    let i = 0;
    heap.forEach((node) => {
      expect(node.key).toStrictEqual(expectedOnInit[i]);
      i++;
    });

    const removeNodesValues = [
      nodes[1],
      nodes[2],
      nodes[0],
      nodes[4],
      nodes[3],
      nodes[5],
    ];

    const expectedOnRemove = [
      [9, 4, 6, 1, 3],
      [9, 4, 3, 1],
      [9, 1, 3],
      [3, 1],
      [3],
      [],
    ];

    expect(heap.length).toBe(values.length);
    maxHeap.remove(heap, { key: 999 }); // Try to remove an invalid node.
    expect(heap.length).toBe(values.length);

    removeNodesValues.forEach((node, i) =>
      removeAndValidate(instanceType, heap, node, expectedOnRemove[i])
    );

    expect(isValidEmptyMaxHeapObj(heap)).toBe(true);
  });

  it('Increase', () => {
    const values = [4, 7, 6, 1, 9];
    const nodes = values.map((key) => ({ key }));
    const heap = maxHeap.create(nodes);

    const expectedOnInit = [9, 7, 6, 1, 4];

    let i = 0;
    heap.forEach((node) => {
      expect(node.key).toStrictEqual(expectedOnInit[i]);
      i++;
    });

    const increaseNodesValues: [(typeof nodes)[0], number][] = [
      [nodes[2], 0],
      [nodes[0], 4],
      [nodes[1], 3],
      [nodes[3], 2],
      [nodes[3], 7],
      [nodes[2], 10],
    ];

    const expectedOnIncrease = [
      [9, 7, 6, 1, 4],
      [9, 8, 6, 1, 7],
      [10, 9, 6, 1, 8],
      [10, 9, 6, 3, 8],
      [10, 10, 6, 9, 8],
      [16, 10, 10, 9, 8],
    ];

    increaseNodesValues.forEach(([node, increaseValue], i) =>
      increaseAndValidate(
        instanceType,
        heap,
        node,
        increaseValue,
        expectedOnIncrease[i]
      )
    );

    expect(maxHeap.increase(heap, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

    maxHeap.clear(heap);
  });

  it('Decrease', () => {
    const values = [4, 7, 6, 1, 9];
    const nodes = values.map((key) => ({ key }));
    const heap = maxHeap.create(nodes);

    const expectedOnInit = [9, 7, 6, 1, 4];

    let i = 0;
    heap.forEach((node) => {
      expect(node.key).toStrictEqual(expectedOnInit[i]);
      i++;
    });

    const decreaseNodesValues: [(typeof nodes)[0], number][] = [
      [nodes[2], 0],
      [nodes[0], 4],
      [nodes[1], 3],
      [nodes[3], 2],
      [nodes[3], 7],
      [nodes[2], 10],
    ];

    const expectedOnDecrease = [
      [9, 7, 6, 1, 4],
      [9, 7, 6, 1, 0],
      [9, 4, 6, 1, 0],
      [9, 4, 6, -1, 0],
      [9, 4, 6, -8, 0],
      [9, 4, -4, -8, 0],
    ];

    decreaseNodesValues.forEach(([node, increaseValue], i) =>
      decreaseAndValidate(
        instanceType,
        heap,
        node,
        increaseValue,
        expectedOnDecrease[i]
      )
    );

    expect(maxHeap.decrease(heap, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

    maxHeap.clear(heap);
  });

  describe('Iterators', () => {
    const initialValues = [8, 6, 5, 2, 9, 4, 1, 7, 3];
    const expectedValues = [9, 8, 5, 7, 6, 4, 1, 2, 3];
    const expectedValuesReversed = [...expectedValues].reverse();

    it('Entries', () => {
      const heap = maxHeap.create(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (const entry of maxHeap.entries(heap)) {
        values.push(entry.key);
      }

      const valuesReversed: number[] = [];
      for (const entry of maxHeap.entries(heap, true)) {
        valuesReversed.push(entry.key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      maxHeap.clear(heap);
    });

    it('Keys', () => {
      const heap = maxHeap.create(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (const key of maxHeap.keys(heap)) {
        values.push(key);
      }

      const valuesReversed: number[] = [];
      for (const key of maxHeap.keys(heap, true)) {
        valuesReversed.push(key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      maxHeap.clear(heap);
    });

    it('For-each', () => {
      const heap = maxHeap.create(initialValues.map((key) => ({ key })));
      heap.forEach(({ key }, i) => expect(key).toBe(expectedValues[i]));
      maxHeap.clear(heap);
    });

    it('For-of', () => {
      const heap = maxHeap.create(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (let { key } of heap) {
        values.push(key);
      }

      expect(values).toStrictEqual(expectedValues);

      maxHeap.clear(heap);
    });
  });
});
