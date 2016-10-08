var GamePiece;
var GameObstacles = [];
var GameScore;

function startGame() {
    GameArea.start();
    GamePiece = new Component(25, 25, "green", 10, 120);
    GameScore = new Component("30px", null, "black", 280, 40, "text");
}

var GameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frame_no = 0;
        this.interval = setInterval(updateGameArea, 20);

        window.addEventListener('keydown', function (e) {
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.keyCode] = true;
        });

        window.addEventListener('keyup', function (e) {
            GameArea.keys[e.keyCode] = false;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

function everyInterval(n) {
    if ((GameArea.frame_no / n) % 1 == 0) {
        return true;
    }
    return false;
}

function Component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speed_x = 0;
    this.speed_y = 0;
    this.x = x;
    this.y = y;

    this.update = function () {
        var canvas_context = GameArea.context;

        if (this.type == "text") {
            canvas_context.font = this.width + " " + this.height;
            canvas_context.fillStyle = color;
            canvas_context.fillText(this.text, this.x, this.y);
        } else {
            canvas_context.fillStyle = color;
            canvas_context.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.newPos = function () {
        this.x += this.speed_x;
        this.y += this.speed_y;
    };

    this.crashWith = function (other_obj) {
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

    var x, y;
    for (var i = 0; i < GameObstacles.length; i++) {

        if (GamePiece.crashWith(GameObstacles[i])) {
            GameArea.stop();
            return;
        }
    }

    GameArea.clear();
    GameArea.frame_no++;

    var min_height;
    var max_height;
    var min_gap;
    var max_gap;
    var gap;
    var height;
    if (GameArea.frame_no == 1 || everyInterval(150)) {
        x = GameArea.canvas.width;
        min_height = 20;
        max_height = 200;

        height = Math.floor(Math.random() * (max_height - min_height + 1) + min_height);
        min_gap = 50;
        max_gap = 150;
        gap = Math.floor(Math.random() * (max_gap - min_gap + 1) + min_gap);

        GameObstacles.push(new Component(10, height, "red", x, 0));
        GameObstacles.push(new Component(10, x - height - gap, "red", x, height + gap));
    }

    for (i = 0; i < GameObstacles.length; i += 1) {
        GameObstacles[i].x += -1;
        GameObstacles[i].update();
    }

    // Movements
    GamePiece.speed_x = 0;
    GamePiece.speed_y = 0;
    if (GameArea.keys && GameArea.keys[37]) {
        GamePiece.speed_x = -2;
    }
    if (GameArea.keys && GameArea.keys[39]) {
        GamePiece.speed_x = 2;
    }
    if (GameArea.keys && GameArea.keys[38]) {
        GamePiece.speed_y = -2;
    }
    if (GameArea.keys && GameArea.keys[40]) {
        GamePiece.speed_y = 2;
    }

    GameScore.text = "SCORE: " + GameArea.frame_no;
    GameScore.update();
    GamePiece.newPos();
    GamePiece.update();
}
