class PriorityQueue {
  indexes = [];

  insert({ priority = 0, value }) {
    let index = this.indexes.length;
    let parentIndex = this.getParentIndex(index);
    let item = { priority, value };
    if (!parentIndex) {
      this.indexes.push(item);
    } else {
      let parent = this.indexes[parentIndex];
      this.indexes.push(item);
      while (priority < parent.priority) {
        this.indexes[index] = parent;
        this.indexes[parentIndex] = item;
        if (parentIndex === 0) {
          return this;
        }
        index = parentIndex;
        parentIndex = this.getParentIndex(parentIndex);
        parent = this.indexes[parentIndex];
      }
    }
    return this;
  }

  next() {
    const next = this.indexes.length > 0 ? this.indexes[0] : null;
    const last = this.indexes.length > 0 ? this.indexes.pop() : null;
    if (this.indexes.length === 0) {
      return next;
    }

    this.indexes[0] = last;

    let index = 0;
    let current = this.indexes[0];

    while (true) {
      let leftIndex = this.getLeftChild(index);
      let rightIndex = this.getRightChild(index);
      let leftChild, rightChild;

      let swap = null;

      if (leftIndex !== null) {
        leftChild = this.indexes[leftIndex];
        swap = leftChild.priority < current.priority ? leftIndex : null;
      }

      if (rightIndex !== null) {
        rightChild = this.indexes[rightIndex];
        switch (swap) {
          case null: {
            swap = rightChild.priority < current.priority ? rightIndex : null;
            break;
          }
          default: {
            swap = rightChild.priority < leftChild.priority ? rightIndex : swap;
          }
        }
      }

      if (swap === null) break;
      this.indexes[index] = this.indexes[swap];
      this.indexes[swap] = current;
      index = swap;
    }
    return next;
  }

  getLeftChild(index) {
    let leftChildIndex = 2 * index + 1;
    return this.indexes.length > leftChildIndex ? leftChildIndex : null;
  }

  getRightChild(index) {
    let rightChildIndex = 2 * index + 2;
    return this.indexes.length > rightChildIndex ? rightChildIndex : null;
  }

  getParentIndex(index) {
    return index > 0 ? Math.floor((index - 1) / 2) : null;
  }
}

module.exports = {
  PriorityQueue,
};
