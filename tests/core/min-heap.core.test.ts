import { minHeap } from '../../src';
import { isValidObjectInstance } from '../tests.util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyMinHeapObj,
  popAndValidate,
  removeAndValidate,
} from './tests.core.util';

describe('core >> min-heap', () => {
  const instanceType = 'min-heap';

  it('Create, add, peek, and pop [1]', () => {
    const heap = minHeap.create();

    expect(isValidObjectInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyMinHeapObj(heap)).toBe(true);

    const addValues = [10, 15, 30, 40, 50, 100, 40];
    const removeValues = [10, 15, 30, 40, 40, 50, 100];

    const expectedOnAdd = [
      [10],
      [10, 15],
      [10, 15, 30],
      [10, 15, 30, 40],
      [10, 15, 30, 40, 50],
      [10, 15, 30, 40, 50, 100],
      [10, 15, 30, 40, 50, 100, 40],
    ];

    const expectedOnRemove = [
      [15, 40, 30, 40, 50, 100],
      [30, 40, 100, 40, 50],
      [40, 40, 100, 50],
      [40, 50, 100],
      [50, 100],
      [100],
      [],
    ];

    addValues.forEach((num, i) =>
      addAndValidate(instanceType, heap, num, expectedOnAdd[i])
    );

    removeValues.forEach((num, i) =>
      popAndValidate(instanceType, heap, num, expectedOnRemove[i])
    );

    expect(isValidEmptyMinHeapObj(heap)).toBe(true);
  });

  it('Create, add, peek, and pop [2]', () => {
    const heap = minHeap.create();

    expect(isValidObjectInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyMinHeapObj(heap)).toBe(true);

    const addValues = [40, 100, 50, 40, 30, 15, 10];
    const removeValues = [10, 15, 30, 40, 40, 50, 100];

    const expectedOnAdd = [
      [40],
      [40, 100],
      [40, 100, 50],
      [40, 40, 50, 100],
      [30, 40, 50, 100, 40],
      [15, 40, 30, 100, 40, 50],
      [10, 40, 15, 100, 40, 50, 30],
    ];

    const expectedOnRemove = [
      [15, 40, 30, 100, 40, 50],
      [30, 40, 50, 100, 40],
      [40, 40, 50, 100],
      [40, 100, 50],
      [50, 100],
      [100],
      [],
    ];

    addValues.forEach((num, i) =>
      addAndValidate(instanceType, heap, num, expectedOnAdd[i])
    );

    removeValues.forEach((num, i) =>
      popAndValidate(instanceType, heap, num, expectedOnRemove[i])
    );

    expect(isValidEmptyMinHeapObj(heap)).toBe(true);
  });

  it('Create, add and clear', () => {
    const heap = minHeap.create();

    expect(isValidObjectInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyMinHeapObj(heap)).toBe(true);

    const addValues = [3, 1, 4, 2, 5];

    const expectedOnAdd = [
      [3],
      [1, 3],
      [1, 3, 4],
      [1, 2, 4, 3],
      [1, 2, 4, 3, 5],
    ];

    addValues.forEach((num, i) =>
      addAndValidate(instanceType, heap, num, expectedOnAdd[i])
    );

    expect(minHeap.size(heap)).toBe(addValues.length);

    minHeap.clear(heap);

    expect(isValidEmptyMinHeapObj(heap)).toBe(true);
  });

  it('Remove', () => {
    const values = [4, 7, 6, 1, 9, 3];
    const nodes = values.map((key) => ({ key }));
    const heap = minHeap.create();

    const expectedOnInit = [1, 4, 3, 7, 9, 6];

    expect(heap.length).toBe(0);
    expect(minHeap.remove(heap, { key: 999 })).toBe(false); // Try to remove a node from an empty heap.
    expect(heap.length).toBe(0);

    nodes.forEach((node) => minHeap.add(heap, node)); // Add heap nodes.

    let i = 0;
    heap.forEach((node) => {
      expect(node.key).toStrictEqual(expectedOnInit[i]);
      i++;
    });

    const removeNodesValues = [
      nodes[0],
      nodes[5],
      nodes[2],
      nodes[3],
      nodes[4],
      nodes[1],
    ];

    const expectedOnRemove = [
      [1, 6, 3, 7, 9],
      [1, 6, 9, 7],
      [1, 7, 9],
      [7, 9],
      [7],
      [],
    ];

    expect(heap.length).toBe(values.length);
    expect(minHeap.remove(heap, { key: 999 })).toBe(false); // Try to remove an invalid node.
    expect(heap.length).toBe(values.length);

    removeNodesValues.forEach((node, i) =>
      removeAndValidate(instanceType, heap, node, expectedOnRemove[i])
    );

    expect(isValidEmptyMinHeapObj(heap)).toBe(true);
  });

  it('Increase', () => {
    const values = [4, 7, 6, 1, 9];
    const nodes = values.map((key) => ({ key }));
    const heap = minHeap.create(nodes);

    const expectedOnInit = [1, 4, 6, 7, 9];

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
      [1, 4, 6, 7, 9],
      [1, 7, 6, 8, 9],
      [1, 8, 6, 10, 9],
      [3, 8, 6, 10, 9],
      [6, 8, 10, 10, 9],
      [8, 9, 10, 10, 16],
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

    expect(minHeap.increase(heap, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

    minHeap.clear(heap);
  });

  it('Decrease', () => {
    const values = [4, 7, 6, 1, 9];
    const nodes = values.map((key) => ({ key }));
    const heap = minHeap.create(nodes);

    const expectedOnInit = [1, 4, 6, 7, 9];

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
      [1, 4, 6, 7, 9],
      [0, 1, 6, 7, 9],
      [0, 1, 6, 4, 9],
      [-1, 0, 6, 4, 9],
      [-8, 0, 6, 4, 9],
      [-8, 0, -4, 4, 9],
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

    expect(minHeap.decrease(heap, { key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

    minHeap.clear(heap);
  });

  describe('Iterators', () => {
    const initialValues = [8, 6, 5, 2, 9, 4, 1, 7, 3];
    const expectedValues = [1, 3, 2, 5, 9, 6, 4, 8, 7];
    const expectedValuesReversed = [...expectedValues].reverse();

    it('Entries', () => {
      const heap = minHeap.create(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (const entry of minHeap.entries(heap)) {
        values.push(entry.key);
      }

      const valuesReversed: number[] = [];
      for (const entry of minHeap.entries(heap, true)) {
        valuesReversed.push(entry.key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      minHeap.clear(heap);
    });

    it('Keys', () => {
      const heap = minHeap.create(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (const key of minHeap.keys(heap)) {
        values.push(key);
      }

      const valuesReversed: number[] = [];
      for (const key of minHeap.keys(heap, true)) {
        valuesReversed.push(key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      minHeap.clear(heap);
    });

    it('For-each', () => {
      const heap = minHeap.create(initialValues.map((key) => ({ key })));
      heap.forEach(({ key }, i) => expect(key).toBe(expectedValues[i]));
      minHeap.clear(heap);
    });

    it('For-of', () => {
      const heap = minHeap.create(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (let { key } of heap) {
        values.push(key);
      }

      expect(values).toStrictEqual(expectedValues);

      minHeap.clear(heap);
    });
  });
});
