import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // state is private to a component that defines it. You cannot update the Board’s state directly from Square
  // you’ll pass down a function from the Board component to the Square component, 
  // and you’ll have Square call that function when a square is clicked. 
  function handleClick(i) {
    // check to see if the square already has a X or an O or if a player has already won
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    // creates a copy of the squares array
    const nextSquares = squares.slice();
    // updates the nextSquares array to add X or O to the i index square.
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      <button className='reload' onClick={() => restart()}>Play again</button>
    </>
  );
}

export default function Game() {
  // [Array(9).fill(null)] is an array with a single item, which itself is an array of 9 nulls.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // keep track of which step the user is currently viewing
  const [currentMove, setCurrentMove] = useState(0);
  // true when currentMove is even:
  const xIsNext = currentMove % 2 === 0;
  // read the last squares array 
  // const currentSquares = history[history.length - 1];
  // render the currently selected move, instead of always rendering the final move:
  const currentSquares = history[currentMove];

  // will be called by the Board component(with the updated squares array when a player makes a move) to update the game
  function handlePlay(nextSquares) {
    // If you “go back in time” and then make a new move from that point, you only want to keep the history up to that point. 
    // Instead of adding nextSquares after all items (... spread syntax) in history, you’ll add it after 
    // all items in history.slice(0, currentMove + 1) so that you’re only keeping that portion of the old history.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // update history by appending the updated squares array as a new history entry. 
    // Creates a new array that contains all the items in history, followed by nextSquares. 
    // You can read the ...history spread syntax as “enumerate all the items in history”.)
    // setHistory([...history, nextSquares]);
    setHistory(nextHistory);
    // update currentMove to point to the latest history entry.
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Transform your history of moves into React elements representing buttons and display a list of buttons to “jump” to past moves
 // squares = each element of history
 // move = each array index
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function restart() {
  window.location.reload(false);
}