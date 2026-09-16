import { maxHeap, minHeap } from '../src';
import { TESTS_DATA } from './constants';
import { isValidHeap, isValidObjectInstance } from './util';
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
    [
      'max-heap' as const,
      maxHeap,
      TESTS_DATA.removeRebalanceTowardRoot.maxHeap,
    ],
    [
      'min-heap' as const,
      minHeap,
      TESTS_DATA.removeRebalanceTowardRoot.minHeap,
    ],
  ])(
    '[%s] Remove rebalances toward the root when required',
    (_instanceType, heap, { values, expectedPopOrderDirection }) => {
      const nodes = values.map((key) => ({ key }));
      const instance = heap.create(nodes);

      const removeNode = nodes[1];

      expect(removeNode).not.toBe(undefined);

      if (removeNode) {
        expect(heap.remove(instance, removeNode)).toBe(true);
      }

      const popped: number[] = [];

      for (let node = heap.pop(instance); node; node = heap.pop(instance)) {
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
    ['max-heap' as const, maxHeap],
    ['min-heap' as const, minHeap],
  ])(
    '[%s] Remove clears the index when the target is the last element',
    (_instanceType, heap) => {
      const nodes = [10, 20, 30, 40, 50].map((key) => ({ key }));
      const instance = heap.create(nodes);
      const lastNode = instance.at(-1);

      expect(lastNode).not.toBe(undefined);

      if (lastNode) {
        expect(heap.remove(instance, lastNode)).toBe(true);

        expect(heap.increase(instance, lastNode, 1)).toBe(false);
        expect(heap.decrease(instance, lastNode, 1)).toBe(false);
      }
    }
  );

  it.each([
    ['max-heap' as const, maxHeap],
    ['min-heap' as const, minHeap],
  ])(
    '[%s] Pop on a single-element heap clears the index of the popped node',
    (_instanceType, heap) => {
      const node = { key: 1 };
      const instance = heap.create([node]);

      expect(heap.pop(instance)).toBe(node);

      expect(heap.increase(instance, node, 1)).toBe(false);
      expect(heap.decrease(instance, node, 1)).toBe(false);
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

  it.each([
    [
      'max-heap' as const,
      maxHeap,
      TESTS_DATA.increaseDecreaseNegativeAmount.maxHeap,
    ],
    [
      'min-heap' as const,
      minHeap,
      TESTS_DATA.increaseDecreaseNegativeAmount.minHeap,
    ],
  ])(
    '[%s] Increase and decrease restore the heap property with a negative amount',
    (
      instanceType,
      heap,
      { values, increaseNodeIndex, decreaseNodeIndex, negativeAmount }
    ) => {
      const nodes = values.map((key) => ({ key }));
      const instance = heap.create(nodes);

      const extreme = () =>
        'max-heap' === instanceType
          ? nodes.reduce((a, b) => (a.key >= b.key ? a : b))
          : nodes.reduce((a, b) => (a.key <= b.key ? a : b));

      expect(nodes[increaseNodeIndex]).not.toBe(undefined);

      if (nodes[increaseNodeIndex]) {
        expect(
          heap.increase(instance, nodes[increaseNodeIndex], negativeAmount)
        ).toBe(true);
        expect(isValidHeap(instanceType, instance)).toBe(true);
        expect(heap.peek(instance)).toBe(extreme());
      }

      expect(nodes[decreaseNodeIndex]).not.toBe(undefined);

      if (nodes[decreaseNodeIndex]) {
        expect(
          heap.decrease(instance, nodes[decreaseNodeIndex], negativeAmount)
        ).toBe(true);
        expect(isValidHeap(instanceType, instance)).toBe(true);
        expect(heap.peek(instance)).toBe(extreme());
      }
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
