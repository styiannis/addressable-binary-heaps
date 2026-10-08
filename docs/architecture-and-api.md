# Architecture and API

**Last verified:** 2026-10-07 · v1.2.0

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
import type { IHeapNode } from 'addressable-binary-heaps';

export type IHeapArray<N extends IHeapNode = IHeapNode> = Array<N> & {
  indices: WeakMap<N, number>;
};
```

The heap is an array with a map from element to its current position, and
`swapHeapNodes` maintains that map on every exchange. This is what _addressable_
names. A textbook binary heap has no way to find an element it is handed: the
only position it knows is the top, and reaching any other one means scanning for
it. Given the map, `remove`, `increase` and `decrease` take an element and reach
its position in `O(1)`, leaving the `O(log n)` rebalance as the whole cost of
the operation.

## What the addressing costs

The index map requires memory, and time whenever an element enters, moves or
leaves. What it provides is direct access: an operation that starts from an
element no longer has to search for it.

**Memory.** The map is the only structure addressing adds; the array is the
heap itself, and every binary heap has one. The map holds one entry per
element, and each entry stores both the element and its index, where the array
slot beside it stores only the element. The map therefore accounts for most of
the memory the heap itself uses.

**Time.** Every swap also writes the new positions of both elements into the
map, so every rebalance does more work than in the same heap without it. The
extra work is constant per swap, so every operation stays `O(log n)`. `add` and
`pop` update the map as well, although neither of them reads from it.

**What it provides.** `remove`, `increase` and `decrease` start from an element,
not from the top, and the map is what lets them find it in `O(1)`. Without it,
the heap has to scan the array for the element, an `O(n)` step ahead of the
`O(log n)` rebalance. An array kept sorted by `splice` has no rebalance, but
shifts every element after the new position, which is also `O(n)`. The gap
between `O(n)` and `O(log n)` widens as the heap grows, so the larger the heap,
the longer the scan the map avoids.

## Two layers

`src/` divides into `core/` and `classes/`. The division is a method, not a
convention: `core/` is written as small independent functions over plain arrays,
each with behaviour and cost that can be checked in the function itself. The
classes and the generics sit on top of that layer rather than inside it.

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

The two layers do not mix on one heap. A `MinHeap` keeps its array in a `#heap`
private field and is not itself an `IHeapArray`, so the core functions cannot be
applied to it. The layer is chosen per heap.

`min-heap.ts` and `max-heap.ts` are near-duplicates on purpose. Their `heapify`
helpers differ only in the comparison operators, and writing each file out in
full keeps the cost of every function readable in the file itself. What the two
share lives in `heap.ts` and `heap.util.ts`.

## The public surface

The package root exports the classes, the two core namespaces and the two types.
Each core module is additionally published as a subpath —
`addressable-binary-heaps/min-heap` and `addressable-binary-heaps/max-heap`.

| Export                    | Kind      |
| ------------------------- | --------- |
| `MinHeap<N>` `MaxHeap<N>` | class     |
| `AbstractHeap<N>`         | abstract  |
| `minHeap` `maxHeap`       | namespace |
| `IHeapNode`               | interface |
| `IHeapArray<N>`           | type      |

Each namespace holds `create`, `clear`, `size`, `add`, `peek`, `pop`, `remove`,
`increase`, `decrease`, `entries` and `keys`. The class API is the same set
minus `create`, which the constructor replaces, plus `forEach` and
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
down, from the last one back to the root. Adding the same elements one at a time
would cost `O(n log n)`.

`clear` is linear rather than constant. The index map is a `WeakMap`, which has
no `clear` method, so each element's entry is deleted one at a time before the
array is truncated.

`remove` pops the element directly when it is the last one. Otherwise it locates
the element through the index map in `O(1)`, swaps it with the last element and
pops it. The element moved into its place is then heapified in both directions,
but at most one of the two calls moves anything, so the cost stays `O(log n)`.

`entries` and `keys` are generators. Calling one costs `O(1)`, and the `O(n)` is
paid as it is drained. Both walk the underlying array, not priority order.
Priority order costs `O(n log n)` through repeated `pop`, which empties the heap
along the way.

## Extending

Three routes, for three different intentions.

**Subclass a concrete class** when the structure is right and the API is missing
something. A membership test is one such addition, and one a subclass cannot
answer from the heap itself. The index map sits behind the `#heap` private
field, so the set has to be maintained beside the heap rather than read out of
it:

```typescript
import { MinHeap, type IHeapNode } from 'addressable-binary-heaps';

class TrackedMinHeap<N extends IHeapNode> extends MinHeap<N> {
  readonly #members = new Set<N>();

  constructor(initialNodes?: N[] | Readonly<N[]>) {
    super(initialNodes);
    initialNodes?.forEach((node) => this.#members.add(node));
  }

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

const build = { id: 'build', key: 5 };
const queue = new TrackedMinHeap<{ id: string; key: number }>([build]);
queue.add({ id: 'test', key: 1 });

console.log(queue.has(build), queue.pop()?.id, queue.has(build)); // true test true
```

**Implement `AbstractHeap<N>`** when the storage or the ordering is your own — a
d-ary heap, a heap over a comparator instead of a numeric key, or one backed by
a typed array. It requires `size`, `[Symbol.iterator]`, `add`, `clear`,
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
label their output by extension — `.mjs` and `.d.mts` on the ES side, `.cjs` and
`.d.cts` on the CommonJS side.

Two scripts check the result. `check-declared-paths` verifies that every path
declared in `package.json` exists, and that each entry point carries the
extension of the module system it is declared for. `check-dist-loads` loads the
two built entries the way a consumer would, the CommonJS one with `require` and
the ES one with `import`. Jest covers both layers, and `npm run verify` runs the
type check, the linter, the build and both checks in sequence.
