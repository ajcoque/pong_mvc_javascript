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

/**Se agrega la funcion anonima que permite construir las barras */
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
    //Se agregan los metodos que permitiran mover las barras
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
    }

    //Se agregan las funciones que permitiran agregar las barras al tablero sin que se dupliquen
    self.BoardView.prototype = {

        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },

        draw: function () {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];
                draw(this.ctx, el);
            };
        },
        play: function () {
            this.clean();
            this.draw();
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

//Se sacan las instancias del metodo controller
var board = new Board(800, 400);
var bar = new Bar(20, 150, 40, 100, board);
var bar_2 = new Bar(735, 150, 40, 100, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);


/**Condicionales que nos permitiran tocar decisiones de acuerdo a la tecla que se presione:
 * Para la barra izquierda se tendran la tecla w y s.
 * Para la barra derecha se tendran las fechan arriba y abajo.
 */
document.addEventListener("keydown", function (ev) {

    if (ev.keyCode == 87) {
        ev.preventDefault();
        bar.up();
    } else if (ev.keyCode == 83) {
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode == 38) {
        ev.preventDefault();
        bar_2.up();
    } else if (ev.keyCode == 40) {
        ev.preventDefault();
        bar_2.down();
    }
});

board_view.draw();


//controlador
/*funcion que permite llamar a otras funciones para mostrar los elementos en el html*/
self.requestAnimationFrame(controller);
function controller() {
    board_view.play();
    self.requestAnimationFrame(controller);
}
