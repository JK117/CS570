// Advanced FizzBuzz Lab
var generateArray = function (first_num, last_num) {
    // Generate the array
    var total = last_num - first_num - 1;
    var gen_array = [];
    for (var i = 0; i < total; i++) {
        gen_array[i] = i + first_num + 1;
    }
    return gen_array;
}

var fizzBuzzer = function (input_array) {
    // Replace with Fizz, Buzz and BuzzFizz
    // Cited from our own FizzBuzz lab code
    var arr_length = input_array.length;
    for (var i = 0; i < arr_length; i++) {
        if (input_array[i] % 3 == 0) {
            if (input_array[i] % 5 == 0)
                console.log('BuzzFizz');
            else
                console.log('Buzz');
        }
        else if(input_array[i] % 5 == 0)
            console.log('Fizz');
        else
            console.log(input_array[i]);
    }
}

fizzBuzzer(generateArray(10, 250));