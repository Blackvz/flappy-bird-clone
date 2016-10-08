var GamePiece;

function startGame() {
    GameArea.start();
    GamePiece = new Component(25, 25, "green", 10, 120);
}

var GameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};

function Component(width, height, color, x, y) {
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
    }
}

function updateGameArea() {
    GameArea.clear();
    GamePiece.newPos();
    GamePiece.update();
}

function moveUp() {
    GamePiece.speed_y -= 1;
}

function moveDown() {
    GamePiece.speed_y += 1;
}

function moveRight() {
    GamePiece.speed_x += 1;
}

function moveLeft() {
    GamePiece.speed_x -= 1;
}

function stopMove() {
    GamePiece.speed_x = 0;
    GamePiece.speed_y = 0;
}