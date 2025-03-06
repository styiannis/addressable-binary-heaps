import { MaxHeap } from '../../src';
import { isValidClassInstance } from '../tests.util';
import {
  addAndValidate,
  decreaseAndValidate,
  increaseAndValidate,
  isValidEmptyHeapInstance,
  popAndValidate,
  removeAndValidate,
} from './tests.classes.util';

describe('classes >> max-heap', () => {
  const instanceType = 'MaxHeap';

  it('Create, add, peek, and pop [1]', () => {
    const heap = new MaxHeap();

    expect(isValidClassInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyHeapInstance(heap)).toBe(true);

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

    addValues.forEach((num, i) => addAndValidate(heap, num, expectedOnAdd[i]));

    removeValues.forEach((num, i) =>
      popAndValidate(heap, num, expectedOnRemove[i])
    );

    expect(isValidEmptyHeapInstance(heap)).toBe(true);
  });

  it('Create, add, peek, and pop [2]', () => {
    const heap = new MaxHeap();

    expect(isValidClassInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyHeapInstance(heap)).toBe(true);

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

    addValues.forEach((num, i) => addAndValidate(heap, num, expectedOnAdd[i]));

    removeValues.forEach((num, i) =>
      popAndValidate(heap, num, expectedOnRemove[i])
    );

    expect(isValidEmptyHeapInstance(heap)).toBe(true);
  });

  it('Create, add and clear', () => {
    const heap = new MaxHeap();

    expect(isValidClassInstance(heap, instanceType)).toBe(true);
    expect(isValidEmptyHeapInstance(heap)).toBe(true);

    const addValues = [3, 1, 4, 2, 5];

    const expectedOnAdd = [
      [3],
      [3, 1],
      [4, 1, 3],
      [4, 2, 3, 1],
      [5, 4, 3, 1, 2],
    ];

    addValues.forEach((num, i) => addAndValidate(heap, num, expectedOnAdd[i]));

    expect(heap.size).toBe(addValues.length);

    heap.clear();

    expect(isValidEmptyHeapInstance(heap)).toBe(true);
  });

  it('Remove', () => {
    const values = [4, 7, 6, 1, 9, 3];
    const nodes = values.map((key) => ({ key }));
    const heap = new MaxHeap();

    const expectedOnInit = [9, 7, 6, 1, 4, 3];

    expect(heap.size).toBe(0);
    expect(heap.remove({ key: 999 })).toBe(false); // Try to remove a node from an empty heap.
    expect(heap.size).toBe(0);

    nodes.forEach((node) => heap.add(node)); // Add heap nodes.

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

    expect(heap.size).toBe(values.length);
    expect(heap.remove({ key: 999 })).toBe(false); // Try to remove an invalid node from the heap.
    expect(heap.size).toBe(values.length);

    removeNodesValues.forEach((node, i) =>
      removeAndValidate(heap, node, expectedOnRemove[i])
    );

    expect(isValidEmptyHeapInstance(heap)).toBe(true);
  });

  it('Increase', () => {
    const values = [4, 7, 6, 1, 9];
    const nodes = values.map((key) => ({ key }));
    const heap = new MaxHeap(nodes);

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
      increaseAndValidate(heap, node, increaseValue, expectedOnIncrease[i])
    );

    expect(heap.increase({ key: 999 }, 111)).toBe(false); // Try to increase the value of an invalid node.

    heap.clear();
  });

  it('Decrease', () => {
    const values = [4, 7, 6, 1, 9];
    const nodes = values.map((key) => ({ key }));
    const heap = new MaxHeap(nodes);

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
      decreaseAndValidate(heap, node, increaseValue, expectedOnDecrease[i])
    );

    expect(heap.decrease({ key: 999 }, 111)).toBe(false); // Try to decrease the value of an invalid node.

    heap.clear();
  });

  describe('Iterators', () => {
    const initialValues = [8, 6, 5, 2, 9, 4, 1, 7, 3];
    const expectedValues = [9, 8, 5, 7, 6, 4, 1, 2, 3];
    const expectedValuesReversed = [...expectedValues].reverse();

    it('Entries', () => {
      const heap = new MaxHeap(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (
        let iter = heap.entries(), curr = iter.next();
        !curr.done;
        curr = iter.next()
      ) {
        values.push(curr.value.key);
      }

      const valuesReversed: number[] = [];
      for (
        let iter = heap.entries(true), curr = iter.next();
        !curr.done;
        curr = iter.next()
      ) {
        valuesReversed.push(curr.value.key);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      heap.clear();
    });

    it('Keys', () => {
      const heap = new MaxHeap(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (
        let iter = heap.keys(), curr = iter.next();
        !curr.done;
        curr = iter.next()
      ) {
        values.push(curr.value);
      }

      const valuesReversed: number[] = [];
      for (
        let iter = heap.keys(true), curr = iter.next();
        !curr.done;
        curr = iter.next()
      ) {
        valuesReversed.push(curr.value);
      }

      expect(values).toStrictEqual(expectedValues);
      expect(valuesReversed).toStrictEqual(expectedValuesReversed);

      heap.clear();
    });

    it('For-each', () => {
      const heap = new MaxHeap(initialValues.map((key) => ({ key })));

      heap.forEach(({ key }, index, heapInstance) => {
        expect(key).toBe(expectedValues[index]);
        expect(heapInstance).toStrictEqual(heap);
      });

      heap.clear();
    });

    it('For-of', () => {
      const heap = new MaxHeap(initialValues.map((key) => ({ key })));

      const values: number[] = [];
      for (let { key } of heap) {
        values.push(key);
      }

      expect(values).toStrictEqual(expectedValues);

      heap.clear();
    });
  });
});
