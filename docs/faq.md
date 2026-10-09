# FAQ

Behaviour that surprises readers of the API, how a failed call is reported, and
the questions the package shape raises.

**Last verified:** 2026-10-09 · v1.3.0

## Behaviour

### Why does iterating give me the elements out of order?

Because a heap is not sorted. Every way of iterating it — `for...of`, `entries`,
`keys` and `forEach` — walks the array the heap is stored in, from index `0`,
and the `reversed` argument walks the same array from the end.
[Getting started](getting-started.md#iterate-knowing-what-the-order-is) explains
why that array guarantees only its top, and shows four elements iterated in
array order and then drained in priority order.

Priority order comes from `pop`, repeated until the heap is empty, at a total
cost of `O(n log n)`.

### I assigned `node.key` myself and nothing moved

The heap is only notified through `increase` and `decrease`. A direct assignment
changes the number and leaves the element exactly where it was, so the top can
end up holding a key that is no longer the smallest:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q1 = new MinHeap<Task>();

const late = new Task('late', 9);

q1.add(new Task('a', 1));
q1.add(new Task('mid', 4));
q1.add(late);

late.key = 0;

console.log(q1.peek()?.id); // a
console.log([...q1.keys()]); // [ 1, 4, 0 ]
```

Use `q1.decrease(late, 9)` instead of `late.key = 0`. If the new priority is
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

const q2 = new MinHeap<Task>();

const wrong = new Task('wrong', 9);

q2.add(new Task('a', 1));
q2.add(new Task('mid', 4));
q2.add(wrong);

console.log([...q2.keys()]); // [ 1, 4, 9 ]

q2.increase(wrong, -20);

console.log([...q2.keys()]); // [ -11, 4, 1 ]
console.log(q2.peek()?.key); // -11
```

`increase(node, -20)` and `decrease(node, 20)` produce the same heap. `increase`
and `decrease` are two names for the same operation — a signed change to `key` —
kept separate because a caller reasoning about priorities usually already knows
which direction they mean.

### Can the same object be in the heap twice?

No. The heap tracks positions by object identity, so `add` ignores an element
the heap already holds, and the constructor keeps only the first occurrence of
an element listed more than once:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const twice = new Task('twice', 9);

const q3 = new MinHeap<Task>([new Task('a', 1), twice, twice]);

console.log(q3.size); // 2

q3.add(twice);

console.log(q3.size); // 2
console.log([...q3].map((t) => t.id)); // [ 'a', 'twice' ]
```

`add` returns nothing, so `size` is the only sign that a call was ignored. If a
job can be queued more than once, give each occurrence its own object.

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

`b` reports `b1` as its minimum while holding an element with a lower key. An
element belongs to one heap at a time; use a second object for the second heap.

### How do I check whether an element is still in the heap?

There is no `has`. The class API answers only indirectly. `remove`, `increase`
and `decrease` all return `false` for an element the heap does not hold, and the
two that would otherwise write to `key` leave it untouched:

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

### Can I add, pop or remove while iterating?

No. The iterator walks the array by index.

`add` places the new element at the end of the array and heapifies it up, which
moves elements the walk has already passed to positions it has not reached:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q4 = new MinHeap<Task>();

[1, 3, 5].forEach((k) => q4.add(new Task(`t${k}`, k)));

const seen: string[] = [];
for (const t of q4) {
  seen.push(t.id);
  if (seen.length === 2) {
    q4.add(new Task('t0', 0));
  }
}

console.log(seen); // [ 't1', 't3', 't5', 't3' ]
console.log([...q4].map((t) => t.id)); // [ 't0', 't1', 't5', 't3' ]
```

`t3` is visited twice and `t0` never. Since the walk reads the length as it
goes, a loop that adds a new element on every step never ends. `forEach` walks
the same way.

`pop` and `remove` fill the position they empty with the last element of the
array, unless that element is the one they take. Elements therefore shift
under the walk:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const q5 = new MinHeap<Task>();

[5, 3, 8, 1].forEach((k) => q5.add(new Task(`t${k}`, k)));

const seen: string[] = [];
for (const t of q5) {
  seen.push(t.id);
  if (t.key === 1) {
    q5.pop();
  }
}

console.log(seen); // [ 't1', 't5', 't8' ]
console.log([...q5.keys()]); // [ 3, 5, 8 ]
```

`t3` is never visited even though it is still in the heap.

Collect first and mutate afterwards — `[...heap]` gives you a snapshot to
iterate safely.

### What does `clear()` do to my objects?

It empties the heap and forgets every recorded position. Your objects are
untouched, including their `key` values, and the heap no longer recognises them:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const kept = new Task('kept', 2);

const q6 = new MinHeap<Task>([new Task('x', 1), kept]);

q6.clear();

console.log(q6.size, q6.peek()); // 0 undefined
console.log(kept.key, q6.remove(kept)); // 2 false
```

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

const q7 = new MinHeap<Task>();

['p', 'q', 'r', 's'].forEach((id) => q7.add(new Task(id, 1)));

console.log([q7.pop()?.id, q7.pop()?.id, q7.pop()?.id, q7.pop()?.id]);
// [ 'p', 's', 'r', 'q' ]
```

For FIFO among equal priorities, fold a sequence counter into the key so that no
two elements compare equal:

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

const q8 = new MinHeap<Task>();

['p', 'q', 'r', 's'].forEach((id) => q8.add(new Task(id, ordered(1))));

console.log([q8.pop()?.id, q8.pop()?.id, q8.pop()?.id, q8.pop()?.id]);
// [ 'p', 'q', 'r', 's' ]
```

_Note:_ The factor `1e6` is a limit: with integer priorities, the order holds
for the first million insertions, after which the counter can push a key past
those of the next priority.

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

const q10 = new MinHeap<Task>();
q10.add(new Task('a', 5));
q10.add(new Task('b', 3));
q10.add(new Task('c', 8));
q10.add(new Task('d', 1));
q10.add(new Task('inf', Infinity));
q10.add(new Task('neg-inf', -Infinity));

console.log(q10.peek()?.id); // neg-inf

const order: string[] = [];

while (q10.size > 0) {
  order.push((q10.pop() as Task).id);
}

console.log(order); // [ 'neg-inf', 'd', 'b', 'a', 'c', 'inf' ]
```

An infinite key is accepted; an infinite amount is not. `increase` and
`decrease` return `false` for an amount that is not a finite number, because
`Infinity` followed by `-Infinity` would leave the key `NaN`.

### What happens with a `NaN` key, or one that is not a number?

`key` is typed `number`, and nothing checks it at run time. The heap only ever
applies `<`, `>`, `<=` and `>=` to keys, so a key of another type is still
ordered, by whatever those operators do with it. They may coerce it to a number,
compare it as text, or never return `true` at all.

`NaN` passes the type check and is that last case. The rebalancing never finds
its stop condition, so the node moves whenever it is compared with its parent or
a child: to the root on `add`, back down a level as later insertions climb past
it, and, on `increase` or `decrease`, down to a leaf if it has children or up to
the root if it has none. Its position is undefined, not merely wrong. Keep keys
to numbers other than `NaN`.

### How does a call report that it failed?

Three things are checked at run time: the amount passed to `increase` and
`decrease`, whether the initial value is an array, and whether an element passed
to `add` or the constructor is
[already in the heap](#can-the-same-object-be-in-the-heap-twice). The library
defines no error of its own.

Most calls report failure through their return value. `peek` and `pop` return
`undefined` on an empty heap. `remove`, `increase` and `decrease` return `false`
for an element the heap does not hold. `increase` and `decrease` also return
`false` for an amount that is not a finite number. In every case the heap and
`key` are left as they were.

A node whose `key` cannot be written, such as a frozen object or a class with a
getter and no setter, satisfies `IHeapNode`. `increase` and `decrease` assign to
`key`, so on such a node they throw the `TypeError` JavaScript raises, before
the heap changes:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

const fixed = Object.freeze({ key: 2 });
const h = new MinHeap([{ key: 1 }, fixed]);

try {
  h.decrease(fixed, 5);
} catch (e) {
  console.log(e instanceof TypeError); // true
}

console.log(fixed.key, h.peek()?.key); // 2 1
```

Calls TypeScript rejects can throw the same way. Examples are `null` or a
primitive passed to `add` or placed in the initial array, and `forEach(null)` on
a heap that is not empty. A value passed instead of the initial array, such as a
`Set` or a string, does not throw: it is ignored, and the heap starts empty.

Some misuse is not reported at all, and leaves the heap ordered on keys that no
longer hold:
[assigning `key` directly](#i-assigned-nodekey-myself-and-nothing-moved),
[sharing one object between two heaps](#can-one-object-be-in-two-heaps-at-once)
and [a `NaN` key](#what-happens-with-a-nan-key-or-one-that-is-not-a-number).

## Environment and integration

### Does it work in the browser?

Yes. `src/` references no platform API — no `process`, no `document`, no
`Buffer`, no timers — so the built modules run unmodified in browsers, Node,
Deno, Bun, workers and edge runtimes. There is nothing to polyfill.

### ESM or CommonJS?

Both. `import` resolves to `dist/es/index.mjs` and `require` to
`dist/cjs/index.cjs`, each with its own declarations —
`dist/@types/es/index.d.mts` and `dist/@types/cjs/index.d.cts` — emitted from
the same source by the same build. The module system is carried by the file
extension rather than inferred from a `type` field, so Node reads each build as
what it is and neither path prints a warning.

### Can I import only part of the library?

Yes — the two core modules are published as subpaths:

```typescript
import * as minHeap from 'addressable-binary-heaps/min-heap';
import * as maxHeap from 'addressable-binary-heaps/max-heap';
```

Those are the only subpaths. `MinHeap`, `MaxHeap`, `AbstractHeap` and the
types `IHeapNode` and `IHeapArray` are available from the package root.

TypeScript resolves the subpaths only when `moduleResolution` is `node16`,
`nodenext` or `bundler`. If your configuration uses `node10`, which is what
`module: commonjs` selects by default, import from the package root instead.

### Will unused parts be dropped from my bundle?

The package declares `"sideEffects": false` and ships an ES build that keeps one
module per source file, so a bundler that performs tree-shaking removes what you
do not import. Importing `MinHeap` alone does not pull in the max-heap module.

### What does it depend on at runtime?

Nothing. `dependencies` and `peerDependencies` are both absent from
`package.json`; everything under `devDependencies` is build and test tooling.

### What are the version requirements?

Node 18.12 or later and npm 8 or later, as `engines` in `package.json`
declares. The published code targets ES2022.
