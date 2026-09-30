# Architecture and API

**Last verified:** 2026-09-21 · v1.2.0

## One numeric field as the whole contract

`IHeapNode` declares a single property:

```typescript
export interface IHeapNode {
  key: number;
}
```

There is no value field, no identifier, no wrapper node and no base class to
extend. An element is any object that carries a number under the name `key`.
That means the objects a program already has can become heap elements without
being boxed into anything.

The second type is where the design decision actually lives:

```typescript
import { IHeapNode } from 'addressable-binary-heaps';

export type IHeapArray<N extends IHeapNode = IHeapNode> = Array<N> & {
  indices: WeakMap<N, number>;
};
```

The heap is an array with a map from element to its current position, and
`swapHeapNodes` maintains that map on every exchange. This is what
_addressable_ names. A textbook binary heap has no way to find an element it
is handed: the only position it knows is the top, and reaching any other one
means scanning for it. Given the map, `remove`, `increase` and `decrease` take
an element and reach its position in `O(1)`, leaving the `O(log n)` rebalance
as the whole cost of the operation.

## What the addressing costs

It costs memory and insertion time, both measurable.

For one million elements, each an object carrying an id and a key, the objects
alone retain 64.0 MB in an `Array`. Adding them to a `MinHeap` — the array and
the map, with the objects still held separately so only the heap's own
overhead is counted — brings the total to 108.0 MB. The heap therefore costs
44.0 bytes per element, and the two structures it adds account for all of it.
The `WeakMap` entry takes 33.6 bytes and the array slot about 10.4, because a
heap array is grown by `push` and carries the allocator's spare capacity.

Insertion pays the same map. Adding 100,000 elements took 33.0 ms in one
measured run, against 23.1 ms for the same binary heap written without the
index map, because every swap along the way writes two map entries.

What the map buys is every operation that begins from an element instead of
from the top. A heap without the index map has to scan the array before it can
rebalance. An array kept sorted by `splice` has to move every element that sits
after the new position. The same run measured all three over 100,000 elements,
with a dash marking the one comparison that was not made:

| 100,000 operations       | addressable | no index map | sorted array |
| ------------------------ | ----------: | -----------: | -----------: |
| `decrease`               |     16.6 ms |   1,121.7 ms |   5,497.4 ms |
| `remove`, shuffled order |     34.4 ms |     582.5 ms |            — |

**Every figure above is a single measurement. What the section claims is the
distance between them, which survives a re-run. The figures themselves do
not.**

## Two layers

`src/` divides into `core/` and `classes/`. The division is a method, not a
convention: `core/` is written as small independent functions over plain
arrays, each with behaviour and cost that can be checked in the function
itself. The classes and the generics sit on top of that layer rather than
inside it.

```
src/
├── core/
│   ├── heap.ts          clear, size, peek, entries, keys — shared by both
│   ├── heap.util.ts     buildHeap, parent/child indices, swapHeapNodes
│   ├── min-heap.ts      heapifyUp, heapifyDown, and the public functions
│   └── max-heap.ts      the same, with the comparisons reversed
├── classes/
│   ├── AbstractHeap.ts  the abstract surface
│   └── {Min,Max}Heap.ts
└── types.ts             IHeapNode, IHeapArray
```

The `classes/` layer contains no algorithm. `MinHeap.pop` is
`return minHeap.pop(this.#heap)`, and every method but `forEach` follows the
same pattern. What the layer adds is the generic parameter that carries your
element type through the API, the `Symbol.iterator` implementation, `forEach`,
and prototypes for code that prefers them.

The two layers do not mix on one heap. A `MinHeap` keeps its array in a
`#heap` private field and is not itself an `IHeapArray`, so the core functions
cannot be applied to it. The layer is chosen per heap.

`min-heap.ts` and `max-heap.ts` are near-duplicates on purpose. Their
`heapify` helpers differ only in the comparison operators, and writing each
file out in full keeps the cost of every function readable in the file itself.
What the two share lives in `heap.ts` and `heap.util.ts`.

## The public surface

The package root exports the classes, the two core namespaces and the two
types. Each core module is additionally published as a subpath —
`addressable-binary-heaps/min-heap` and `addressable-binary-heaps/max-heap`.

| Export                    | Kind      |
| ------------------------- | --------- |
| `MinHeap<N>` `MaxHeap<N>` | class     |
| `AbstractHeap<N>`         | abstract  |
| `minHeap` `maxHeap`       | namespace |
| `IHeapNode`               | interface |
| `IHeapArray<N>`           | type      |

Each namespace holds `create`, `clear`, `size`, `add`, `peek`, `pop`,
`remove`, `increase`, `decrease`, `entries` and `keys`. The class API is the
same set minus `create`, which the constructor replaces, plus `forEach` and
`[Symbol.iterator]`.

## Complexity, as implemented

| Operation              | Cost                                      |
| ---------------------- | ----------------------------------------- |
| `size` `peek`          | `O(1)`                                    |
| `add`                  | `O(log n)`                                |
| `pop`                  | `O(log n)`                                |
| `remove`               | `O(log n)`                                |
| `increase` `decrease`  | `O(log n)`                                |
| `clear`                | `O(n)`                                    |
| `entries` `keys`       | `O(1)` call, `O(n)` drained, `O(1)` space |
| `forEach`              | `O(n)`                                    |
| `create()`             | `O(1)`                                    |
| `create(initialNodes)` | `O(n)`                                    |

`create` without `initialNodes` returns an empty heap in `O(1)`. With
`initialNodes`, it builds the heap in `O(n)` using Floyd's bottom-up heapify:
the elements are placed in the array as given, then every parent is heapified
down, from the last one back to the root. Adding the same elements one at a
time would cost `O(n log n)`.

`clear` is linear rather than constant. The index map is a `WeakMap`, which has
no `clear` method, so each element's entry is deleted one at a time before the
array is truncated.

`remove` locates the element through the index map in `O(1)`, swaps it with
the last element and pops it. The element moved into its place is then
heapified in both directions, but at most one of the two calls moves anything,
so the cost stays `O(log n)`.

`entries` and `keys` are generators. Calling one costs `O(1)`, and the `O(n)`
is paid as it is drained. Both walk the underlying array, not priority order.
Priority order costs `O(n log n)` through repeated `pop`, which empties the
heap along the way.

## Extending

Two routes, for two different intentions.

**Subclass a concrete class** when the structure is right and the API is
missing something. A membership test is one such addition, and one a subclass
cannot answer from the heap itself. The index map sits behind the `#heap`
private field, so the set has to be maintained beside the heap rather than read
out of it:

```typescript
import { MinHeap, IHeapNode } from 'addressable-binary-heaps';

class TrackedMinHeap<N extends IHeapNode> extends MinHeap<N> {
  readonly #members = new Set<N>();

  override add(node: N) {
    this.#members.add(node);
    super.add(node);
  }

  override pop() {
    const node = super.pop();
    if (node) this.#members.delete(node);
    return node;
  }

  override remove(node: N) {
    const removed = super.remove(node);
    if (removed) this.#members.delete(node);
    return removed;
  }

  override clear() {
    this.#members.clear();
    super.clear();
  }

  has(node: N) {
    return this.#members.has(node);
  }
}

const queue = new TrackedMinHeap<{ id: string; key: number }>();
const build = { id: 'build', key: 5 };
queue.add(build);
queue.add({ id: 'test', key: 1 });

console.log(queue.has(build), queue.pop()?.id, queue.has(build)); // true test true
```

**Implement `AbstractHeap<N>`** when the storage or the ordering is your own —
a d-ary heap, a heap over a comparator instead of a numeric key, or one backed
by a typed array. It requires `size`, `[Symbol.iterator]`, `add`, `clear`,
`decrease`, `entries`, `forEach`, `increase`, `keys`, `peek`, `pop` and
`remove`, and it constrains nothing about how they are implemented.
`[Symbol.iterator]`, `entries` and `keys` declare `reversed` as optional, so
`for...of`, which never passes it, type-checks against the abstract class as
well as against the concrete ones.

The third route is the lightest: the core functions accept anything satisfying
`IHeapArray<N>`, so a structure that is an array with an `indices` map can be
passed to them without inheriting from anything.

## Tooling

TypeScript 5.9 in `strict` mode with `exactOptionalPropertyTypes` and
`noUncheckedIndexedAccess`. Rollup runs four times: the ES build, the CommonJS
build, and a declaration tree for each of them. All four run with
`preserveModules`, so the output mirrors `src/` file for file, and all four
label their output by extension — `.mjs` and `.d.mts` on the ES side, `.cjs`
and `.d.cts` on the CommonJS side.

Two scripts check the result. `check-declared-paths` verifies that every path
declared in `package.json` exists, and that each entry point carries the
extension of the module system it is declared for. `check-dist-loads` loads the
two built entries the way a consumer would, the CommonJS one with `require` and
the ES one with `import`. Jest covers both layers, and `npm run verify` runs the
type check, the linter, the build and both checks in sequence.
