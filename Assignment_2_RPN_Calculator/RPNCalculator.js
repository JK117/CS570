const readline_sync = require('readline-sync');
var op_symbols = ['+',"-",'*','/','%','(',')'];

// Apply Stack 
function Stack() {
    this.dataStore = [];
    this.top = 0;
    this.push = push;
    this.pop = pop;
    this.peek = peek;
    this.clear = clear;
    this.length = length;
    this.isEmpty = isEmpty;
}

function push(element) {
    this.dataStore[this.top] = element;
    this.top ++;
}

function pop() {
    return this.dataStore[--this.top];
}

function peek() {
    return this.dataStore[this.top-1];
}

function clear() {
    this.top = 0;
}

function length() {
    return this.top;
}

function isEmpty(){
    if (this.top == 0) {
        return 1;
    } else {
        return 0;
    }
}

// Apply Queue
function Queue() {
    this.dataStore = [];
    this.enqueue = enqueue;
    this.dequeue = dequeue;
    this.front = front;
    this.back = back;
    this.toString = toString;
    this.isEmpty = isEmpty;
}
  
function enqueue(element) {
    this.dataStore.push(element);
}
  
function dequeue() {
    return this.dataStore.shift();
}
  
function front() {
    return this.dataStore[0];
}
  
function back() {
    return this.dataStore[this.dataStore.length - 1];
}
  
function toString() {
    var retStr = "";
    for (var i = 0; i < this.dataStore.length; ++i) {
        retStr += this.dataStore[i] + "\n";
    }
    return retStr;
}
  
function isEmpty() {
    if (this.top == 0) {
        return true;
    } else {
        return false;
    }
}

// Convert input string to splitted array elements with regular expression
var str_to_array = function (input_str) {
    var output_array = input_str.match(/\d+(\.\d+)?|[\+\-\*\/\%\(\)]/g);
    var i = 0;
    while (i < output_array.length) {
        if (/\d+(\.\d+)?/.test(output_array[i])) {
            output_array[i] = Number(output_array[i]);
        }
        i++;
    }
    return output_array;
}

// Convert infix formation into postfix
var infix_to_postfix = function (infix_str) {
    var op_stack = new Stack();
    var infixQ = new Queue();
    var postQ = new Queue();
    var t;

    var i = 0;
    var array_temp = str_to_array(infix_str);
    while(i < array_temp.length) {
        infixQ.dataStore[i] = array_temp[i];
        i++;
        infixQ.back++;
    }

    i = 0;
    while(infixQ.dataStore[i] != null) {
        t = infixQ.front();
        infixQ.dequeue();
        var pre_t = 0;
        for (var temp = 0 ; temp < 7 ; temp++) {
            if(t == '+' || t == '-') {
                pre_t = 1;
            } else if (t == '*' || t == '/' || t == '%') {
                pre_t = 2;
            } else {
                pre_t = 3;
            }
        }
        if( t != '+' && t != '-' && t != '*' && t != '/' && t != '%' && t != '(' && t != ')') {
            postQ.enqueue(t);
        } else if (op_stack.isEmpty()) {
            op_stack.push(t);
        } else if (t == '(') {
            op_stack.push(t);
        } else if (t == ')') {
            while(op_stack.peek() != '(') {
                postQ.enqueue(op_stack.peek())
                op_stack.pop();
            }
            op_stack.pop();
        } else {
            var pre_peek = 0;
            for (var temp_stack = 0 ; temp_stack < 7 ; temp_stack++) {
                if(op_stack.peek() == '+' || op_stack.peek() == '-') {
                    pre_peek = 1;
                } else if (op_stack.peek() == '*' || op_stack.peek() == '/' || op_stack.peek() == '%') {
                    pre_peek = 2;
                } else {
                    pre_peek = 3;
                }
            }
            while (!op_stack.isEmpty() && op_stack.peek() != '(' && pre_t <= pre_peek) {
                postQ.enqueue(op_stack.peek());
                op_stack.pop();
            }
            op_stack.push(t);
        }
    }
    while (!op_stack.isEmpty()) {
        postQ.enqueue(op_stack.peek());
        op_stack.pop();
    }
    var postfix_str = postQ.dataStore.join(' ');
    return postfix_str;
}

// Calculate mathematic result with postfix expression
var calc_postfix = function (postfix_str) {
    var postfix_array = str_to_array(postfix_str);
    var eval = new Stack();
    var t;
    var i = 0;
    var topNum, nextNum, answer;
    while (postfix_array[i] != null) {
        t = postfix_array[i];
        if (t != '+' && t != '-' && t != '*' && t != '/' && t != '%' && t != '(' && t != ')') {
            eval.push(t);
        } else {
            topNum = eval.peek();
            eval.pop();
            nextNum = eval.peek();
            eval.pop();

            switch(t) {
                case '+': answer = nextNum + topNum; break;
                case '-': answer = nextNum - topNum; break;
                case '*': answer = nextNum * topNum; break;
                case '/': answer = nextNum / topNum; break;
                case '%': answer = nextNum % topNum; break;
            }
            eval.push(answer);
        }
        i++;
    }
    return answer;
}

// Main function
var infix_expression = readline_sync.question("Please enter math problem with infix format (or 'quit' to exit): ");

while (infix_expression != 'quit') {
    console.log('Math problem in infix formation: ' + infix_expression);
    var postfix_expression = infix_to_postfix(infix_expression);
    console.log('Math problem in postfix formation: ' + postfix_expression);
    var result_num = calc_postfix(postfix_expression);
    console.log('Result: ' + result_num);
    infix_expression = readline_sync.question("Please enter math problem with infix format (or 'quit' to exit): ");
}
