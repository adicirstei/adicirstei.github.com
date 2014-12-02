(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 450, Phaser.AUTO, 'gravity');

  // Game States
  game.state.add('GameOver', require('./states/GameOver'));
  game.state.add('GameWin', require('./states/GameWin'));
  game.state.add('boot', require('./states/boot'));
  game.state.add('gamelogic', require('./states/gamelogic'));
  game.state.add('levelintro', require('./states/levelintro'));
  game.state.add('levelmaster', require('./states/levelmaster'));
  game.state.add('levelmenu', require('./states/levelmenu'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/GameOver":5,"./states/GameWin":6,"./states/boot":7,"./states/gamelogic":8,"./states/levelintro":9,"./states/levelmaster":10,"./states/levelmenu":11,"./states/preload":12}],2:[function(require,module,exports){
'use strict';

var Planet = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'asteroid' + (frame || ''));

  // initialize your prefab here
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.immovable = true;
  
  
  this.body.mass = this.width * this.height * 70;
  
};

Planet.prototype = Object.create(Phaser.Sprite.prototype);
Planet.prototype.constructor = Planet;

Planet.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Planet;

},{}],3:[function(require,module,exports){
'use strict';

var Satelite = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'satelite', frame);

  // initialize your prefab here
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.enable(this, Phaser.Physics.ARCADE);
  this.body.mass = this.width * this.height * 0.1;
  this.animations.add('spin', null, 8);
  this.animations.play('spin', null, true);
};

Satelite.prototype = Object.create(Phaser.Sprite.prototype);
Satelite.prototype.constructor = Satelite;

Satelite.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};


Satelite.prototype.addGravity = function(obj) {
  var d = Math.pow(this.game.math.distancePow(this.x, this.y, obj.x, obj.y), 2);
  var f = this.body.mass * obj.body.mass / d;
  var a = this.game.physics.arcade.angleBetween(this, obj);
  
  this.body.acceleration.add(Math.cos(a) * f, Math.sin(a) * f);
};

module.exports = Satelite;

},{}],4:[function(require,module,exports){
'use strict';

var Wall = function(game, x, y, w, h, frame) {
  Phaser.TileSprite.call(this, game, x, y, w, h, 'wall', frame);

  
  
  // initialize your prefab here
  this.anchor.setTo(0.5, 0.5);
  this.game.physics.arcade.enableBody(this);
  this.body.immovable = true;
};

Wall.prototype = Object.create(Phaser.TileSprite.prototype);
Wall.prototype.constructor = Wall;

Wall.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Wall;

},{}],5:[function(require,module,exports){
"use strict";

function GameOver() {}

module.exports = GameOver;

},{}],6:[function(require,module,exports){
"use strict";

function GameWin() {}

module.exports = GameWin;
},{}],7:[function(require,module,exports){
'use strict';

function Boot () {}

Boot.prototype = {
  preload: function() {
    // preload assets for game loading state like progress bar, bg
    this.load.image('preloader', 'assets/preloader.gif');
  },

  create: function() {
    this.game.input.maxPointers = 1;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.setScreenSize(true);
    
    this.state.start('preload');
  }
};


module.exports = Boot;

},{}],8:[function(require,module,exports){
"use strict";
var AIMING = 0, WAITING = 1, LOOKING = 2;

var Wall = require('../prefabs/Wall');
var Satelite = require('../prefabs/Satelite');
var Planet = require('../prefabs/Planet');

var lm = require('../utils/levelmanager');

function GameLogic() {}

GameLogic.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.setBoundsToWorld();
    this.input.onDown.add(this.mouseDown, this);
    this.input.onUp.add(this.mouseUp, this);
    
    this.add.sprite(0, 0, 'gamebg');
    
    this.loadLevel();
    
  }
};

GameLogic.prototype.update = function() {
  if (this.status !== LOOKING) return;

  this.game.physics.arcade.overlap(this.satelite, this.walls, this.sateliteDeath, null, this);
  this.game.physics.arcade.overlap(this.satelite, this.planets, this.sateliteDeath, function(o1, o2) {
    var distance = this.game.physics.arcade.distanceBetween(o1, o2);
    return o1.width/2 + o2.width/2 > distance;
    
  }, this);
  this.satelite.body.acceleration.setTo(0, 0);
  this.planets.forEach(function (p) {
    
    this.satelite.addGravity(p);
    
  }, this);
};

GameLogic.prototype.sateliteDeath = function() {
  //this.satelite.kill();
  this.resetLevel();
};


GameLogic.prototype.mouseDown = function() {
  if (this.status !== WAITING) return;
  
  this.status = AIMING;
};

GameLogic.prototype.mouseUp = function() {
  if (this.status !== AIMING) return;
  this.satelite.body.moves = true;
  this.status = LOOKING;
  this.launchSatelite(this.input.worldX, this.input.worldY);
};

GameLogic.prototype.launchSatelite = function(x, y) {
  this.game.physics.arcade.velocityFromRotation(this.game.math.angleBetween(this.satelite.x, this.satelite.y, x, y)  , 200, this.satelite.body.velocity);
};

GameLogic.prototype.resetLevel = function() {
  var data = lm.getCurrent();
  
  this.satelite.reset(data.Satelite.x, data.Satelite.y);
  this.satelite.body.moves = false;
  this.status = WAITING;
};

GameLogic.prototype.loadLevel = function() {
  var data = lm.getCurrent();
  var i, g = this.game, args, c, o;
  this.walls =  this.game.add.group();
  for(i = 0; i<data.Walls.length; i++) {
    o = new Wall(this.game, data.Walls[i].x, data.Walls[i].y, data.Walls[i].w, data.Walls[i].h);
    this.walls.add(o);
  }
  
  this.planets =  this.game.add.group();
  
  for(i = 0; i<data.Planets.length; i++) {
    o = new Planet(this.game, data.Planets[i].x, data.Planets[i].y, data.Planets[i].f);
    this.planets.add(o);
  }

  this.satelite = new Satelite(this.game, data.Satelite.x, data.Satelite.y);
  this.satelite.body.velocity.x = 0;
  this.satelite.body.velocity.y = 0;
  this.satelite.checkWorldBounds = true;
  this.game.add.existing(this.satelite);

  this.satelite.events.onOutOfBounds.add(function() {
    lm.levelComplete();  
    this.state.start('levelmenu');
  }, this);

  this.status = WAITING;
};

module.exports = GameLogic;

},{"../prefabs/Planet":2,"../prefabs/Satelite":3,"../prefabs/Wall":4,"../utils/levelmanager":13}],9:[function(require,module,exports){
"use strict";
var lm = require('../utils/levelmanager');


function LevelIntro () {}

LevelIntro.prototype = {

  create: function() {

    this.add.sprite(0, 0, "background");
    var txt = this.add.text(this.game.stage.width /2, this.game.stage.height/2, "Level " + lm.currentLevel, {
      fill: "rgb(237, 212, 22)",
      strokeThickness: 2,
      stroke: '#002800',
      font: '48px Arial'
    });  
    txt.anchor.setTo(0.5, 0.5);
    var sat = this.add.sprite(-10, 300 * Math.random(), "satelite");
    var t = this.game.add.tween(sat);
    t.to({x: this.world.width, y: this.world.height * Math.random()}, 2000, Phaser.Easing.Linear.None)
    .onComplete.add(function () {

      this.state.start("gamelogic", true, false); 
    }, this);
    t.start();  

  }
};

module.exports = LevelIntro;
},{"../utils/levelmanager":13}],10:[function(require,module,exports){
"use strict";

function LevelMaster () {}

module.exports = LevelMaster;

LevelMaster.prototype = {
  init: function(gameData) {
    this.gameData = gameData;  
  },

  create: function() {
    
    this.state.start("levelintro", false, false, this.gameData); 
  }
};

},{}],11:[function(require,module,exports){
"use strict";
var lm = require('../utils/levelmanager');
var rows = 4, cols = 7;

function LevelMenu () {}

module.exports = LevelMenu;

LevelMenu.prototype = {
  cellWidth: 800 / cols,
  cellHeight: 450 / (rows + 1),

  create: function() {
    this.add.sprite(0, 0, 'background');
    var title = this.add.text(400, 60, "Pick a level", {
      fill: "#6aff81",
      font: '28px Arial'
    });
    title.anchor.setTo(0.5, 0.5);
    this.addLevelButtons();
  },

  addLevelButtons: function() {
    
    var lev, i, x, y, b, thisState = this, txt;
    this.buttons = this.game.add.group();
    for (lev = 1; lev <= rows * cols; lev++) {
      i = lev - 1;
      x = i % cols * this.cellWidth;
      y = Math.floor(i / cols) * this.cellHeight + this.cellHeight;
      this.buttons.add(b = this.add.button(x, y, "MenuButton", 
        function() {
//          thisState.game.scale.startFullScreen(false);
          if (this.id > lm.unlockedLevels) return;
          lm.currentLevel = this.id;
          thisState.state.start("levelmaster", true, false);
        }, {id: lev}));
      b.alpha = (i < lm.unlockedLevels ? 1.0 : 0.4);
      txt = this.add.text(x + this.cellWidth/2, y + this.cellHeight / 2, "" + lev, {
        fill: (i < lm.unlockedLevels ? "#4ee200" : "rgba(98, 229, 0, 0.29)"),
        strokeThickness: 1,
        stroke: '#002800',
        font: '24px Arial'
      });
      txt.anchor.setTo(0.5, 0.5);  
      txt.setShadow(2, 1, '#333', 3);
    }
  }
};

},{"../utils/levelmanager":13}],12:[function(require,module,exports){
"use strict";

function Preload () {
  this.asset = null;
  this.ready = false;
}

module.exports = Preload;

Preload.prototype = {
  preload: function() {
    this.asset = this.add.sprite(this.game.width/2,this.game.height/2, 'preloader');
    this.asset.anchor.setTo(0.5, 0.5);

    this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
    this.load.setPreloadSprite(this.asset);    
    this.load.image('background', 'assets/background-m1.png');
    this.load.image('asteroid', 'assets/asteroid.png');
    this.load.image('asteroid1', 'assets/asteroid1.png');
    this.load.image('asteroid2', 'assets/asteroid2.png');
    this.load.image('asteroid3', 'assets/asteroid3.png');
    //this.load.image('satelite', 'assets/satelite.png');
    this.load.spritesheet('satelite', 'assets/sat-anim.png', 34, 34);
    this.load.image('fragment', 'assets/fragment.png');
    this.load.image('gamebg', 'assets/background-stilizat.png');
    this.load.image('MenuButton', 'assets/MenuButton.png');
    this.load.image('wall', 'assets/wall.png');
    this.load.image('fragment', 'assets/fragment.png');

    this.game.unlockedLevels = 15;
  },

  create: function() {
    var gamedata = this.gameData || this.emptyGameData;
    this.state.start('levelmenu', true, false, gamedata);
  },

  onLoadComplete: function() {
    this.ready = true;
  }
};

},{}],13:[function(require,module,exports){
'use strict';

var levels = [
  
  {
    Satelite: { x: 50, y: 100}, 
    Planets: [], 
    Walls: [{x: 400, y: 0, w: 800, h: 40}, {x: 400, y: 450, w: 800, h: 40} , {x: 0, y: 225, w: 40, h: 450}, {x: 800, y: 180, w: 40, h: 360}] 
  },
  {
    Satelite: { x: 50, y: 100}, 
    Planets: [{x: 600, y: 250, f: 2}, {x: 300, y: 200, f: 1}], 
    Walls: [{x: 400, y: 0, w: 800, h: 40}, {x: 400, y: 450, w: 800, h: 40} , {x: 0, y: 225, w: 40, h: 450}, {x: 800, y: 260, w: 40, h: 360}] 
  },
  {
    Satelite: { x: 50, y: 100}, 
    Planets: [{x: 600, y: 300, r: 60}], 
    Walls: [{x: 350, y: 0, w: 700, h: 40}, {x: 400, y: 450, w: 800, h: 40} , {x: 0, y: 225, w: 40, h: 450}, {x: 800, y: 225, w: 40, h: 450}] 
  }
];

module.exports = {
  currentLevel: localStorage.getItem('current-level') || 0,
  
  get: function(lvl) {
    if (lvl < 1 || lvl > levels.length) return null;
    
    return levels[lvl-1];
  },

  levelComplete: function() {
    this.currentLevel++;
    this.unlockedLevels = Math.min(Math.max(this.currentLevel, this.unlockedLevels), levels.length);
    localStorage.setItem('unlocked-levels', this.unlockedLevels);
  },

  getCurrent: function() {
    return this.get(this.currentLevel);
  },
  
  highScore: 0,
  score: localStorage['score'] || 0,
  unlockedLevels: localStorage.getItem('unlocked-levels') || 1,
  lastPlayedLevel: localStorage.getItem('last-played-level') || 0
};


},{}]},{},[1])