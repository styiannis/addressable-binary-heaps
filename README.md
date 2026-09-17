# Addressable Binary Heaps

[![NPM Version](https://img.shields.io/npm/v/addressable-binary-heaps)](https://www.npmjs.com/package/addressable-binary-heaps)
[![Coverage Status](https://img.shields.io/coverallsCoverage/github/styiannis/addressable-binary-heaps)](https://coveralls.io/github/styiannis/addressable-binary-heaps?branch=main)

Min-heaps and max-heaps for TypeScript in which **your object is the element**.
The heap keeps track of where every element sits, so raising or lowering an
element's priority, or taking it out of the queue entirely, never begins with a
search for it.

## Install

```bash
npm install addressable-binary-heaps
```

`yarn add` and `pnpm add` work the same way. The package requires Node 18.12 or
later, and ships an ES build and a CommonJS build with type definitions for
each.

## Your object is the element

There is no wrapper node and no base class to extend. Anything carrying a
numeric `key` is an element, and `key` is the priority the heap orders by:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const compile = new Task('compile', 3);
const deploy = new Task('deploy', 5);
const lint = new Task('lint', 8);

// A heap can be built from elements you already hold, or filled one at a time.
const queue = new MinHeap<Task>([compile, deploy, lint]);
queue.add(new Task('test', 1));

console.log(queue.size, queue.peek()?.id); // 4 test

// Reprioritising takes the object itself — no index, no handle to keep.
queue.decrease(deploy, 5);
console.log(queue.peek()?.id, deploy.key); // deploy 0

// So does cancelling. `remove` reports whether the element was there.
console.log(queue.remove(lint), queue.size); // true 3
console.log(queue.remove(lint)); // false

console.log(queue.pop()?.id, queue.pop()?.id, queue.pop()?.id);
// deploy test compile
```

## Reaching an element that is already in the heap

`increase` and `decrease` take the element rather than a position, adjust `key`,
and restore the heap property from wherever that element happens to be sitting —
in whichever direction the new key requires. `MaxHeap` is the same structure
with the comparison reversed:

```typescript
import { MaxHeap } from 'addressable-binary-heaps';

const disk = { name: 'disk', key: 2 };

const alerts = new MaxHeap([
  disk,
  { name: 'cpu', key: 7 },
  { name: 'memory', key: 4 },
  { name: 'network', key: 9 },
  { name: 'queue', key: 5 },
]);

console.log(alerts.peek()?.name); // network

// The lowest element becomes the highest, without being removed and re-added.
alerts.increase(disk, 10);
console.log(alerts.peek()?.name, disk.key); // disk 12

// Iteration follows the underlying array, not priority order.
console.log([...alerts.keys()]); // [ 12, 9, 4, 7, 5 ]

// Priority order is what repeated `pop` produces.
console.log(alerts.pop()?.name, alerts.pop()?.name); // disk network
```

Both operations reach the element through a `WeakMap` from element to array
index, which the heap maintains through every swap. A heap without that map has
to scan its array before it can act on a given element, and an array kept sorted
has to shift everything past the position that changed; the distance between
those and this one grows with the size of the structure.

## The same heaps as plain functions

The classes delegate to a layer of plain functions over a plain array, and that
layer is exported as `minHeap` and `maxHeap`. A heap built by it is an ordinary
`Array` carrying an `indices` property, so everything `Array` offers still works
on it:

```typescript
import { minHeap, IHeapArray, IHeapNode } from 'addressable-binary-heaps';

interface Entry extends IHeapNode {
  path: string;
}

const heap = minHeap.create<IHeapArray<Entry>>([
  { path: 'b.png', key: 40 },
  { path: 'a.png', key: 12 },
  { path: 'c.png', key: 7 },
]);

console.log(minHeap.size(heap), heap.length); // 3 3
console.log(minHeap.peek(heap)?.path); // c.png
console.log(heap.map((e) => e.path)); // [ 'c.png', 'a.png', 'b.png' ]

console.log(minHeap.pop(heap)?.path, minHeap.size(heap)); // c.png 2
```

## Importing

Everything the package exports is available from its root:

```typescript
import {
  MinHeap, // class
  MaxHeap, // class
  AbstractHeap, // abstract base, for an implementation of your own
  minHeap, // the functions MinHeap delegates to
  maxHeap, // the functions MaxHeap delegates to
  type IHeapNode, // { key: number }
  type IHeapArray, // Array<N> & { indices: WeakMap<N, number> }
} from 'addressable-binary-heaps';
```

Each core module is additionally published under its own subpath, for code that
uses one ordering and should carry nothing of the other:

```typescript
import * as minHeap from 'addressable-binary-heaps/min-heap';
import * as maxHeap from 'addressable-binary-heaps/max-heap';

const low = minHeap.create([{ key: 3 }, { key: 1 }]);
const high = maxHeap.create([{ key: 3 }, { key: 1 }]);

console.log(minHeap.peek(low)?.key, maxHeap.peek(high)?.key); // 1 3
```

## API

`MinHeap<N>` and `MaxHeap<N>` expose the same members. Both extend
`AbstractHeap<N>`, which is exported so that a structure of your own can stand
in for either. Every member but `forEach` and `[Symbol.iterator]` has a
functional counterpart, shown here for `minHeap` and identical for `maxHeap`:

| Class member                   | Function                            | Cost                    |
| ------------------------------ | ----------------------------------- | ----------------------- |
| `new MinHeap(initial?)`        | `minHeap.create(initial?)`          | `O(n)`                  |
| `size`                         | `minHeap.size(h)`                   | `O(1)`                  |
| `add(node)`                    | `minHeap.add(h, node)`              | `O(log n)`              |
| `peek()`                       | `minHeap.peek(h)`                   | `O(1)`                  |
| `pop()`                        | `minHeap.pop(h)`                    | `O(log n)`              |
| `remove(node)`                 | `minHeap.remove(h, node)`           | `O(log n)`              |
| `increase(node, amount)`       | `minHeap.increase(h, node, amount)` | `O(log n)`              |
| `decrease(node, amount)`       | `minHeap.decrease(h, node, amount)` | `O(log n)`              |
| `clear()`                      | `minHeap.clear(h)`                  | `O(n)`                  |
| `entries(reversed?)`           | `minHeap.entries(h, reversed?)`     | `O(n)`, **array order** |
| `keys(reversed?)`              | `minHeap.keys(h, reversed?)`        | `O(n)`, **array order** |
| `forEach(callback, thisArg?)`  | —                                   | `O(n)`, **array order** |
| `[Symbol.iterator](reversed?)` | —                                   | `O(n)`, **array order** |

The emphasis is the one thing to carry away from the table: every form of
iteration follows the underlying array, and array order in a heap is not
priority order.

Nothing in the library throws. A call that cannot find its element returns
`false`, and a call on an empty heap returns `undefined`.

## When not to use it

Addressing is not free: it costs memory for every element held and time on
every insertion. What follows are the cases where nothing is bought with it.

| If this describes the problem                      | Reach for                                                                                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Only `add` and `pop`; priorities never move        | a binary heap without addressing — the index map would be paid for and never used                                                              |
| The whole order, once, over a set already complete | `Array.prototype.sort`, which is both faster here and the shorter program                                                                      |
| Ordering by something other than a number          | a heap that takes a comparator — `key` is typed `number` and compared with `<` and `>`, and there is no comparator parameter                   |
| Frequent membership tests                          | a `Set` maintained beside the heap — there is no `has`, and a `false` from `remove`, `increase` or `decrease` is the only signal the API gives |
| One element queued in two structures at once       | a separate object per structure — `increase` and `decrease` write to `node.key`, and the other heap is never told it changed                   |

## Documentation

- [Guides, the FAQ and the architecture write-up](https://github.com/styiannis/addressable-binary-heaps/tree/main/docs) —
  getting a heap running, the behaviour that surprises people, and how the
  library is built, including what the addressing measurably costs.
- [The generated API reference](https://styiannis.github.io/addressable-binary-heaps/) —
  every signature and every type.
- [Open an issue](https://github.com/styiannis/addressable-binary-heaps/issues)
  for a question or a bug report.

Released under the
[MIT License](https://github.com/styiannis/addressable-binary-heaps/blob/main/LICENSE).
