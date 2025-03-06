# Addressable Binary Heaps

A TypeScript library for addressable binary heaps, offering efficient min-heap and max-heap implementations, supporting both object-oriented and functional programming paradigms.

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

## Importing Modules

### Importing the Entire Package

To access all classes, interfaces, and functional APIs:

```typescript
import {
  // Concrete Classes
  MaxHeap,
  MinHeap,

  // Abstract Base Class
  AbstractHeap

  // Interfaces
  IHeapArray,
  IHeapNode,

  // Functional APIs
  maxHeap,
  minHeap,
} from 'addressable-binary-heaps';
```

### Importing Individual Heap Functions

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

## Code documentation

The complete API reference of the library is available at the [code documentation site](https://styiannis.github.io/addressable-binary-heaps/).

## Issues and Support

If you encounter any issues or have questions, please [open an issue](https://github.com/styiannis/addressable-binary-heaps/issues).

## License

This project is licensed under the [MIT License](https://github.com/styiannis/addressable-binary-heaps?tab=MIT-1-ov-file#readme).
