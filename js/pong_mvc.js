//Modelo

/*funcion anonima que se llama a si misma para crear el tablero y sus elementos*/
(function () {

    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements() {
            var elements = this.bars.map(function (bar) { return bar; });
            //elements.push(this.ball);
            return elements;
        }
    }

})();

//Vista

(function () {
    self.Bar = function (x, y, width, heigth, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = heigth;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }

    self.Bar.prototype = {
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

/*funcion anonima que se llama a si misma para mostrar el tablero con sus respectivas medidas*/
(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    },
    
    self.BoardView.prototype = {

        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },

        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];
                draw(this.ctx, el);
            };
        }
    }

    function draw(ctx, element) {

        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
        }
    }
})();


//Controlador
/*funcion que permite llamar a otras funciones para mostrar los elementos en el html*/
self.addEventListener("load", main);

function main() {
    var board = new Board(800, 400);
    var bar = new Bar(20,150,40,100,board);
    var bar_2 = new Bar(735, 150, 40, 100, board);
    var canvas = document.getElementById('canvas');
    var board_view = new BoardView(canvas, board);
    board_view.draw();
}
