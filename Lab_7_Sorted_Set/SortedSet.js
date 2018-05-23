const fs = require('fs');
const readline_sync = require('readline-sync');

class Node {
    constructor(data) {
        this.data = data;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
}

class SortedSet {
    constructor() {
        this.num_seq = readInfile();
        this.root = null;
        for (var c of this.num_seq) {
            this.add(c)
            console.log('Number ' + c +' loaded')
        }
    }

    isEmpty() {
        if (this.root == null) {
            return true;
        }
    }

    add(value) {
        if (this.isEmpty()) {
            this.root = new Node(value);
            return;
        }
        
        var current_node = this.root;
        var new_node = new Node(value);
        while (current_node) {
            if (value < current_node.data) {
                if (!current_node.left) {
                    current_node.left = new_node;
                    new_node.parent = current_node;
                    break;
                } else {
                    current_node = current_node.left;
                }
            } else {
                if (!current_node.right) {
                    current_node.right = new_node;
                    new_node.parent = current_node;
                    break;
                } else {
                    current_node = current_node.right;
                }
            }
        }
    }

    remove(value) {
        if (this.isEmpty()) {
            console.log('The Sorted Set is already empty.')
            return;
        }
        
        var current_node = this.root;
        while (current_node) {
            if (value < current_node.data) {
                current_node = current_node.left;
            } else if (value > current_node.data) {
                current_node = current_node.right;
            } else {
                if (!current_node.left && !current_node.right) {
                    current_node = null;
                    break;
                } else if (current_node.left && !current_node.right) {
                    current_node.left.parent = current_node.parent
                    current_node = current_node.left;
                    break;
                } else if (!current_node.left && current_node.right) {
                    current_node.right.parent = current_node.parent;
                    current_node = current_node.right;
                    break;
                } else {
                    
                }
            }
        }
    }

    contains(value) {
        var num = 0;
        var current_node = this.root;

        num = dfs(current_node, value, num);
        if (num == 0) {
            console.log('No');
        }
    }
}

function dfs(node, input_num, count) {
    if (node) {
        if (node.data == input_num) {
            console.log('Yes');
            count++;
        }
        count = dfs(node.left, input_num, count);
        count = dfs(node.right, input_num, count);
        return count;
    }
    return count;
}

function readInfile() {
    var infile = '';
    try {
        infile = fs.readFileSync('infile.dat', 'utf8');
        return infile.replace(/\W/g, '');
    } catch (e) {
        return readInfile();
    }
}

function main() {
    var judge_num = readline_sync.question('Please input the value:');
    var ss = new SortedSet();
    ss.contains(judge_num);
}

main();