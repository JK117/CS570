class Vector {
    constructor(capacity = 0) {
        this.length = 0;
        this.arr = new Array(capacity);
    }
    get capacity() { return this.arr.length; }
    resize(length) {
        // two cases: length <= capacity, or length > capacity
        if (length > this.capacity)
            this.reserve(length);
        this.length = length;
    }
    reserve(capacity) {
        if (this.capacity >= capacity)
            return;
        const copy = new Array(capacity * 2);
        for (let i = 0; i < this.length; i++)
            copy[i] = this.arr[i];
        delete this.arr; // optional
        this.arr = copy;
    }
    get(index) {
        if (index < 0)
            throw new Error("index must be positive");
        if (index >= this.length)
            return undefined;
        return this.arr[index];
    }
    set(index, value) {
        if (index < 0)
            throw new Error("index must be positive");
        if (index >= this.length)
            throw new Error("index exceeds length");
        this.arr[index] = value;
    }
    *[Symbol.iterator]() {
        for (let i = 0; i < this.length; i++)
            yield this.arr[i];
    }
    push(value) {
        if (this.length == this.capacity) {
            this.reserve(this.length + 1);
        }
        this.arr[this.length] = value;
        this.length++;
    }
    pop() {
        this.length--;
        return this.arr[this.length - 1];
    }
    insert(index, value) {
        //make sure enough space
        if (this.length == this.capacity) {
            this.reserve(this.length + 1);
        }
        //move everthing to the right of "index" over one spot
        for (let i = this.length; i >= index; i--) {
            this.arr[i] = this.arr[i - 1];
        }
        this.length++;
        this.arr[index] = value;
    }
}
function output_list(list) {
    // output each item in the list
    for (let elem of list)
        console.log(elem);
}
const vec = new Vector();
vec.resize(5);
vec.set(0, 10);
vec.set(1, 20);
vec.set(2, 22);
vec.set(3, 7);
vec.set(4, 44);
console.log('Original vec:');
output_list(vec);
console.log('Perform get(4):');
console.log(vec.get(4));
vec.push(1);
console.log('Commence push(1):');
output_list(vec);
vec.pop();
console.log('Commence pop():');
output_list(vec);
vec.insert(2, 2222);
console.log('Commence insert(2, 2222):');
output_list(vec);
