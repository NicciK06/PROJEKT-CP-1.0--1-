

const PLAYER_MOVE_SPEED = 500;    //    SCREEN_EDGE, which provides a margin before the player gets right to the edge of the screen, and
                                  //PLAYER_MOVE_SPEED, which is the speed at which the player moves.
const SCREEN_EDGE = 100;
const ALIEN_SPEED = 60;  //alien movement constants
const ALIEN_STEPS = 700;
var Aliens_Rows_Move = 5;
const GUN_COOLDOWN_TIME = 1;   //cooldown timer
const BULLET_SPEED = 400;      //bullet speed
const POINTS_PER_ALIEN = 100;  //collision bullets -> aliens



kaboom();

loadSound("gameComplete", "sprites/gameCompletedsound.mp3") 
loadSound("gameoverSound", "sprites/gameOversound.mp3" )
loadSound("planeExplosion", "sprites/planeExplosion.mp3")
loadSound("AlienExplosion", "sprites/explosionAliens.mp3")
loadSound("GUNsoundEffect", "sprites/gun.mp3") 
loadSound("music", "sprites/music.mp3") //our TopGun music via the sprites
loadRoot("sprites/");                  //We need to describe how to use each of the images in the sprite sheets.
loadSpriteAtlas("alien-sprite.png", {  //alien.png = drones
    alien: {
        x: 0,
        y: 0,
        width: 450,
        height: 50,
        sliceX: 7,
        sliceY: 1,
        anims: {
            fly: { from: 0, to: 4, speed: 4, loop: true },
            explode: { from: 5, to: 6, speed: 8, loop: true },
        },
    },
});


loadSpriteAtlas("player-sprite.png", {   //player.png = the airplane
    player: {
        x: 0,
        y: 0,
        width: 180,
        height: 60,
        sliceX: 3,
        sliceY: 1,
        anims: {
            move: { from: 0, to: 0, speed: 4, loop: false },
            explode: { from: 1, to: 2, speed: 5, loop: false },
        },
    },
});


loadSprite("Background","Background.png") //Background



scene("game", () => {
   
    const music = play("music", {    //music loop
        loop: true,
        
    
        
        
    });
    music.play()

    const Background = add([   //positioning of the background
        sprite("Background"), 
        pos(width() / 1000, height() / 1000), 
        scale(1.7)       
    ])



    const ALIEN_ROWS = 6;     //aliens size, positioning etc...
    const ALIEN_COLS = 8;
    var AlienCount= 48;

    const BLOCK_HEIGHT = 40;
    const BLOCK_WIDTH = 40;

    const OFFSET_X = 100;
    const OFFSET_Y = 100;

    let alienMap = [];
    function spawnAliens() {
        for (let row = 0; row < ALIEN_ROWS; row++) {
            alienMap[row] = [];
            for (let col = 0; col < ALIEN_COLS; col++) {
                const x = col * BLOCK_WIDTH * 2 + OFFSET_X;
                const y = row * BLOCK_HEIGHT + OFFSET_Y;
                const alien = add([
                    pos(x, y),
                    sprite("alien"),
                    area(),
                    scale(),
                    origin("center"),
                    "alien",
                    {
                        row: row,
                        col: col,
                    },
                ]);
                alien.play("fly");
                alienMap[row][col] = alien;
            }
        }
    }
    spawnAliens();

                        // movement of player
    let pause = false;
    onKeyDown("left", () => {
        if (pause) return;
        if (player.pos.x >= SCREEN_EDGE) {
            player.move(-1 * PLAYER_MOVE_SPEED, 0);
        }
    });

    onKeyDown("right", () => {
        if (pause) return;
        if (player.pos.x <= width() - SCREEN_EDGE) {
            player.move(PLAYER_MOVE_SPEED, 0);
        }


    });

    const player = add([           //adding the player object
        sprite("player"),
        scale(1),
        origin("center"),
        pos(50, 550),
        area(),
        {
            score: 0,
            lives: 3,
        },
        "player",
    ]);

    player.play("move");


    let alienDirection = 1;   //movement alien
    let alienMoveCounter = 0;
    let alienRowsMoved = 0;


    onUpdate(() => {
        if (pause) return;

        every("alien", (alien) => {
            alien.move(alienDirection * ALIEN_SPEED, 0);
        });

        alienMoveCounter++;

        if (alienMoveCounter > ALIEN_STEPS) {
            alienDirection = alienDirection * -1;
            alienMoveCounter = 0;
            moveAliensDown();
        }

        if (alienRowsMoved > Aliens_Rows_Move) {
            pause = true;
            player.play("explode");
            wait(2, () => {
                play("gameoverSound"),
                go("gameOver", player.score);
            });
        }
    });

    function moveAliensDown() {
        alienRowsMoved++;
        every("alien", (alien) => {
            alien.moveBy(0, BLOCK_HEIGHT);
        });
    }




                              //shooting
    let lastShootTime = time();

    onKeyPress("space", () => {
        if (pause) return;
        if (time() - lastShootTime > GUN_COOLDOWN_TIME) {
            lastShootTime = time();
            spawnBullet(player.pos, -1, "bullet");
        }
    });

    function spawnBullet(bulletPos, direction, tag) {
        add([
            rect(2, 6),
            pos(bulletPos),
            origin("center"),
            color(0, 0, 0),
            area(),
            cleanup(),
            play("GUNsoundEffect"),
            volume(0.05),
            "missile",
            tag,
            {
                direction,
            },
        ]);
    }



    onUpdate("missile", (missile) => {    //This bullet will just be stationary until we add in some movement for it each frame
        if (pause) return;
        missile.move(0, BULLET_SPEED * missile.direction);
    });

    var removeRow = true;

    onCollide("bullet", "alien", (bullet, alien) => {    //COLLISION BULLETS -> ALIENS
        destroy(bullet);
        alien.play("explode");
        volume(0.05),
        alien.use(lifespan(0.5, { fade: 0.1 }));
        play("AlienExplosion"),
        alienMap[alien.row][alien.col] = null; // Mark the alien as dead
        updateScore(POINTS_PER_ALIEN);
        AlienCount = AlienCount-1;

    




        pause = true;

            if (AlienCount == 0) {
                wait(1, () => {
                play("gameComplete"), 
                go("gameOver", player.score);
    
                });
            } else {
                pause = false;
            }

    });




    add([
        text("SCORE:", { size: 20, font: "sink" }),    //Score codepart
        pos(100, 40),
        origin("center"),
        layer("ui"),
    ]);

    const scoreText = add([
        text("000000", { size: 20, font: "sink" }),
        pos(200, 40),
        origin("center"),
        layer("ui"),
    ]);

    function updateScore(points) {
        player.score += points;
        scoreText.text = player.score.toString().padStart(6, "0");
    }



// Find a random alien to make shoot    //ALIENS FIGHT BACK
    loop(1, () => {
        if (pause) return;
        // Randomly choose a column, then walk up from the
        // bottom row until an alien that is still alive is found

        let row, col;
        col = randi(0, ALIEN_COLS);
        let shooter = null;

        // Look for the first alien in the column that is still alive
        for (row = ALIEN_ROWS - 1; row >= 0; row--) {
            shooter = alienMap[row][col];
            if (shooter != null) {
                break;
            }
        }
        if (shooter != null) {
            spawnBullet(shooter.pos, 1, "alienBullet");
        }
    });




    player.onCollide("alienBullet", (bullet) => {   //BULLET COLLISION WITH PLAYER
        if (pause) return;
        destroyAll("bullet");
        play("planeExplosion"),
        volume(0.05),
        player.play("explode");
        updateLives(-1);
        pause = true;
        wait(1, () => {
            if (player.lives == 0) {
                play("gameoverSound"),
                go("gameOver", player.score);
            } else {
                player.moveTo(50, 550);
                player.play("move");
                pause = false;
            }
        });
    });

    add([                                                //Update live
        text("LIVES:", { size: 20, font: "sink" }),
        pos(650, 40),
        origin("center"),
        layer("ui"),
    ]);

    const livesText = add([
        text("3", { size: 20, font: "sink" }),
        pos(700, 40),
        origin("center"),
        layer("ui"),
    ]);

    function updateLives(life) {
        player.lives += life;
        livesText.text = player.lives.toString();
    }








});

scene("gameOver", (score) => {


    
    add([                //positioning etc..
        pos(0, 0),
        rect(2000, 4000),
        outline(0),
        area(),
       color(50,50,50)
    ])
    
    
    add([
        text("GAME OVER", { size: 40, font: "sink" }),   //game over font etc...
        pos(width() / 2, height() / 2),
        origin("center"),
        layer("ui"),
      ]);
      
      add([
        text("SCORE: " + score, { size: 20, font: "sink" }),   //score font etc...
        pos(width() / 2, height() / 2 + 50),
        origin("center"),
        layer("ui"),
      ]);
     
      add([
        text("press spacebar to restart", { size: 20, font: "sink" }),   // font etc for the text
        pos(width() / 2, height() / 2 + 100),
        origin("center"),
        layer("ui"),
      ]);


      add([
        text("credits: Alina, Amy, Nicolas, Patrice", { size: 20, font: "sink" }), //font for the credits etc...
        pos(width() / 2, height() / 2 + 250),
        origin("center"),
        layer("ui"),
      ]);

      onKeyPress("space", () => { //restart of the game
        go("game");
      });

     
  });
  
  go("game");



