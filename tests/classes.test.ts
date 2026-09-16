import { MaxHeap, MinHeap } from '../src';
import { TESTS_DATA } from './constants';
import { isValidHeap, isValidClassInstance } from './util';
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
      instanceType,
      Heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = new Heap();

      expect(isValidClassInstance(instanceType, instance)).toBe(true);
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
      instanceType,
      Heap,
      { addValues, removeValues, expectedAfterAdditions, expectedAfterRemovals }
    ) => {
      const instance = new Heap();

      expect(isValidClassInstance(instanceType, instance)).toBe(true);
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
    (instanceType, Heap, { addValues, expectedAfterAdditions }) => {
      const instance = new Heap();

      expect(isValidClassInstance(instanceType, instance)).toBe(true);
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
    [
      'max-heap' as const,
      MaxHeap,
      TESTS_DATA.removeRebalanceTowardRoot.maxHeap,
    ],
    [
      'min-heap' as const,
      MinHeap,
      TESTS_DATA.removeRebalanceTowardRoot.minHeap,
    ],
  ])(
    '[%s] Remove rebalances toward the root when required',
    (_instanceType, Heap, { values, expectedPopOrderDirection }) => {
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
    ['max-heap' as const, MaxHeap],
    ['min-heap' as const, MinHeap],
  ])(
    '[%s] Remove clears the index when the target is the last element',
    (_instanceType, Heap) => {
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
    ['max-heap' as const, MaxHeap],
    ['min-heap' as const, MinHeap],
  ])(
    '[%s] Pop on a single-element heap clears the index of the popped node',
    (_instanceType, Heap) => {
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
      'max-heap' as const,
      MaxHeap,
      TESTS_DATA.increaseDecreaseNegativeAmount.maxHeap,
    ],
    [
      'min-heap' as const,
      MinHeap,
      TESTS_DATA.increaseDecreaseNegativeAmount.minHeap,
    ],
  ])(
    '[%s] Increase and decrease restore the heap property with a negative amount',
    (
      instanceType,
      Heap,
      { values, increaseNodeIndex, decreaseNodeIndex, negativeAmount }
    ) => {
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
