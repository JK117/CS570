var readlineSync = require("readline-sync");
var fs = require("fs");

class TrieNode {
    constructor(val, is_end) {
        this.val = val;
        this.children = {};
        this.num_pass = 0;
        this.is_end = is_end;
    }
}

class Trie {
    constructor() {
        this.freq_table = [];
        this.statistics = {};
        this.root = new TrieNode(null, false);
    }

    insert(str) {
        if (str.length == 0) {
            return;
        }
        var current_node = this.root;
        var word = '';
        for (var i = 0; i < str.length; i++) {
            var c = str.charAt(i);
            word += c;
            if (current_node.children[c] != null) {
                current_node = current_node.children[c];
            }
            else {
                if (i == str.length - 1) {
                    var newNode = new TrieNode(word, true);
                }
                else {
                    var newNode = new TrieNode(word, false);
                }
                current_node.children[c] = newNode;
                current_node = current_node.children[c];
            }
        }
    }
    
    getFreqTable(text) {
        this.freq_table = [];
        for (var i = 0; i < text.length; i++) {
            this.freq_table[i] = new Array();
            this.freq_table[i].push(this.root);
        }
        for (var i = 0; i < text.length; i++) {
            for (var j = 0; j < this.freq_table[i].length; j++) {
                if (this.freq_table[i][j].children[text.charAt(i)] != null) {
                    this.freq_table[i][j].children[text.charAt(i)].num_pass++;
                    if (i < text.length - 1) {
                        this.freq_table[i + 1].push(this.freq_table[i][j].children[text.charAt(i)]);
                    }
                }
            }
        }
        this.dfs(this.root);
    }

    
    dfs(node) {
        var prop;
        if (node.is_end == true) {
            this.statistics[node.val] = node.num_pass;
        }
        for (prop in node.children) {
                this.dfs(node.children[prop]);
        }
    }
}

var read = function(companies) {
    var companies_table = {};
    for (var i = 0; i < companies.length; i++) {
        var company_alias = companies[i].split("\t");
        for (var j = 0; j < company_alias.length; j++) {
            var subcompany = company_alias[j].replace(",", "").replace(".", "").trim();
            if (subcompany.indexOf(company_alias[0]) != -1 && subcompany != company_alias[0]) {
                continue;
            }
            else {
                companies_table[subcompany] = company_alias[0];
            }
        }
    }
    return companies_table;
}

var deleteANA = function(sub_article) {
    var sub_article_array = sub_article.split(" ");
    for (var item in sub_article_array) {
        if (sub_article_array[item] === 'a' || sub_article_array[item] === 'an' || sub_article_array[item] === 'the' || sub_article_array[item] === 'and' || sub_article_array[item] === 'or' || sub_article_array[item] === 'but') {
            sub_article_array.splice(item, 1);
        }
    }
    return sub_article_array;
}

var main = function() {

    var input = fs.readFileSync('company.dat', "utf8");
    var companies = input.split("\n");
    var companies_table = {};
    companies_table = read(companies);

    var trie = new Trie();
    var company;
    for (company in companies_table) {
        trie.insert(company);
    }
    
    var article = '';
    var total_words = 0;
    while (true) {
        var sub_article = readlineSync.question('Please enter your article: ');
        if (sub_article == ".") {
            break;
        }
        article = sub_article;
        var sub_article_array = deleteANA(sub_article);
        
        total_words += sub_article_array.length;
    
        trie.getFreqTable(article);
       
        console.log("Company" +"\t\t"+"Hit Count"+"\t"+"Relevance");
    
        var output = {};
        for (var company in trie.statistics) {
            if (trie.statistics[company] != 0) {
                if (output[companies_table[company]] == undefined) {
                    output[companies_table[company]] = trie.statistics[company];
                }
                else {
                    output[companies_table[company]] += trie.statistics[company];
                }
            }
        }
        
        var Total_Hit = 0;
        for (var primary_company in output) {
            Total_Hit += output[primary_company];
            console.log(primary_company + "\t\t" + output[primary_company] + "\t\t" + Math.round(output[primary_company] / total_words * 10000) / 100.00 + "%");
        }
        console.log("Total\t\t" + Total_Hit + "\t\t" + Math.round(Total_Hit / total_words * 10000) / 100.00 + "%");
        console.log("Total words: " + total_words);
    }
}

main();