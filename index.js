var GamePiece;
var GameObstacle;

function startGame() {
    GameArea.start();
    GamePiece = new Component(25, 25, "green", 10, 120);
    GameObstacle = new Component(10, 200, "red", 300, 120);
}

var GameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function(e) {
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', function(e) {
            GameArea.keys[e.keyCode] = false;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }
};

function Component(width, height, color, x, y) {
    this.gamearea = GameArea;
    this.width = width;
    this.height = height;
    this.speed_x = 0;
    this.speed_y = 0;
    this.x = x;
    this.y = y;

    this.update = function() {
        var canvas_context = GameArea.context;
        canvas_context.fillStyle = color;
        canvas_context.fillRect(this.x, this.y, this.width, this.height);
    };

    this.newPos = function() {
        this.x += this.speed_x;
        this.y += this.speed_y;
    };

    this.crashWith = function(other_obj) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);

        var other_left = other_obj.x;
        var other_right = other_obj.x + (other_obj.width);
        var other_top = other_obj.y;
        var other_bottom = other_obj.y + (other_obj.height);

        var crash = true;

        if (
            (bottom < other_top) ||
            (top > other_bottom) ||
            (right < other_left) ||
            (left > other_right)) {
            crash = false;
        }

        return crash;

    }
}

function updateGameArea() {

    if (GamePiece.crashWith(GameObstacle)) {
        GameArea.stop();
    }

    GameArea.clear();

    // Movements
    GamePiece.speed_x = 0;
    GamePiece.speed_y = 0;
    if (GameArea.keys && GameArea.keys[37]) {GamePiece.speed_x = -2; }
    if (GameArea.keys && GameArea.keys[39]) {GamePiece.speed_x = 2; }
    if (GameArea.keys && GameArea.keys[38]) {GamePiece.speed_y = -2; }
    if (GameArea.keys && GameArea.keys[40]) {GamePiece.speed_y = 2; }

    GamePiece.newPos();
    GamePiece.update();
    GameObstacle.update();
}
