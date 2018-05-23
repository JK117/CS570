var random_array = [];

for (var i = 0; i < 20; i++) {
    random_array[i] = Math.ceil((Math.random() * 100));
}

function BouncyBubbleSort(input_array){
    var temp;
    var left = 0;
    var right = 0;

    for (var i = 0; i < input_array.length - 1; i++) {
        if (i % 2 == 0) {
            for (var j = left; j < input_array.length - 1 - right; j++) {
                if (input_array[j] > input_array[j + 1]) {
                    temp = input_array[j];
                    input_array[j] = input_array[j + 1];
                    input_array[j + 1] = temp;
                }
            }
            right++;
        } else {
            for (var j = input_array.length - 1 - right; j > left; j--) {
                if (input_array[j] < input_array[j - 1]) {
                    temp = input_array[j];
                    input_array[j] = input_array[j - 1];
                    input_array[j - 1] = temp;
                }
            }
            left++;
        }
    }
    return input_array; 
}

console.log(random_array);
console.log(BouncyBubbleSort(random_array));