import { useState } from 'react';

export default function Board() {
  // set the first move to be “X” by default
  const [xIsNext, setXIsNext] = useState(true);
  // To collect data from multiple children, or to have two child components communicate with each other,
  // declare and store the game’s state in the parent Board component instead of in each Square. 
  // The parent component can pass that state back down to the children via props. 
  // This keeps the child components in sync with each other and with their parent.
  // squares: a state variable that defaults to an array of 9 nulls corresponding to the 9 squares
  const [squares, setSquares] = useState(Array(9).fill(null));

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
    // Calling the setSquares function lets React know the state of the component has changed. 
    // This will trigger a re-render of the components that use the squares state (Board) 
    // as well as its child components (the Square components that make up the board).
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  function restart() {
    window.location.reload(false);
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

// ------------------------------------ FUNCTIONS ------------------------------------ //

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
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

