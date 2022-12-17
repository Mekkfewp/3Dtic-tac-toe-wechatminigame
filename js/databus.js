
let instance

class OneMove
{
  board = 1;
  row = 0;
  column = 0;
}


var config = [
  //Rows on single board
  [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']], 
  [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']], 
  [['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']], 
];

var humanPiece = 'X';
var computerPiece = 'O';

var win = false
var lookAheadCounter = 0
var totalLooksAhead = 5


export default class DataBus {
  constructor() {
    if (instance) return instance

    instance = this
  }


  reset() {
    this.frame = 0
    this.score = 0
    this.animations = []
    this.gameOver = false
		this.finalWin = []
		config = [
			[['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']], 
			[['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']], 
			[['-', '-', '-'], ['-', '-', '-'], ['-', '-', '-']], 
		];
		win = false
  }

  getResult(t,x,y){
    if (config) return config[t-1][x][y]
    return '-';
	}
	
   /**
   * 检查获胜解的数量
   */
  checkAvailable(c){
		var winCounter = 0;

		var wins = [
				//Rows on single board
				[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20],
				[21, 22, 23], [24, 25, 26],

				//Columns on single board
				[0, 3, 6], [1, 4, 7], [2, 5, 8], [9, 12, 15], [10, 13, 16], [11, 14, 17], [18, 21, 24],
				[19, 22, 25], [20, 23, 26],

				//Diagonals on single board
				[0, 4, 8], [2, 4, 6], [9, 13, 17], [11, 13, 15],
				[18, 22, 26], [20, 22, 24],

				//Straight down through boards
				[0, 9, 18], [1, 10, 19], [2, 11, 20], [3, 12, 21], [4, 13, 22], [5, 14, 23], [6, 15, 24],
				[7, 16, 25], [8, 17, 26],

				//Diagonals through boards
				[0, 12, 24], [1, 13, 25], [2, 14, 26], [6, 12, 18], [7, 13, 19], [8, 14, 20], [0, 10, 20],
				[3, 13, 23], [6, 16, 26],[2, 10, 18], [5, 13, 21], [8, 16, 24], [0, 13, 26], [2, 13, 24],
				[6, 13, 20], [8, 13, 18],
    ];

		//Array that indicates all the spaces on the game board
		var gameBoard = [];

		var counter = 0;


		for (let i = 0; i <= 2; i++)
		{
			for (let j = 0; j <= 2; j++)
			{
				for(let k = 0; k <= 2; k++)
				{
					if(config[i][j][k] == c || config[i][j][k] == '-')
						gameBoard[counter] = 1;
					else
						gameBoard[counter] = 0;

					counter++;
				}
			}
		}

		//For each possible win combination
		for (let i = 0; i <= 48; i++)
		{
			//Resetting counter to see if all 3 locations have been used
			counter = 0;
			for (let j = 0; j <= 2; j++)
			{
				//For each individual winning space in the current combination
				if(gameBoard[wins[i][j]] == 1)
				{
					counter++;

					this.finalWin[j] = wins[i][j];
					//If all 3 moves of the current winning combination are occupied by char c
					if(counter == 3)
						winCounter++;
				}
			}
		}
		return winCounter;
	}

  heuristic(){
    return (this.checkAvailable(computerPiece) - this.checkAvailable(humanPiece));
  }

  lookAhead(c, a, b){
		var alpha = a;
		var beta = b;

		if(lookAheadCounter <= totalLooksAhead)
		{

			lookAheadCounter++;
			//放COM的
			if(c == computerPiece)
			{
				var hValue;

				for (let i = 0; i <= 2; i++)
				{
					for (let j = 0; j <= 2; j++)
					{
						for(let k = 0; k <= 2; k++)
						{
							if(config[i][j][k] == '-')
							{
								var nextMove = new OneMove();
								nextMove.board = i;
								nextMove.row = j;
								nextMove.column = k;

								if(this.checkWin(computerPiece, nextMove))
								{
									config[i][j][k] = '-';
									return 1000;
								}
								else
								{
									hValue = this.lookAhead(humanPiece, alpha, beta);
									if(hValue > alpha)
									{
										alpha = hValue;
										config[i][j][k] = '-';
									}
									else
									{
										config[i][j][k] = '-';
									}
								}

								if (alpha >= beta)
									break;
							}
						}
					}
				}

				return alpha;
			}

			//放玩家的
			else
			{
				var hValue;

				for (let i = 0; i <= 2; i++)
				{
					for (let j = 0; j <= 2; j++)
					{
						for(let k = 0; k <= 2; k++)
						{
							if(config[i][j][k] == '-')
							{

								var nextMove = new OneMove();
								nextMove.board = i;
								nextMove.row = j;
								nextMove.column = k;

								if(this.checkWin(humanPiece, nextMove))
								{
									config[i][j][k] = '-';
									return -1000;
								}
								else
								{
									hValue = this.lookAhead(computerPiece, alpha, beta);
									if(hValue < beta)
									{
										beta = hValue;
										config[i][j][k] = '-';
									}
									else
									{
										config[i][j][k] = '-';
									}
								}

								//查找结束
								if (alpha >= beta)
									break;
							}
						}
					}
				}

				return beta;
			}
		}
		//最后一层还是没找到
		else
		{
			return this.heuristic();
		}
  }
  
  /**
   * 检查是否获胜
   */
  checkWin(c, pos){
		config[pos.board][pos.row][pos.column] = c;
		//Win table
		var wins = [
				//Rows on single board
				//Rows on single board
				[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20],
				[21, 22, 23], [24, 25, 26],

				//Columns on single board
				[0, 3, 6], [1, 4, 7], [2, 5, 8], [9, 12, 15], [10, 13, 16], [11, 14, 17], [18, 21, 24],
				[19, 22, 25], [20, 23, 26],

				//Diagonals on single board
				[0, 4, 8], [2, 4, 6], [9, 13, 17], [11, 13, 15],
				[18, 22, 26], [20, 22, 24],

				//Straight down through boards
				[0, 9, 18], [1, 10, 19], [2, 11, 20], [3, 12, 21], [4, 13, 22], [5, 14, 23], [6, 15, 24],
				[7, 16, 25], [8, 17, 26],

				//Diagonals through boards
				[0, 12, 24], [1, 13, 25], [2, 14, 26], [6, 12, 18], [7, 13, 19], [8, 14, 20], [0, 10, 20],
				[3, 13, 23], [6, 16, 26],[2, 10, 18], [5, 13, 21], [8, 16, 24], [0, 13, 26], [2, 13, 24],
				[6, 13, 20], [8, 13, 18],
    ];

		//Array that indicates all the spaces on the game board
		var gameBoard = [];

		var counter = 0;

		//If the space on the board is the same as the input char, set the corresponding location
		//in gameBoard to 1.
		for (let i = 0; i <= 2; i++)
		{
			for (let j = 0; j <= 2; j++)
			{
				for(let k = 0; k <= 2; k++)
				{
					if(config[i][j][k] == c)
					{
						gameBoard[counter] = 1;
					}
					else
					{
						gameBoard[counter] = 0;
					}
					counter++;
				}
			}
		}

		//所有胜利组合
		for (let i = 0; i <= 48; i++)
		{
			//Resetting counter to see if all 3 locations have been used
			counter = 0;
			for (let j = 0; j <= 2; j++)
			{
				//For each individual winning space in the current combination
				if(gameBoard[wins[i][j]] == 1)
				{
					counter++;

					this.finalWin[j] = wins[i][j];
					//If all 3 moves of the current winning combination are occupied by char c
					if(counter == 3)
					{
            return true;
					}
				}
			}
		}
		return false;
	}
   /**
   * COM回合
   */
  computerPlays(){
    var bestScore;
    var hValue;
    var bestScoreBoard = -1;
    var bestScoreRow = -1;
    var bestScoreColumn = -1;

    bestScore = -1000;
    check:
    for (let i = 0; i <= 2; i++)
    {
      for (let j = 0; j <= 2; j++)
      {
        for(let k = 0; k <= 2; k++)
        {
          if(config[i][j][k] == '-')
          {
            //遍历所有空格
            var nextMove = new OneMove();
            nextMove.board = i;
            nextMove.row = j;
						nextMove.column = k;

            //是否符合胜利条件的
            if(this.checkWin(computerPiece, nextMove))
            {
							config[i][j][k] = computerPiece;
							console.log('COM WIN',config);
							win = true;
							this.gameOver = true
              break check;
            }
            else
            {
							hValue = this.lookAhead(humanPiece, -1000, 1000);
              lookAheadCounter = 0;
              //选择里面的最大值
              if(hValue >= bestScore)
              {
                bestScore = hValue;
                bestScoreBoard = i;
                bestScoreRow = j;
                bestScoreColumn = k;
                config[i][j][k] = '-';
              }
              else
              {
                config[i][j][k] = '-';
              }
            }
          }
        }
      }
    }

    if(!win)
    {
      config[bestScoreBoard][bestScoreRow][bestScoreColumn] = computerPiece;
			
      console.log('COM result----',config,bestScoreBoard,bestScoreRow,bestScoreColumn);

    }
  }
   /**
   * 玩家回合
   */
  humanPlays(t, x,y){
		config[t-1][x][y] = humanPiece;
		var newMove = new OneMove();
		newMove.board = t-1;
		newMove.row = x;
    newMove.column = y;
		if(this.checkWin(humanPiece, newMove))
		{
      
			// status.setText("You beat me! Press New Game to play again.");
			// status.setForeground(Color.RED);
			// humanScore++;
			win = true;
			
			this.gameOver = true
			this.score = 10

		}
		else
		{
			this.computerPlays();
		}
	}
  

}
