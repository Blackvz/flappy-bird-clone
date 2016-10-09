var GamePiece;
var GameObstacles = [];
var GameScore;
var GameOverSound;
var GameBackgroundMusic;

function startGame() {
    GameArea.start();
    GamePiece = new Component(30, 30, "assets/images/player_bird.png", 10, 120, "image");
    GameScore = new Component("30px", null, "black", 280, 40, "text");
    GameOverSound = new Sound("assets/sounds/game_over.ogg", false);
    GameBackgroundMusic = new Sound("assets/sounds/background_music.ogg", true);
    GameBackgroundMusic.play();
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

        window.addEventListener("keydown", function (e) {
            GameArea.keys = (GameArea.keys || []);
            GameArea.keys[e.keyCode] = true;
        });

        window.addEventListener("keyup", function (e) {
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

/**
 * @param {int} n
 * @returns {boolean}
 */
function everyInterval(n) {
    if ((GameArea.frame_no / n) % 1 == 0) {
        return true;
    }
    return false;
}

/**
 *
 * @param {string|int} width
 * @param {string|int} height
 * @param {string} color
 * @param {int} x
 * @param {int} y
 * @param {string} type
 * @constructor
 */
function Component(width, height, color, x, y, type) {
    this.type = type;

    if (this.type == "image") {
        this.image = new Image();
        this.image.src = color;
    }

    this.width = width;
    this.height = height;
    this.speed_x = 0;
    this.speed_y = 0;
    this.gravity = 0.05;
    this.gravity_speed = 0;
    this.x = x;
    this.y = y;

    this.update = function () {
        var canvas_context = GameArea.context;

        if (this.type == "text") {
            canvas_context.font = this.width + " " + this.height;
            canvas_context.fillStyle = color;
            canvas_context.fillText(this.text, this.x, this.y);
        }
        else if (this.type == "image") {
            canvas_context.drawImage(
                this.image,
                this.x,
                this.y,
                this.width, this.height);
        }
        else {
            canvas_context.fillStyle = color;
            canvas_context.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    this.newPos = function () {
        this.gravity_speed += this.gravity;
        this.x += this.speed_x;
        this.y += (this.speed_y + this.gravity_speed);
        this.hitBottom();
    };

    this.hitBottom = function() {
        var canvas_bottom = GameArea.canvas.height - this.height;

        if (this.y > canvas_bottom) {
            this.y = canvas_bottom;
        }
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

function jump(n) {
    GamePiece.gravity = n;
}

function updateGameArea() {

    for (var i = 0; i < GameObstacles.length; i++) {

        if (GamePiece.crashWith(GameObstacles[i])) {
            GameBackgroundMusic.stop();
            GameOverSound.play();
            GameArea.stop();
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
    var x;
    if (GameArea.frame_no == 1 || everyInterval(150)) {
        x = GameArea.canvas.width;
        min_height = 20;
        max_height = 200;

        height = Math.floor(Math.random() * (max_height - min_height + 1) + min_height);
        min_gap = 50;
        max_gap = 150;
        gap = Math.floor(Math.random() * (max_gap - min_gap + 1) + min_gap);

        GameObstacles.push(new Component(10, height, "red", x, 0, "obstacle"));
        GameObstacles.push(new Component(10, x - height - gap, "red", x, height + gap, "obstacle"));
    }

    for (i = 0; i < GameObstacles.length; i++) {
        GameObstacles[i].x -= 1;
        GameObstacles[i].update();
    }

    clearMovement();
    move(GameArea.keys);

    GameScore.text = "SCORE: " + GameArea.frame_no;
    GameScore.update();
    GamePiece.newPos();
    GamePiece.update();
}

function clearMovement() {
    GamePiece.image.src = "assets/images/player_bird.png";

    GamePiece.speed_x = 0;
    GamePiece.speed_y = 0;
    GamePiece.gravity = 0.05;
}

function debugGame() {
    console.log(
        "Player xpos: " + GamePiece.speed_x + "\n"
        + "Player ypos: " + GamePiece.speed_y + "\n"
        + "Player gravity: " + GamePiece.gravity + "\n"
        + "Player gravity_speed: " + GamePiece.gravity_speed + "\n"
    );
}

/**
 * @param {array} keys
 */
function move(keys) {

    if (keys && keys[32]) {
        jump(-0.2);
        GamePiece.image.src = "assets/images/bird_player_up.png";
    }
}

/**
 *
 * @param {string} src
 * @param {boolean} loop
 * @constructor
 */
function Sound(src, loop) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    if (loop) {
        this.sound.loop = true;
    }
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function() {
        this.sound.play();
    };

    this.stop = function() {
        this.sound.pause();
    };
}
