# Addressable Binary Heaps

A versatile TypeScript library for addressable binary heaps, delivering optimized and scalable min-heap and max-heap implementations, seamlessly supporting both object-oriented and functional paradigms.

## Key Features

- 🗃️ **Addressable Heaps**: Implements **min-heap** and **max-heap** structures with an **addressable architecture**, allowing direct access to elements for modifications and extensions.

- 🚀 **High Performance**: Utilizes an **array-based implementation** for fast and efficient heap operations, ensuring optimal time complexity for insertions, deletions, and updates.

- 🛠️ **Versatile API**: Provides both **class-based** (`MaxHeap`, `MinHeap`) and **functional** (`maxHeap`, `minHeap`) APIs, catering to different programming styles.

- 🧩 **Comprehensive Operations**: Supports all essential heap functions (`add`, `remove`, `peek`, `pop`, `clear`) along with **efficient key modification methods** (`increase`, `decrease`).

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Using Class-Based Implementation](#using-class-based-implementation)
  - [Using Functional Implementation](#using-functional-implementation)
- [Importing Modules](#importing-modules)
  - [Importing the Entire Package](#importing-the-entire-package)
  - [Importing Individual Heap Functions](#importing-individual-heap-functions)
- [Code documentation](#code-documentation)
- [Issues and Support](#issues-and-support)
- [License](#license)

## System Requirements

| Package     | Version    |
| ----------- | ---------- |
| **Node.js** | ≥ `18.0.0` |
| **npm**     | ≥ `8.0.0`  |

## Installation

### Install via npm

```bash
npm install addressable-binary-heaps
```

### Install via yarn

```bash
yarn add addressable-binary-heaps
```

### Install via pnpm

```bash
pnpm install addressable-binary-heaps
```

## Getting Started

Here's a quick guide to help you get started with the library.

### Using Class-Based Implementation

```typescript
import { MaxHeap } from 'addressable-binary-heaps';

const element_1 = { key: 4 };
const element_2 = { key: 2 };
const element_3 = { key: 6 };

const initialElements = [element_1, element_2];

// Create a max-heap instance with initial elements.
const heap = new MaxHeap(initialElements);

// Get heap size.
console.log(heap.size); // 2

// Get the heap element that has the maximum key value.
console.log(heap.peek()); // { key: 4 }

// Accessing heap elements through a loop.
for (let elem of heap) {
  console.log(elem);
  /*
  { key: 4 }
  { key: 2 }
  */
}

// Add new element to the heap.
heap.add(element_3);

console.log(heap.size); // 3
console.log(heap.peek()); // { key: 6 }

// Accessing heap elements with the "forEach" iterative method.
heap.forEach((elem) => {
  console.log(elem);
  /*
  { key: 6 }
  { key: 2 }
  { key: 4 }
  */
});

// Increase heap element key value.
console.log(heap.increase(element_2, 5)); // true

// Accessing heap elements with the "entries" iterator.
for (const entry of heap.entries()) {
  console.log(entry);
  /*
  { key: 7 }
  { key: 6 }
  { key: 4 }
  */
}

// Decrease heap element key value.
console.log(heap.decrease(element_2, 10)); // true

// Accessing heap element keys with the "keys" iterator.
for (const key of heap.keys()) {
  console.log(key);
  /*
  6
  -3
  4
  */
}

// Remove from the heap the element that has the maximum key value.
console.log(heap.pop()); // { key: 6 }

console.log(heap.size); // 2
console.log(heap.peek()); // { key: 4 }

// Remove specific element from the heap.
console.log(heap.remove(element_1)); // true

console.log(heap.size); // 1
console.log(heap.peek()); // { key: -3 }

// Clear the heap.
heap.clear();

console.log(heap.size); // 0
console.log(heap.peek()); // undefined
```

### Using Functional Implementation

```typescript
import { maxHeap } from 'addressable-binary-heaps';

const element_1 = { key: 4 };
const element_2 = { key: 2 };
const element_3 = { key: 6 };

const initialElements = [element_1, element_2];

// Create a max-heap instance with initial elements.
const heap = maxHeap.create(initialElements);

// Get heap size.
console.log(heap.length); // 2

// Get the heap element that has the maximum key value.
console.log(maxHeap.peek(heap)); // { key: 4 }

// Accessing heap elements through a loop.
for (let elem of heap) {
  console.log(elem);
  /*
  { key: 4 }
  { key: 2 }
  */
}

// Add new element to the heap.
maxHeap.add(heap, element_3);

console.log(heap.length); // 3
console.log(maxHeap.peek(heap)); // { key: 6 }

// Accessing heap elements with the "forEach" iterative method.
heap.forEach((elem) => {
  console.log(elem);
  /*
  { key: 6 }
  { key: 2 }
  { key: 4 }
  */
});

// Increase heap element key value.
console.log(maxHeap.increase(heap, element_2, 5)); // true

// Accessing heap elements with the "entries" iterator.
for (const entry of maxHeap.entries(heap)) {
  console.log(entry);
  /*
  { key: 7 }
  { key: 6 }
  { key: 4 }
  */
}

// Decrease heap element key value.
console.log(maxHeap.decrease(heap, element_2, 10)); // true

// Accessing heap element keys with the "keys" iterator.
for (const key of maxHeap.keys(heap)) {
  console.log(key);
  /*
  6
  -3
  4
  */
}

// Remove from the heap the element that has the maximum key value.
console.log(maxHeap.pop(heap)); // { key: 6 }

console.log(heap.length); // 2
console.log(maxHeap.peek(heap)); // { key: 4 }

// Remove specific element from the heap.
console.log(maxHeap.remove(heap, element_1)); // true

console.log(heap.length); // 1
console.log(maxHeap.peek(heap)); // { key: -3 }

// Clear the heap.
maxHeap.clear(heap);

console.log(heap.length); // 0
console.log(maxHeap.peek(heap)); // undefined
```

## Importing Modules

The library offers flexible import options to suit different development needs. You can import everything at once, or select individual functions as needed.

### Importing the Entire Package

To access all classes, interfaces, and functional APIs:

```typescript
import {
  // Concrete Classes
  MaxHeap,
  MinHeap,

  // Abstract Base Class
  AbstractHeap,

  // Interfaces
  IHeapArray,
  IHeapNode,

  // Functional APIs
  maxHeap,
  minHeap,
} from 'addressable-binary-heaps';
```

This approach is convenient when you need a broad range of functionalities from the library.

### Importing Individual Heap Functions

For maximum control and minimal footprint, import individual functions or operations.

#### For Max Heap:

```typescript
import {
  add,
  clear,
  create,
  decrease,
  entries,
  increase,
  keys,
  peek,
  pop,
  remove,
  size,
} from 'addressable-binary-heaps/max-heap';
```

#### For Min Heap:

```typescript
import {
  add,
  clear,
  create,
  decrease,
  entries,
  increase,
  keys,
  peek,
  pop,
  remove,
  size,
} from 'addressable-binary-heaps/min-heap';
```

This method helps keep your bundle size small by only including necessary modules.

## Code documentation

The complete API reference of the library is available at the [code documentation site](https://styiannis.github.io/addressable-binary-heaps/).

## Issues and Support

If you encounter any issues or have questions, please [open an issue](https://github.com/styiannis/addressable-binary-heaps/issues).

## License

This project is licensed under the [MIT License](https://github.com/styiannis/addressable-binary-heaps?tab=MIT-1-ov-file#readme).
