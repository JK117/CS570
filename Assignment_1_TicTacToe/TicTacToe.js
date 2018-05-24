// Assignment 1 Tic-Tac-Toe

const file_stream = require('fs');
const readline_sync = require('readline-sync');
const players_order = 'OXABCDEFGHIJLLMNPQRSTUVWYZ';


var Game = function(chess_board, chess_players, win_sequence)
{
    this.start_num = 1;
    this.total_step = chess_board * chess_board;
    this.win_sequence = win_sequence;
    this.judgeAdd = 1; // 1: Successful in adding; 0:Unsuccessful in adding
    var stop = 0;// Q: Quit
    // Generate the 2-D array
    this.board = new Array();
    for(var i = 0 ; i < chess_board ; i++)
    {
        this.board[i] = new Array();
        for(var j = 0 ; j < chess_board ; j++)
        {
            this.board[i][j] = ' ';
        }
    }

    //Check for winning condition
    this.checkWin = function (input_array, x, y, win_seq, player) {
        var row_mark = 1;
        var col_mark = 1;
        var dia_mark1 = 1;
        var dia_mark2 = 1;
        console.log('Player ' + player + ': (' + x + ', ' + y + ')');

        var checkRow = function () {
            var marker = y - 1;
            while ((marker >= 0) && (input_array[x][marker] == player)) {
                row_mark += 1;
                marker -= 1;
            }
            marker = y + 1;
            while ((marker < chess_board) && (input_array[x][marker] == player)) {
                row_mark += 1;
                marker += 1;
            }
            if (row_mark >= win_seq) {
                return true;
            } else {
                return false;
            }
        }

        var checkCol = function () {
            var marker = x - 1;
            while ((marker >= 0) && (input_array[marker][y] == player)) {
                col_mark += 1;
                marker -= 1;
            }
            marker = x + 1;
            while ((marker < chess_board) && (input_array[marker][y] == player)) {
                col_mark += 1;
                marker += 1;
            }
            if (col_mark >= win_seq) {
                return true;
            } else {
                return false;
            }
        }

        var checkDia1 = function () {
            var marker1 = x - 1;
            var marker2 = y - 1;
            while ((marker1 >= 0) && (marker2 >= 0) && (input_array[marker1][marker2] == player)) {
                dia_mark1 += 1;
                marker1 -= 1;
                marker2 -= 1;
            }
            marker1 = x + 1;
            marker2 = y + 1;
            while ((marker1 < chess_board) && (marker2 < chess_board) && (input_array[marker1][marker2] == player)) {
                dia_mark1 += 1;
                marker1 += 1;
                marker2 += 1;
            }
            if (dia_mark1 >= win_seq) {
                return true;
            } else {
                return false;
            }
        }

        var checkDia2 = function () {
            var marker1 = x - 1;
            var marker2 = y + 1;
            while ((marker1 >= 0) && (marker2 < chess_board) && (input_array[marker1][marker2] == player)) {
                dia_mark2 += 1;
                marker1 -= 1;
                marker2 += 1;
            }
            marker1 = x + 1;
            marker2 = y - 1;
            while ((marker1 < chess_board) && (marker2 >= 0) && (input_array[marker1][marker2] == player)) {
                dia_mark2 += 1;
                marker1 += 1;
                marker2 -= 1;
            }
            if (dia_mark2 >= win_seq) {
                return true;
            } else {
                return false;
            }
        }
        
        return (checkRow() || checkCol() || checkDia1() || checkDia2());
    }

    this.addChessStep = function(playernum)
    {
        //cin
        this.judgeAdd = 1;
        var cini = readline_sync.question("Please input row number: ");
        if (cini == 'Q' || cini == 'q')
        {
            this.stop = 1;
            return;
        }
        else if(cini == 'S' || cini == 's')
        {
            var save_address = readline_sync.question('Please input the name of saved file:');
            this.gameSave(save_address);
            this.stop = 1;
            return;
        }
        var cinj = readline_sync.question("Please input column number: ");
        if (cinj == 'Q' || cinj == 'q')
        {
            this.stop = 1;
            return;
        }   
        var temp_input_i = cini - 1, temp_input_j = cinj - 1;
        if(this.board[temp_input_i][temp_input_j] != ' ')
        {
            console.log("This place is occupied!");
            this.judgeAdd = 0;
        }
        else
        {
            this.board[temp_input_i][temp_input_j] = players_order[playernum - 1];
            var checkWinNum = this.checkWin(this.board, temp_input_i, temp_input_j, this.win_sequence, players_order[playernum - 1]);
            if(checkWinNum == true)
            {
                this.generateOutput();
                console.log('Player ' + players_order[playernum - 1] + ' Wins! Game over.');
                this.stop = 1;
                return;
            }
        }
    }

    // Generate output formation - Finished
    this.generateOutput = function()
    {
        // Generate the cut line of the format
        var cut_line = ' ';
        let count = 0
        for (; count < chess_board - 1; count++) {
            cut_line += '---+';
        }
        cut_line += '---';

        // Output the first line of the board format
        var output_head = '';
        for (let i = 0; i < chess_board; i++) {
            output_head += '  ' + ((i + 1) + '') + ' ';
        }
        console.log(output_head);
        
        // Output the following lines of the format
        for (let j = 0; j < chess_board; j++) {
            var output_line = (j + 1) + '';
            let k = 0;
            for (; k < chess_board - 1; k++) {
                output_line += ' ' + this.board[j][k] + ' |';
            }
            output_line += ' ' + this.board[j][k] + ' ';
            console.log(output_line);
            if (j < chess_board - 1) {
                console.log(cut_line);
            }
        }
    }

    this.runGame = function(chess_players)
    {
        var step = 1;
        step = this.start_num;
        for(; step <= this.total_step ;)
        {
            var playernum = step % chess_players;
            if(playernum == 0)
            {
                playernum += chess_players;
            }    
            this.addChessStep(playernum);
            if(this.stop == 1)
            {return;}
            if (this.judgeAdd != 0)
            {
                step++;
            }
            this.generateOutput();
        }
        console.log("tie");
    }

    this.gameSave = function(save_address)
    {
        var output = "";
        output += chess_players + "$$" + chess_board + "$$" + this.win_sequence + "$$" + this.start_num + "%";
        for(var i = 0 ; i < chess_board ; i++)
        {
            for(var j = 0 ; j < chess_board ; j++)
            {
                output += this.board[i][j];
            }
        }
        output += '%' ;
        file_stream.writeFileSync( save_address , output, {encoding: 'utf-8'});
    }
}

var startNewGame = function () {
    var chess_players = readline_sync.question('Please input the number of players:');
    if (1 <= chess_players && chess_players <= 26) {
        var chess_board = readline_sync.question('Please input the number of board:');
        if (1 <= chess_board && chess_board <= 999) {
            var win_sequence = readline_sync.question('Please input the number of winning sequence:');
            if (1 <= win_sequence && win_sequence <= chess_board) {
                if ( (chess_players * (win_sequence - 1)) < (chess_board * chess_board)) {
                    //启动
                    var GAME = new Game(chess_board, chess_players, win_sequence);
                    GAME.generateOutput();
                    GAME.runGame(chess_players);
                    //循环调用addChessStep到赢
                }
            }
            else {
                console.log("wining sequence count should be 1 ~ board number");
            }
        }
        else {
            console.log( "board number must be 1~999" );
        }
    }
    else {
        console.log("players number must be 1~26");
    }
}

var loadGame = function()
{
    var chess_address = readline_sync.question('Please input the name of the saved chess:');
    var part1_player="" , index1 , part2_board="" , index2 , part3_winseq="" , index3 , part4_startNum="" , index4;
    var input_load_game = file_stream.readFileSync(chess_address, {encoding: 'utf-8'});
    var index_array = new Array();
    this.board = new Array();
    index1 = input_load_game.indexOf("$$");
    for (var i = 0 ; i < index1 ; i++)
    {
        part1_player += input_load_game[i]; // chess_player
    }
    index2 = input_load_game.indexOf("$$" , (index1 + 2));
    for (var i = (index1+2) ; i < index2 ; i++)
    {
        part2_board += input_load_game[i]; // chess_board
    }
    index3 = input_load_game.indexOf("$$" , (index2 + 2));
    for (var i = (index2+2) ; i < index3 ; i++)
    {
        part3_winseq += input_load_game[i]; // chess_winsequence
    }
    index4 = input_load_game.indexOf("$$" , (index3 + 2));
    for (var i = (index3+2) ; i < index4 ; i++)
    {
        part4_startNum += input_load_game[i]; // chess_board
    }
    index_array = input_load_game.indexOf("%");
    var index_arrayEnd = input_load_game.indexOf("%",index_array);
    var inputSave = "$";
    console.log(input_load_game[index_array+1]);
    for (var t = (index_array + 1); t < index_arrayEnd ; t++)
    {
        var tempshenjingbing = input_load_game[t];// 神经病！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！这里不能搞
        console.log(tempshenjingbing);
        inputSave += tempshenjingbing;
    }
    console.log(inputSave);
    for(var i = 0 ; i < part2_board ; i++)
    {
        this.board[i] = new Array();
        for(var j = 0 ; j < part2_board ; j++)
        {
            this.board[i][j] = input_load_game[ i * (j - 1) + j];
        }
    }
    var playerL = parseInt(part1_player);
    var boardL = parseInt(part2_board);
    var win_sequenceL = parseInt(part3_winseq);
    var start_numL = parseInt(part4_startNum);
    console.log(part1_player);
    console.log(boardL);
    console.log(win_sequenceL);
    console.log(start_numL);
    console.log(this.board[0][0]);
    var GAMEL = new Game(player, boardL, win_sequenceL);//字符转数字
    console.log(GAMEL.board[0][0]);

    for(var i = 0 ; i < boardL ; i++)
    {
        //this.board[i] = new Array();
        for(var j = 0 ; j < boardL ; j++)
        {
            GAMEL.Array[i][j] = this.board[i][j] ;
        }
    }
    GAMEL.start_num = start_numL;
    console.log(GAMEL.start_num);
    GAMEL.runGame(playerL);
    
}

var newOrLoad_game = readline_sync.question('Do you want a new game? Y/N');//-----------
if( newOrLoad_game == 'Y' || newOrLoad_game == 'y')
{
    startNewGame();
}
else if( newOrLoad_game == 'N' || newOrLoad_game == 'n')
{
    loadGame();

}
else if( newOrLoad_game == 'Q' || newOrLoad_game == 'q')
{
    console.log("exit game!")
    return;
}
//加个判断



