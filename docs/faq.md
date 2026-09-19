# FAQ

Behaviour that surprises readers of the API, what the library does instead of
throwing, and the questions the package shape raises.

**Last verified:** 2026-09-19 · v1.2.0

## Behaviour

### Why does iterating give me the elements out of order?

Because a heap is not sorted. It is an array in which every element precedes
its two children, which guarantees the top and nothing else, and iteration
walks that array from index `0`:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q1 = new MinHeap<Task>();

[5, 3, 8, 1].forEach((k) => q1.add(new Task(`t${k}`, k)));

console.log([...q1].map((t) => t.key)); // [ 1, 3, 8, 5 ]
console.log(q1.peek()?.key); // 1
```

`entries`, `keys`, `forEach` and `for...of` all use the same order. Sorted
output comes from repeated `pop`, which costs `O(n log n)` and empties the
heap.

### I assigned `node.key` myself and nothing moved

The heap is only notified through `increase` and `decrease`. A direct
assignment changes the number and leaves the element exactly where it was, so
the top can end up holding a key that is no longer the smallest:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q2 = new MinHeap<Task>();

const late = new Task('late', 9);

q2.add(new Task('a', 1));
q2.add(new Task('mid', 4));
q2.add(late);

late.key = 0;

console.log(q2.peek()?.id); // a
console.log([...q2.keys()]); // [ 1, 4, 0 ]
```

Use `q2.decrease(late, 9)` instead of `late.key = 0`. If the new priority is
computed rather than known as a delta, `decrease(node, node.key - next)`
expresses it without leaving the API.

### Can I pass a negative amount to `increase()` or `decrease()`?

Yes. Both methods rebalance in whichever direction the new key requires, so a
negative amount is handled the same as calling the opposite method with a
positive one:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q3 = new MinHeap<Task>();

const wrong = new Task('wrong', 9);

q3.add(new Task('a', 1));
q3.add(new Task('mid', 4));
q3.add(wrong);

console.log([...q3.keys()]); // [ 1, 4, 9 ]

q3.increase(wrong, -20);

console.log([...q3.keys()]); // [ -11, 4, 1 ]
console.log(q3.peek()?.key); // -11
```

`increase(node, -20)` and `decrease(node, 20)` produce the same heap.
`increase` and `decrease` are two names for the same operation — a signed
change to `key` — kept separate because a caller reasoning about priorities
usually already knows which direction they mean.

### Can the same object be in the heap twice?

It can be added twice, and it should not be. The heap tracks positions by
object identity, so two positions share one recorded index, and an update
reaches one of them:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q5 = new MinHeap<Task>();

['n1', 'n2', 'n3', 'n4'].forEach((id, i) => q5.add(new Task(id, i + 1)));

const dup = new Task('dup', 9);

q5.add(dup);
q5.add(dup);

q5.decrease(dup, 8);

console.log([...q5].map((t) => `${t.id}:${t.key}`));
// [ 'n1:1', 'n2:2', 'dup:1', 'n4:4', 'dup:1', 'n3:3' ]
```

The copy at index `4` now holds a key smaller than its parent at index `1`,
which is the invariant broken. If a job can be queued more than once, give
each occurrence its own object.

### Can one object be in two heaps at once?

Each heap keeps its own position map, so the two heaps do not corrupt each
other's indices. What they share is the `key` field, and that is enough:
updating the priority through one heap changes the number the other heap has
already sorted on.

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const a = new MinHeap<Task>();
const b = new MinHeap<Task>();

const shared = new Task('shared', 9);

a.add(new Task('a1', 5));
a.add(shared);

b.add(new Task('b1', 3));
b.add(shared);

a.decrease(shared, 8);

console.log([...a].map((t) => `${t.id}:${t.key}`)); // [ 'shared:1', 'a1:5' ]
console.log(a.peek()?.id); // shared

console.log([...b].map((t) => `${t.id}:${t.key}`)); // [ 'b1:3', 'shared:1' ]
console.log(b.peek()?.id); // b1
```

`b` reports `b1` as its minimum while holding an element with a lower key.
An element belongs to one heap at a time; use a second object for the second
heap.

### How do I check whether an element is still in the heap?

There is no `has`. The class API answers only indirectly: `remove`, `increase`
and `decrease` all return `false` for an element the heap does not hold, and
the two that would otherwise write to `key` leave it untouched:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const h = new MinHeap<Task>([new Task('in', 1)]);

const outsider = new Task('outsider', 50);

console.log(h.increase(outsider, 0)); // false
console.log(h.increase(outsider, 10), outsider.key); // false 50
```

If membership is a question you ask often, keep a `Set` alongside the heap, or
subclass `MinHeap` and maintain one — see
[architecture-and-api.md](architecture-and-api.md#extending).

### Can I pop or remove while iterating?

No. The iterator walks the array by index, and both operations move the last
element into a vacated position, so elements shift under the walk:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q6 = new MinHeap<Task>();

[5, 3, 8, 1].forEach((k) => q6.add(new Task(`t${k}`, k)));

const seen: string[] = [];
for (const t of q6) {
  seen.push(t.id);
  if (t.key === 1) {
    q6.pop();
  }
}

console.log(seen); // [ 't1', 't5', 't8' ]
console.log([...q6.keys()]); // [ 3, 5, 8 ]
```

`t3` is never visited even though it is still in the heap. Collect first and
mutate afterwards — `[...heap]` gives you a snapshot to iterate safely.

### What does `clear()` do to my objects?

It empties the heap and forgets every recorded position. Your objects are
untouched, including their `key` values, and the heap no longer recognises
them:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const kept = new Task('kept', 2);

const q7 = new MinHeap<Task>([new Task('x', 1), kept]);

q7.clear();

console.log(q7.size, q7.peek()); // 0 undefined
console.log(kept.key, q7.remove(kept)); // 2 false
```

### What is `reversed` reversing?

The array, not the priority. `[...heap[Symbol.iterator](true)]` walks from the
last index to the first, which in a min-heap is neither descending nor
ascending order. `for...of` and the spread form invoke the iterator with no
argument, so the flag has to be passed explicitly to have any effect.

### Do elements with equal keys come out in insertion order?

No. Ties are broken by whatever position the rebalancing happened to leave the
elements in:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q10 = new MinHeap<Task>();

['p', 'q', 'r', 's'].forEach((id) => q10.add(new Task(id, 1)));

console.log([q10.pop()?.id, q10.pop()?.id, q10.pop()?.id, q10.pop()?.id]);
// [ 'p', 's', 'r', 'q' ]
```

For FIFO among equal priorities, fold a sequence counter into the key so that
no two elements compare equal:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

let seq = 0;
const ordered = (priority: number) => priority * 1e6 + (seq += 1);

const q11 = new MinHeap<Task>();

['p', 'q', 'r', 's'].forEach((id) => q11.add(new Task(id, ordered(1))));

console.log([q11.pop()?.id, q11.pop()?.id, q11.pop()?.id, q11.pop()?.id]);
// [ 'p', 'q', 'r', 's' ]
```

### `remove()` returned `false` for something I know I added

It was removed already. `pop` and `remove` both erase the element's recorded
position, so every later call that needs that position reports failure rather
than acting on a stale index:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q9 = new MinHeap<Task>();

const popped = new Task('popped', 1);

q9.add(popped);
q9.add(new Task('other', 2));

q9.pop();

console.log(q9.remove(popped), q9.increase(popped, 1)); // false false
```

### Does the heap copy my objects?

No. It stores references and reads `key` to order them, and `increase` and
`decrease` write to that same field on your object. Everything else is yours,
untouched, and the object you get from `peek` or `pop` is the one you put in.

### What happens with `Infinity` keys?

`Infinity` and `-Infinity` are ordinary numbers to the comparisons the heap
runs, and they order where you would expect — `-Infinity` below every finite
key, `Infinity` above every one:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q12 = new MinHeap<Task>();
q12.add(new Task('a', 5));
q12.add(new Task('b', 3));
q12.add(new Task('c', 8));
q12.add(new Task('d', 1));
q12.add(new Task('inf', Infinity));
q12.add(new Task('neg-inf', -Infinity));

console.log(q12.peek()?.id); // neg-inf

const order: string[] = [];

while (q12.size > 0) {
  order.push((q12.pop() as Task).id);
}

console.log(order); // [ 'neg-inf', 'd', 'b', 'a', 'c', 'inf' ]
```

A key that is not a number, `NaN` included, is a different matter — see
[What happens instead of an error](#what-happens-instead-of-an-error).

## What happens instead of an error

Nothing in `src/` throws. There is no validation layer and no `TypeError` to
catch, which keeps each operation to the comparisons and swaps it describes
and makes misuse silent rather than loud. These are the cases worth knowing:

| Call                                                    | Result                                                                                                                            |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `peek()` / `pop()` on an empty heap                     | `undefined`                                                                                                                       |
| `remove(node)` for an element the heap does not hold    | `false`; the heap is unchanged                                                                                                    |
| `increase` / `decrease` for an element it does not hold | `false`; `key` is **not** modified                                                                                                |
| the same object added twice                             | two positions share one recorded index; an update reaches one of them                                                             |
| `node.key` assigned directly                            | nothing moves                                                                                                                     |
| a `key` that is not a finite number                     | ordered by whatever `<`, `>`, `<=` and `>=` do with it — for `NaN` they return `false` every time, leaving its position undefined |

The duplicated object is the one that costs correctness: it leaves a
structurally valid heap whose top is wrong. The rest report failure through
their return value.

The last row is the widest. The heap only ever applies `<`, `>`, `<=` and `>=`
to keys, so a key that is not a finite number is still ordered — by whatever
those operators do with it. They may coerce it to a number, compare it as
text, or never return `true` at all.

`NaN` is that last case, and it is the worst of them. The rebalancing never
finds its stop condition, so the node moves at every comparison it takes part
in: to the root on `add`, back down a level as later insertions pass it, and
out to a leaf on `increase` or `decrease`. Its position is undefined, not
merely wrong. Keep keys finite numbers.

## Environment and integration

### Does it work in the browser?

Yes. `src/` references no platform API — no `process`, no `document`, no
`Buffer`, no timers — so the built modules run unmodified in browsers, Node,
Deno, Bun, workers and edge runtimes. There is nothing to polyfill. The one
platform requirement is `WeakMap`, which every ES2015 runtime has.

### ESM or CommonJS?

Both. `import` resolves to `dist/es/index.mjs` and `require` to
`dist/cjs/index.cjs`, each with its own declarations —
`dist/@types/es/index.d.mts` and `dist/@types/cjs/index.d.cts` — emitted from
the same source by the same build. The module system is carried by the file
extension rather than inferred from a `type` field, so Node reads each build
as what it is and neither path prints a warning.

### Can I import only part of the library?

Yes — the two core modules are published as subpaths:

```typescript
import * as minHeap from 'addressable-binary-heaps/min-heap';
import * as maxHeap from 'addressable-binary-heaps/max-heap';
```

Those are the only subpaths. `MinHeap`, `MaxHeap`, `AbstractHeap` and the
interfaces are available from the package root.

### Will unused parts be dropped from my bundle?

The package declares `"sideEffects": false` and ships an ES build that keeps
one module per source file, so a bundler that performs tree-shaking removes
what you do not import. Importing `MinHeap` alone does not pull in the
max-heap module.

### What does it depend on at runtime?

Nothing. `dependencies` and `peerDependencies` are both absent from
`package.json`; everything under `devDependencies` is build and test tooling.

### What are the version requirements?

Node 18.12 or later, and npm 8 or later. The published code targets ES2022.
