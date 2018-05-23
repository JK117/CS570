const readline_sync = require('readline-sync');

function heapSort(array) {
    var heapSize = array.length;
    var temp;
    var result_array = [];
    for (var i = Math.floor(heapSize / 2) - 1; i >= 0; i--) {　　
        heapify(array, i, heapSize);
    }
    for (var j = heapSize - 1 ;j >= 0; j--) {
        temp = array[0];
        array[0] = array[j];
        array[j] = temp;
        result_array[j+1] = array[j+1];
        deleteRoot(array,j+1);
        heapify(array, 0, --heapSize);
    }
    result_array[0] = array[0];
    return result_array;
}

// Cited
function heapify(array, x, len) {
    var left_child = 2 * x + 1;
    var right_child = 2 * x + 2;
    var largest = x;
    var temp;
    if (left_child < len && array[left_child] > array[largest]) {
        largest = left_child;
    }
    if (right_child < len && array[right_child] > array[largest]) {
        largest = right_child;
    }
    if (largest != x) {
        temp = array[x];
        array[x] = array[largest];
        array[largest] = temp;
        heapify(array, largest, len);
    }
}
// Cited

function readIn() {
    var input_array = [];
    for(var i = 0; i < 10; i++) {
        input_array[i] = parseInt(readline_sync.question('Please input element ' + i + ':'));
    }
    console.log(input_array);
    return input_array;
}

function deleteRoot(array,j) {
    array[j] = null;
}

var input_array = readIn();

var output_array = heapSort(input_array);
console.log('Output max heap in descending order: ');
for(var i = 9; i >= 0; i--) {
    console.log(output_array[i]);
}