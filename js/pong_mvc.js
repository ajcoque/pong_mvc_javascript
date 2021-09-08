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
            elements.push(this.ball);
            return elements;
        }
    }

})();

//Metodo que permite construir la bola
(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 3;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;

        board.ball = this;
        this.kind = "circle";

    }

    self.Ball.prototype = {
        //Se agrega funcion para que la bola se mueva
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
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
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.board.ball.move();
            }
        }
    }

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
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
var ball = new Ball(400, 150, 15, board);


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
    } else if (ev.keyCode == 32) {
        ev.preventDefault();
        board.playing = !board.playing;
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
