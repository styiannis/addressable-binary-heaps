# Getting started

From an empty project to a priority queue you can add to, take from, reorder
while it is full, and cancel out of.

**Last verified:** 2026-09-18 · v1.2.0 · Node ≥ 18.12

## Install

```bash
npm install addressable-binary-heaps
```

The package has no runtime dependencies. It ships an ES build, a CommonJS
build and type definitions, so TypeScript needs no additional configuration
and JavaScript works with either module system.

## Put your own objects in a heap

The first thing to know is that there is nothing to extend and nothing to wrap.
An element is any object with a numeric `key`, and `key` is the priority. Your
class stays your class:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const queue = new MinHeap<Task>();

const compile = new Task('compile', 3);
const deploy = new Task('deploy', 5);

queue.add(compile);
queue.add(deploy);
queue.add(new Task('lint', 8));
queue.add(new Task('test', 1));

console.log(queue.size); // 4
console.log(queue.peek()?.id, queue.peek()?.key); // test 1
```

Pass the class as the generic parameter, as `MinHeap<Task>` does above, and
`peek`, `pop` and the iterators all give you back a `Task`. In a `MinHeap` the
lowest key is the top; `MaxHeap` offers the identical API with the comparison
reversed.

## Take from the top

`peek` reads the top without disturbing it, and `pop` removes and returns it.
Both are `undefined` on an empty heap — the library does not throw.

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const drained = new MinHeap<Task>([
  new Task('c', 30),
  new Task('a', 10),
  new Task('b', 20),
]);

console.log(drained.pop()?.id, drained.pop()?.id, drained.pop()?.id); // a b c
console.log(drained.pop(), drained.peek(), drained.size); // undefined undefined 0
```

The constructor takes an optional array of elements and builds the heap from it
in `O(n)`, rather than adding them one at a time. The order they arrive in does
not matter; the order they leave in is priority order.

## Change a priority while the element is queued

This is the operation the structure exists for. A scheduler learns that a
queued job became urgent, and the job object is something you are still
holding, so no search is needed to find its position:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const queue = new MinHeap<Task>();

const compile = new Task('compile', 3);
const deploy = new Task('deploy', 5);
const lint = new Task('lint', 8);
const test = new Task('test', 1);

queue.add(compile);
queue.add(deploy);
queue.add(lint);
queue.add(test);

console.log(queue.decrease(deploy, 5)); // true
console.log(queue.peek()?.id, deploy.key); // deploy 0

console.log(queue.increase(compile, 100)); // true
console.log(compile.key, queue.peek()?.id); // 103 deploy

console.log(queue.decrease(new Task('stranger', 0), 1)); // false
```

`decrease` subtracts the amount from `key` and moves the element to wherever
that new key belongs; `increase` adds and does the same in the other
direction. Both take the element, not an index or a handle, and both return
`false` if the heap has never seen it, as the last call above shows for an
element that was never added.

## Cancel an element from anywhere

`remove` is the same addressing applied to deletion. It takes the element and
reports whether it was there:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const compile = new Task('compile', 3);
const lint = new Task('lint', 8);
const test = new Task('test', 1);

const batch = new MinHeap<Task>([compile, lint, test]);

console.log(batch.remove(lint), batch.size); // true 2
console.log(batch.remove(lint)); // false
```

The second call is `false` because the first one removed the element and
forgot its position. That is what makes `remove` safe to call speculatively on
an element you are not sure is still queued.

## Iterate, knowing what the order is

A heap is iterable, and the order is the one thing about it that surprises
people. A binary heap is stored as an array in which every element precedes
its children, which is weaker than sorted: the top is guaranteed, the rest is
not.

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const jobs = new MinHeap<Task>();

[5, 3, 8, 1].forEach((k) => jobs.add(new Task(`t${k}`, k)));

console.log([...jobs].map((t) => t.key)); // [ 1, 3, 8, 5 ]
console.log([...jobs[Symbol.iterator](true)].map((t) => t.key)); // [ 5, 8, 3, 1 ]
```

The argument reverses the array, not the priority. `for...of` and the spread
form call the iterator with no argument, so pass it explicitly when you want
the other direction, as the second line does. `entries(reversed?)`,
`keys(reversed?)` and `forEach(callback, thisArg?)` walk the same array in the
same order.

Sorted output comes from draining, and it costs `O(n log n)`:

```typescript
import { MinHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const jobs = new MinHeap<Task>();

[5, 3, 8, 1].forEach((k) => jobs.add(new Task(`t${k}`, k)));

const sorted: number[] = [];

for (let t = jobs.pop(); t; t = jobs.pop()) {
  sorted.push(t.key);
}

console.log(sorted); // [ 1, 3, 5, 8 ]
```

## Order the other way

`MaxHeap` has the identical API and puts the highest key on top:

```typescript
import { MaxHeap } from 'addressable-binary-heaps';

class Task {
  constructor(
    public readonly id: string,
    public key: number
  ) {}
}

const scores = new MaxHeap<Task>([
  new Task('alice', 42),
  new Task('bob', 91),
  new Task('carol', 7),
]);

console.log(scores.peek()?.id); // bob
console.log(scores.increase(scores.peek()!, 9), scores.peek()?.key); // true 100
```

`increase` and `decrease` keep their names in both classes, so `increase` moves
an element towards the top of a `MaxHeap` and away from the top of a `MinHeap`.

## Work without classes

The classes delegate to a layer of functions over a plain array, and that
layer is exported. Reach for it when you are managing many short-lived heaps
and want no prototypes involved, or when you want to access the array itself.

```typescript
import { minHeap, IHeapArray, IHeapNode } from 'addressable-binary-heaps';

interface Entry extends IHeapNode {
  path: string;
}

const heap = minHeap.create<IHeapArray<Entry>>();

const small: Entry = { path: 'a.png', key: 7 };
const medium: Entry = { path: 'b.png', key: 12 };
const large: Entry = { path: 'c.png', key: 40 };

minHeap.add(heap, large);
minHeap.add(heap, medium);
minHeap.add(heap, small);

console.log(minHeap.size(heap), minHeap.peek(heap)?.path); // 3 a.png
console.log(minHeap.increase(heap, small, 100), minHeap.peek(heap)?.path); // true b.png
console.log(heap.length, heap.indices.get(small)); // 3 2
```

Every class method except `forEach` and `[Symbol.iterator]` has a function of
the same name whose first argument is the heap, and `create` replaces the
constructor. The heap itself is an ordinary `Array` carrying one extra property,
`indices`, which is the element-to-position map the addressing is built on —
readable here, private behind the classes. `maxHeap` is the same set of
functions with the comparison reversed.

## What this page did not cover

[faq.md](faq.md) covers the behaviour this page has only pointed at — what
happens when you write `key` yourself, when the same object is added twice, and
which module system resolves to which build.
[architecture-and-api.md](architecture-and-api.md) explains what the index map
costs, in bytes and in insertion time, and what the abstract class is for.
