var i = 75;
while (i < 291) {
    if (i % 3 == 0) {
        if (i % 5 == 0)
            console.log('BuzzFizz');
        else
            console.log('Buzz');
    }
    else if(i % 5 == 0)
        console.log('Fizz');
    else
        console.log(i)
    i++;
}