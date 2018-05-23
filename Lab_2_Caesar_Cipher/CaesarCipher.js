//Caesar Cipher Lab
const file_stream = require('fs');
const readline_sync = require('readline-sync');

const input_path = readline_sync.question('Please input the path of input file:');
const input_txt = file_stream.readFileSync(input_path, {encoding: 'utf8'});

var input_length = input_txt.length;
var output_txt = "";

for (var count = 0; count < input_length; count++)
{
    var key = 5;
    var key_increment = count / 3;
    key_increment = parseInt(key_increment);
    key += (key_increment * 2) ;
    var temp = input_txt[count];
    var temp_value = temp.charCodeAt(0);
    
    if ((97 <= (temp_value - key) && (temp_value - key) <= 122))
    {
        temp_value -= key;
    }
    else if ((97 <= (temp_value + 26 - key) && (temp_value + 26 - key) <= 122))
    {
        temp_value += (26 - key);
    }
    else if ((65 <= (temp_value - key)) && ((temp_value - key) <= 90))
    {
        temp_value -= key;
    }
    else if ((65 <= (temp_value + 26 - key) && (temp_value + 26 - key) <= 90))
    {
        temp_value += (26 - key);
    }
    output_txt += String.fromCharCode(temp_value);
}


file_stream.writeFileSync('output.txt', output_txt, {encoding: 'utf8'});