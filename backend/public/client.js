var board;
var game;

window.onload = function () {
    initGame();
};



var initGame = function() {

  var cfg = {
    draggable: true,
    position: 'start',
    sparePieces: true,
    onDragStart: onDragStart,
    onDrop: handleMove,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
   };
   board = new ChessBoard('myBoard', cfg);
   game = new Chess();
  
};

var handleMove = function(source, target ) {
    var move = game.move({from: source, to: target});
    if (move === null)  return 'snapback';
};

// var socket = io();
 
  window.onclick = function(e) {
      socket.emit('message', 'I am client');
  };

  var handleMove = function(source, target) {
    var move = game.move({from: source, to: target});
    
    if (move === null)  return 'snapback';
   // else socket.emit('move', move);


   /////saurav
   else socket.emit('chessMove', {
    from: source,
    to: target

   });


    
};


socket.on('move', function (msg) {
    game.move(msg);
    board.position(game.fen()); 
});


var board = null
var game = new Chess()
var whiteSquareGrey = '#a9a9a9'
var blackSquareGrey = '#696969'

function removeGreySquares () {
  $('#myBoard .square-55d63').css('background', '')
}

function greySquare (square) {
  var $square = $('#myBoard .square-' + square)

  var background = whiteSquareGrey
  if ($square.hasClass('black-3c85d')) {
    background = blackSquareGrey
  }

  $square.css('background', background)
}

function onDragStart (source, piece) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // or if it's not that side's turn
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function onDrop (source, target) {
  removeGreySquares()

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'
}

function onMouseoverSquare (square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  })

  // exit if there are no moves available for this square
  if (moves.length === 0) return

  // highlight the square they moused over
  greySquare(square)

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to)
  }
}

function onMouseoutSquare (square, piece) {
  removeGreySquares()
}

function onSnapEnd () {
  board.position(game.fen())
}







/////////////////experiment




socket.on('setOrientationOppnt', (requestData) => {
  console.log("oooooooooooooo"+ requestData);
  console.log(requestData)
  if(requestData.color=="white"){
    cfg.orientation= 'black'
  }else{
    cfg.orientation= 'white'
  }

   
  
  
});

socket.on('oppntChessMove', (requestData) => {
  console.log(requestData);
  // let color = requestData.color;
  let source = requestData.from;
  let target = requestData.to;
  let promo = requestData.promo||'';


  // chess.move({from:source,to:target,promotion:promo});
  // board.position(chess.fen());
  //chess.move(target);
  //chess.setFenPosition();

});

