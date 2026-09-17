# Architecture and API

**Last verified:** 2026-09-18 · v1.2.0

## One numeric field as the whole contract

`IHeapNode` declares a single property:

```typescript
export interface IHeapNode {
  key: number;
}
```

There is no value field, no identifier, no wrapper node and no base class to
extend. An element is any object that carries a number under that name, which
means the objects a program already has become heap elements without being
boxed into anything.

The second type is where the design decision actually lives:

```typescript
import { IHeapNode } from 'addressable-binary-heaps';

export type IHeapArray<N extends IHeapNode = IHeapNode> = Array<N> & {
  indices: WeakMap<N, number>;
};
```

The heap is an array with a map from element to its current position, and
`swapHeapNodes` maintains that map on every exchange. This is what
_addressable_ names. A textbook binary heap can only remove from the top,
because that is the only position it knows; given the map, `remove`,
`increase` and `decrease` take an element and reach its position in `O(1)`,
leaving the `O(log n)` rebalance as the whole cost of the operation.

## What the addressing costs

It costs memory and insertion time, both measurable.

For one million elements, each an object carrying an id and a key, the objects
alone retain 61.0 MB in an `Array`. Adding them to a `MinHeap` — the array and
the map, with the objects still held separately so only the heap's own
overhead is counted — brings the total to 103.0 MB. The heap therefore costs
44.0 bytes per element, and the two structures it adds account for all of it:
about 10.4 bytes for the array slot — a heap array is grown by `push`, so it
carries the allocator's spare capacity — and 33.6 for the `WeakMap` entry.

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

`src/` divides into `core/` and `classes/`, and the division is a method
rather than a convention.

`core/` is written as small independent functions over plain objects, each
one short enough that what happens inside it can be read off the page, **and
so can the resources it requires**.
`minHeap.remove` fits on one screen, and the reason it is `O(log n)` is
visible in it: one `indices.get` locates the element, and the two `heapify`
calls that follow are the only work that depends on the size of the heap.

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

`min-heap.ts` and `max-heap.ts` are deliberate near-duplicates rather than one
parameterised module: the two `heapify` helpers differ by a comparison
operator, and inlining that difference keeps each file's cost readable in the
file itself. What they genuinely share — `clear`, `size`, `peek`, `entries`,
`keys`, and the index arithmetic — lives in `heap.ts` and `heap.util.ts` and
is not duplicated.

The `classes/` layer contains no algorithm. `MinHeap.pop` is
`return minHeap.pop(this.#heap)`; every method is that shape. What the layer
adds is the generic parameter that carries your element type through the API,
the `Symbol.iterator` implementation, `forEach`, and prototypes for code that
prefers them.

Unlike the array it wraps, a class instance is not itself an `IHeapArray`: the
heap is held in a `#heap` private field, so the core functions cannot be
applied to a `MinHeap`. Choose a layer per structure rather than mixing them
on one.

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

| Operation              | Cost                      |
| ---------------------- | ------------------------- |
| `size` `peek`          | `O(1)`                    |
| `add`                  | `O(log n)`                |
| `pop`                  | `O(log n)`                |
| `remove`               | `O(log n)`                |
| `increase` `decrease`  | `O(log n)`                |
| `clear`                | `O(n)`                    |
| `entries` `keys`       | `O(n)` time, `O(1)` space |
| `forEach`              | `O(n)`                    |
| `create(initialNodes)` | `O(n)`                    |

Two of these are worth reading twice. `clear` is linear rather than constant
because it deletes each element from the index map before truncating the
array. And the `O(log n)` on `remove` covers the rebalance alone. What it leaves
out is the map lookup that locates the element, which is `O(1)` here and a
linear scan in a heap without the map.

`create` reaches `O(n)` through Floyd's bottom-up heapify rather than a loop of
`add` calls: it fills the array and the index map in a single pass, then
heapifies down from the last parent (`⌊n/2⌋ - 1`) to the root. `O(log n)` per
insertion would cost `O(n log n)` over the whole array.

`remove` is also the operation whose implementation is least obvious. It swaps
the element with the last position, pops it, and then heapifies the replacement
**in both directions**: an element promoted from the end of the array may
belong above its new parent as easily as below its new children, and only one
of the two calls ever does work.

Iteration deserves its own line because the notation hides the surprise:
`entries` and `keys` are `O(n)` over the underlying array, and array order in
a heap is not priority order. Sorted output costs `O(n log n)` through
repeated `pop`, which empties the structure.

## Extending

Two routes, for two different intentions.

**Subclass a concrete class** when the structure is right and the API is
missing something. The most common addition is a membership test, which the
class API does not provide and a subclass cannot answer from the heap itself.
The index map is reachable only through the `#heap` private field, so the set
has to be maintained beside the heap rather than read out of it:

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
`remove`, and it constrains nothing about how they are implemented. Note that
the abstract signature declares `[Symbol.iterator](reversed: boolean)`, so an
implementation accepts the argument even though `for...of` never passes it.

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

Two scripts then check that result. `check-declared-paths` takes every path
declared in `package.json` and verifies that it exists in the build and
carries the extension its condition implies. `check-dist-loads` loads each
built entry the way a consumer would, one with `require` and one with
`import`. Jest covers both layers, and `npm run verify` runs the type check,
the linter, the build and both checks in sequence.
