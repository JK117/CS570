const fs = require('fs');
const prompt = require('prompt-sync')();

class Node {
    constructor(left, right, parent, c, weight) {
        this.left = left;
        this.right = right;
        this.parent = parent;
        if (left) {
            left.parent = this;
        }
        if (right) {
            right.parent = this;
        }
        this.c = c;
        this.weight = weight;
    }
    getPath() {
        var path = '';
        var node = this;
        while (node) {
            var parent = node.parent;
            if (parent) {
                if (node == parent.left) {
                    path = '1' + path;
                }
                if (node == parent.right) {
                    path = '0' + path;
                }
            }
            node = parent;
        }
        return path;
    }
}

function main() {
    // Get input
    var infile = readInfile();

    // Get frequency
    var map = {};
    for (var c of infile) {
        map[c] ? map[c]++ : map[c] = 1;
    }
    var alphabet = [];
    for (var c in map) {
        var node = new Node(null, null, null, c, map[c]);
        alphabet.push(node);
    }
    alphabet.sort((a, b) => {
        if (a.weight == b.weight) {
            return a.c.charCodeAt(0) < b.c.charCodeAt(0) ? -1 : 1;
        }
        return a.weight > b.weight ? -1 : 1;
    });

    // Get huffman codes
    var node_queue = alphabet.slice(0);
    while (node_queue.length > 1) {
        var least_node = node_queue.pop();
        var second_node = node_queue.pop();
        var node = new Node(second_node, least_node, null, least_node.c, least_node.weight + second_node.weight);
        if (node_queue.length == 0) {
            node_queue.push(node);
        } else {
            var added_mark = false;
            for (var i = 0; i < node_queue.length; i++) {
                if (node.weight > node_queue[i].weight) {
                    node_queue.splice(i, 0, node);
                    added_mark = true;
                    break;
                }
            }
            if (!added_mark) {
                node_queue.push(node);
            }
        }
    }

    // write output
    var outfile = 'Symbol  Frequency\n\n';
    var bits = 0;
    for (let node of alphabet) {
        outfile += node.c + ',      ' + getPercent(node.weight, infile.length) + '%\n';
    }
    outfile += '\n';
    for (let node of alphabet) {
        var path = node.getPath();
        outfile += node.c + ',      ' + path + '\n';
        bits += node.weight * path.length;
    }
    outfile += '\nTotal Bits: ' + bits;
    writeOutfile(outfile);
}

function getPercent(weight, length) {
    return (100.0 * weight / length).toFixed(4).padStart(7);
}

function readInfile() {
    var path = prompt('please enter infile path & name (no input as default: infile.dat): ');
    if (!path) {
        path = 'infile.dat';
    }
    var infile = '';
    try {
        infile = fs.readFileSync(path, 'utf8');
        console.log('Successfully read from ' + path);
        return infile.replace(/\W/g, '');
    } catch (e) {
        console.log(e);
        return readInfile();
    }
}

function writeOutfile(outfile) {
    var path = prompt('please enter outfile path & name (no input as default: outfile.dat): ');
    if (!path) {
        path = 'outfile.dat';
    }
    try {
        fs.writeFileSync(path, outfile);
        console.log('Successfully wrote into ' + path);
    } catch (e) {
        console.log(e);
        writeOutfile(outfile);
    }
}

main();