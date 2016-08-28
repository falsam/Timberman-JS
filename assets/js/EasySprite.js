 /**
 *EasySprite.js by falsam
 * 
 * Version 	: 2.0.2
 *
 * Released under The MIT License (MIT)
 *
 * Create	: 01 Juin 2015
 * Update 	: 25 Aout 2016
 */
(function(){
	"use strict";
	
	var game = [];	

	// Default value
	game.canvas = "game";
	game.initkeyboard = false; 
	game.initmouse = false;
	game.mousehide = false;
	game.TO_RADIANS = Math.PI/180;	
	game.lastCalledTime = 0;
	game.fps = 0;
	game.fpsCount = 0;
	game.inputs = []
	game.key = {};
	
	function loadFailure() {
		alert("'" + this.name + "' failed to load.");
		return true;
	}
 
	// FPS 
	function FPS() {		
		game.fpsCount += 1;
	
		if (Date.now() - game.lastCalledTime >= 1000) {
			game.lastCalledTime = Date.now();
			game.fps = game.fpsCount;
			game.fpsCount = 0;
		}
		return game.fps;
	}

	// SCREEN FEATURE
	
	// Screen - Create and open new screen.
	function openScreen(id, x, y, width, height) {
		var selector = document.getElementById(id);	
		
		// is canvas exist ?
		if (selector === null) {
			// No : Create Canvas Rendering		
			selector = document.createElement("canvas");
			selector.id = id;
	
			selector.style.position = "absolute";
			selector.style.top = x.toString() + "px";
			selector.style.left  = y.toString() + "px";
			selector.width = width;
			selector.height = height;
	
			document.body.appendChild(selector);
		} else {
			
			// Yes : Canvas exist
			if (width === 0) {width = selector.width};
			if (height === 0) {height = selector.height};
			
			selector.width = width;
			selector.height = height;			
		}
		
		// Record canvas setup
		game.canvas = id;
		game.x = x;
		game.y = y;
		game.width = width;
		game.height = height;
		game.context = selector.getContext('2d');
	
		return game;
	}
	
	// Screen - Clear the whole screen with the specified color.
	function clearScreen(color) {
		game.context.fillStyle = color;
		game.context.fillRect(0, 0, game.width, game.height);
	}

	// Screen - Returns the current screen width.
	function screenWidth() { return game.width; }

	// Screen - Returns the current screen height.
	function screenHeight() { return game.height; }

	// Screen - Center Screen (Disable)
	function centerScreen() {
		var canvas = document.getElementById(game.canvas);
		canvas.style = "display: block; margin: 0 auto;";
	}
	
	// resizeScreen
	function resizeScreen(center) {
		var canvas = document.getElementById(game.canvas);
		var canvasRatio = canvas.height / canvas.width;
		var windowRatio = window.innerHeight / window.innerWidth;
		var width;
		var height;

		if (windowRatio < canvasRatio) {
		    height = window.innerHeight;
		    width = height / canvasRatio;
		} else {
		    width = window.innerWidth;
		    height = width * canvasRatio;
		}

		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
   
		if (center == true) {
		    var style = canvas.style;
		    style.marginLeft = "auto";
		    style.marginRight = "auto";
		    var parentStyle = canvas.parentElement.style;
		    parentStyle.textAlign = "center";
		    parentStyle.width = "100%";
		}
		window.addEventListener('resize', resizeScreen, false);
	}
	
	// SPRITE FEATURE	
	function Sprite() {
		//Position & size
		this.x = 0;
		this.y = 0;	
		this.z = 0;
		this.width = 0;
		this.height = 0;
		this.remove = false;
		
		//Anchor
		this.anchor = [];
		this.anchor.x = 0;
		this.anchor.y = 0;		
		
		//Rotate
		this.rotate = [];
		this.rotate.angle = 0;
		this.rotate.relatif = false;
		this.rotate.vAngle = 0;
		
		//Clip
		this.clip = [];
		this.clip.x = 0;
		this.clip.y = 0;
		this.clip.width = 0;
		this.clip.height = 0;
		this.clip.frame = 1;
		this.clip.speed = 0;
		
		//Flip
		this.flip = [];
		this.flip.h = 1; // No flip (-1 flip horizontal)
		this.flip.v = 1; // no flip (-1 flip vertical)
		
		//Scale
		this.scale = [];
		this.scale.width = 0;
		this.scale.height = 0;
		
		//Scroll
		this.scroll = [];
		this.scroll.x = 0;
		this.scroll.y = 0
		this.scroll.PositionX = 0;
		this.scroll.PositionY = 0;	
		
		//Opacity
		this.opacity = 1.0;

		//velocity.
		this.velocity = [];
		this.velocity.x = 0;
		this.velocity.y = 0;
		
		//Animation
		this.animations = [];
		
		this.load = false;
		
		//Data
		this.data = 0;
		this.n = 0;
		
		//Callbak Events
		this.onClick = false;
	}
	
	// Create Sprite
	function createSprite(width, height, color, onReady, onClick) {
		if (onReady === void 0) { onReady = false; }
		if (onClick === void 0) { onClick = false; }
		
		var sprite = new Sprite();
		var image = new Image();
		var canvas = document.createElement("canvas");
		var context = canvas.getContext("2d");
			
		canvas.width = width;
		canvas.height = height;
		context.fillStyle = color;
		context.fillRect(0, 0, width, height);
			
		//image = document.createElement("img");
		//image.style.display = "none";
		image.onload = function(){

			// Size
			sprite.width = width;		
			sprite.height = height;

			// Clip
			sprite.clip.width = sprite.width,
			sprite.clip.height = sprite.height,
			
			// Scale
			sprite.scale.width = sprite.width;
			sprite.scale.height = sprite.height;
			
			// Callback
			if (onReady != false) {
				onReady(sprite);
			};	
			if (onClick != false) {
				game.inputs[game.inputs.length] = sprite
				sprite.onClick = onClick;
			};
		};
		image.onerror = loadFailure;
		image.src = canvas.toDataURL("image/png");
		sprite.image = image;						
		return sprite;
	}

	
	// Sprite - Load sprite
	function loadSprite(fileName, onReady, onClick) {
		if (onReady === void 0) { onReady = false; }
		if (onClick === void 0) { onClick = false; }
		
		var image = new Image();
		var sprite = new Sprite();
		
		function getWidthAndHeight(){
			if (sprite.load == false) {
				sprite.clip.width = this.width;
				sprite.clip.height = this.height; 
				sprite.width = this.width;
				sprite.height = this.height;
				sprite.scale.width = this.width;
				sprite.scale.height = this.height;
				if (onReady != false) {
					onReady(sprite);
				};

				if (onClick != false) {
					game.inputs[game.inputs.length] = sprite
					sprite.onClick = onClick;
				};	
			}
		} 		
		
		image.onload = getWidthAndHeight;
		image.onerror = loadFailure;
		image.name = fileName;
		image.src = fileName;	
		sprite.image = image;
		return sprite;	
	}

	// Sprite - Copy sprite
	function copySprite(sprite) {				
		return Object.assign({}, sprite);
	}

	// Sprite - Set opacity(0.0 et 1.0)
	function opacitySprite(sprite, opacity) {
		sprite.opacity = opacity;
	}

	// Sprite - Portion d'image à afficher - clipping
	function clipSprite(sprite, x, y, width, height) {
		sprite.clip.x = x;
		sprite.clip.y = y;
		sprite.clip.width = width;
		sprite.clip.height = height;
		sprite.scale.width = width;
		sprite.scale.height = height;
	}

	// Sprite - Rotation  (Angle en degré)
	function rotateSprite(sprite, angle, loop) {
		if ( loop === true) {
			sprite.rotate.angle = angle;	//Rotation relative
			sprite.rotate.relatif = true;
		} else {
			sprite.rotate.angle = angle;	//Rotation absolue
			sprite.rotate.relatif = false;			
		}	
	}
	
	// Sprite - Scale 
	function scaleSprite(sprite, width, height) {
		sprite.scale.width = width;
		sprite.scale.height = height;
	}
	
	// Sprite - Set velocity
	function spriteVelocity(sprite, x, y) {
		if (y === void 0) { y = 0; }
		
		sprite.velocity.x = x;
		sprite.velocity.y = y;
	}
	
	// sprite - Flip (-1 flip)
	function flipSprite (sprite, flipH, flipV) {
		if (flipV === void 0) { flipV = 1; }
	
		sprite.flip.h = flipH;
		sprite.flip.v = flipV;
	}

	// Sprite - Anchor
	function anchorSprite(sprite, x, y) {
		sprite.anchor.x = x;
		sprite.anchor.y = y;
	}

	// Sprite - Position
	function spritePosition(sprite, x, y) {
		if (y === void 0) { y = 0; }
		
		sprite.x = x;
		sprite.y = y;
	}
	
	// Sprite - Display sprite (width & height optionnel)
	function displaySprite(sprite, x, y, width, height) {
		if (x === void 0) { x = sprite.x + sprite.velocity.x; }
		if (y === void 0) { y = sprite.y + sprite.velocity.y; }	
		
		if (width !== void 0) { sprite.scale.width = width;}
		if (height !== void 0) { sprite.scale.height = height; }
		
		if (sprite.scale.width === undefined) {
			sprite.scale.width = sprite.width;
		}

		if (sprite.scale.height === undefined) {
			sprite.scale.height = sprite.height;
		}
		
		sprite.remove = false;
		sprite.x = x;
		sprite.y = y;

		if (sprite.rotate.vAngle + sprite.rotate.angle > 360) {
			sprite.rotate.vAngle -= 360; 
		}
		
		if (sprite.rotate.relatif = true) {
			sprite.rotate.vAngle += sprite.rotate.angle;	//Rotation relative			
		}
		
		// Affichage du sprite - Show sprite
		game.context.save();
	
		game.context.globalAlpha = sprite.opacity;
		game.context.translate(sprite.x, sprite.y);
		game.context.rotate(sprite.rotate.vAngle * game.TO_RADIANS);
	
		game.context.scale(sprite.flip.h, sprite.flip.v);
	
		game.context.drawImage(
			sprite.image, // sprite sheet
		
			//Source
			sprite.clip.x,
			sprite.clip.y,
			sprite.clip.width,
			sprite.clip.height,
		
			//Destination)
			- sprite.scale.width * sprite.anchor.x, 	// Position x
			- sprite.scale.height * sprite.anchor.y,	// Position y
			sprite.scale.width,
			sprite.scale.height
		);
		
		game.context.restore();
	}
	
	// Sprite - Remove from screen
	function removeSprite(sprite) {
		sprite.remove = true;
	}
		
	// Sprite - Collision between two sprites
	function spriteCollision(sprite1, sprite2) {
		if (sprite1.remove == false && sprite2.remove == false) {
			if (sprite1.x - sprite1.clip.width * sprite1.anchor.x < sprite2.x + sprite2.clip.width - sprite2.clip.width * sprite2.anchor.x &&
				sprite1.x + sprite1.clip.width - sprite1.clip.width * sprite1.anchor.x > sprite2.x - sprite2.clip.width * sprite2.anchor.x &&
				sprite1.y - sprite1.clip.height * sprite1.anchor.y < sprite2.y + sprite2.clip.height - sprite2.clip.height * sprite2.anchor.y&&
				sprite1.clip.height + sprite1.y - sprite1.clip.height * sprite1.anchor.y > sprite2.y - sprite2.clip.height * sprite2.anchor.y ) {
		
				return true;
			}
		}
	}
	
	// Sprite - is sprite exist ?
	function isSprite(sprite) {
		if (typeof sprite === "object") {
			return true;
		} else {
			return false;
		}
	}
	
	// Sprite - Scroll 
	function scrollSprite(sprite, x, y, stepX, stepY, width, height) {
		var spriteWidth  = width; 
		var spriteHeight = height; 
		var sx, sy;
  
		if (width === void(0)) {width = sprite.scale.width};
		if (height === void(0)) {height = sprite.scale.height};
		
		sprite.scroll.PositionX += stepX;
		sprite.scroll.PositionY += stepY;
		
		if (sprite.scroll.PositionX > spriteWidth) {
			sprite.scroll.PositionX = 0;
		}
  
		if (sprite.scroll.PositionX < 0) {
			sprite.scroll.PositionX = spriteWidth;
		}
  
		if (sprite.scroll.PositionY > spriteHeight) {
			sprite.scroll.PositionY = 0;
		}
  
		if (sprite.scroll.PositionY < 0) {
			sprite.scroll.PositionY = spriteHeight;
		}
				
		for (sx = 0; sx < 2; sx++) {
			for (sy = 0; sy < 1; sy++) {
				displaySprite(sprite, x + spriteWidth * sx - sprite.scroll.PositionX, y + spriteHeight * sy - sprite.scroll.PositionY, width, height);
			}
		}
	}

	// Sprite - Return sprite width 
	function spriteWidth(sprite) { return sprite.width; }

	// Sprite - Return sprite height
	function spriteHeight(sprite) { return sprite.height; }

	// Sprite - Start drawing
	function startDrawing(sprite) {
		var context;
		
		game.currentsprite = sprite;
		
		game.currentdraw = document.createElement("canvas");
		game.currentdraw.id = "temp";
		game.currentdraw.width = sprite.width;
		game.currentdraw.height = sprite.height;
		context = game.currentdraw.getContext("2d");
		context.drawImage(sprite.image, 0, 0);

		return context;
	}
		
	// Sprite - Stop drawing
	function stopDrawing() {
		game.currentsprite.load = true;
		game.currentsprite.image.src = game.currentdraw.toDataURL("image/png");	
	}
	
	// ANIMATION FEATURE
	
	// Animation - Ajout d'une animation 
	//	@sprite 	: sprite
	//	@Animation  : Nom de l'animation
	//	@Frame		: Tableau des images à afficher
	// 	@FrameWidth	: Largeur de la frame
	// 	@FrameHeight: Hauteur de la frame
	//	@FrameRate	: Durée d'affichage d'une image	
	//	@Exemple	: addAnimation(coin, "droite", [0,1,2,3,4,5,6,7,8], 100, 100, 50);
	function addAnimation(sprite, Animation, Frame, FrameWidth, FrameHeight, FrameRate) {
	
		var Item = new Array();
		Item.frame = Frame;
		Item.FrameRate = FrameRate;
		Item.FrameTimeLife = 0;
		Item.CurrentAnimation = 0;
		Item.CurrentFrame = 0;
		Item.active = false;
		
		sprite.animations[Animation] = Item;
		sprite.clip.width = FrameWidth;
		sprite.clip.height = FrameHeight;
		sprite.scale.width = FrameWidth;
		sprite.scale.height= FrameHeight;
	}

	// Animation - Play animation. Example : playAnimation(player, "walk");
	function playAnimation(sprite, Animation) {
		if (sprite.animations[Animation] !== undefined) {
			var currTime = new Date().getTime();
			
			if ( currTime - sprite.animations[Animation].FrameTimeLife > sprite.animations[Animation].FrameRate ) {
				sprite.animations[Animation].FrameTimeLife = currTime;
				sprite.currentAnimation = Animation;	
			
				//Number of Images Per Row (ipr)
				var ipr = sprite.width / sprite.clip.width
	
				sprite.clip.x = (sprite.animations[Animation].frame[sprite.animations[Animation].CurrentFrame]
								- Math.floor(sprite.animations[Animation].frame[sprite.animations[Animation].CurrentFrame] / ipr)*ipr)
								* sprite.clip.width;
				
				sprite.clip.y = Math.floor(sprite.animations[Animation].frame[sprite.animations[Animation].CurrentFrame] / ipr)
								* sprite.clip.height;
								
				if ( sprite.animations[Animation].CurrentFrame < sprite.animations[Animation].frame.length-1 ) {
					sprite.animations[Animation].CurrentFrame += 1;
					sprite.animations[Animation].active = true;
				} else {
					sprite.animations[Animation].CurrentFrame = 0;
					sprite.animations[Animation].active = false;
				}
			}
		}
	}
	
	// Animation - Animation active
	function animationActive(sprite, Animation) {
		return sprite.animations[Animation].active;
	}

	// TEXT & DEBUG FEATURE
	
	// Text - Display text
	function displayText(text, x, y, font, size, color) {
		if (font === void 0) { font = "Arial"; }	
		if (size === void 0) { size = 20; }
		if (color === void 0) { color = "red"; }
		
		game.context.font = size.toString() + "px " + font;
		game.context.fillStyle = color;
		game.context.fillText(text, x, y);	
	}
	
	// Sprite - Debug Sprite
	function debugSprite(sprite, x, y) {
		var police = "Arial";
		var size = 20;
		var color = "red";
		var animation;
		
		if (x === void(0)) {x = 20};
		if (y === void(0)) {y = 40};
		
		displayText("x/y: " + sprite.x + "/" + sprite.y, x, y, police, size, color);
		displayText("width/height: " + sprite.width + "/" + sprite.height, x, y += 25, police, size, color);
		displayText("scale width/height: " + sprite.scale.width + "/" + sprite.scale.height, x, y += 25, police, size, color);
		displayText("clip x/y: " + sprite.clip.x + "/" + sprite.clip.y, x, y += 25, police, size, color);
		displayText("clip width/height: " + sprite.clip.width + "/" + sprite.clip.height, x, y += 25, police, size, color);
		displayText("rotation: " + sprite.rotate.vAngle, x, y += 25, police, size, color);
		if (sprite.currentAnimation !== undefined) {
			animation = sprite.currentAnimation
			displayText("current animation: " + sprite.currentAnimation, x, y += 25, police, size, color);
			displayText("current frame: " + sprite.animations[animation].frame[sprite.animations[animation].CurrentFrame], x, y += 25, police, size, color);
		}
	}
	
	function debugScreen(x, y) {
		var police = "Arial";
		var size = 20;
		var color = "red";
		
		if (x === void(0)) {x = 20};
		if (y === void(0)) {y = 40};
		
		displayText("x/y: " + game.x + "/" + game.y, x, y, police, size, color);
		displayText("width/height: " + game.width + "/" + game.height, x, y += 25, police, size, color);

		
	}
	// SOUND FEATURE

	// Sound - Load sound (Wav, mp3, ...)
	function loadSound(FileName) {
		return new Howl({ src: [FileName] });
	}

	// Sound - Adjusts volume between 0.0 and 1.0.
	function soundVolume(Sound, Volume) {
		if (Volume === void 0) { Volume = 1; }
		Sound._volume = Volume;
	}

	// Sound - Play sound
	function playSound(Sound, Loop) {
		if (Loop === void 0) { Loop = false; }	
		if (Loop === true) {
			Sound["_loop"] = true;
		}
		Sound.play();
	}

	// Sound - Pause sound
	function pauseSound(Sound) {
		Sound.pause();
	}

	// Sound - Pause sound
	function resumeSound(Sound) {
		Sound.stop();
	}

	
	// Sound - Get duration
	function soundLength(Sound) {
		return Sound.duration();
	}

	// Sound - Set or get current position
	function soundPosition (Sound, Position) {
		if (Sound.playing()) {
			if (Position === void 0) { 
				return Sound.seek();
			} else {
				Sound.seek(Position);
			};
		} else {
			return 0;
		}	
	}

	// Sound - Fade sound
	function fadeSound(sound, fromVolume, toVolume, time) {
		Sound.fade(fromVolume, toVolume, time);
	}

	// KeyBoard - Init KeyBoard Events (Place after OpenScreen)  
	function initKeyboard() {	
		game.key = {
			_released: {},
			_pressed: {},
	
			isDown: function(keyCode) { return this._pressed[keyCode]; },

			isReleased: function(keyCode) { return this._released[keyCode]; },
	  
			onKeydown: function(event) {
				this._pressed[event.keyCode] = true;
				delete this._released[event.keyCode];
			},

			onKeyup: function(event) {
				this._released[event.keyCode] = true;
				delete this._pressed[event.keyCode];
			}
		};
        
		window.addEventListener('keyup', function(event) { game.key.onKeyup(event); }, false);
		window.addEventListener('keydown', function(event) { game.key.onKeydown(event); }, false);
	
		game.initkeyboard = true;
	}

	// KeyBoard - Renvoie la touche préssée
	function keyboardPushed(key) {
		if (game.initkeyboard == true) {
			if ( game.key.isDown(key) == true) return true;
		} else {
			displayText("InitKeyboard() is not call", 10, 20, "system", 20, "rgba(255, 0, 0, 255)");
		}
	}

	// KeyBoard - Renvoie la touche relachée
	function keyboardReleased(key) {
		if (game.initkeyboard == true) {
			if ( game.key.isReleased(key) ) {
				delete game.key._released[key];
				return true
			};	
		} else {
			displayText("InitKeyboard() is not call", 10, 20, "system", 20, "rgba(255, 0, 0, 255)");
		}
	}
		
	// Mouse - Init mouse event (insert after OpenScreen ) 
	function getMousePos(canvas, evt, type) { // private
		var rect = canvas.getBoundingClientRect();
		var scale = rect.width / canvas.width;
		
		if (type == "mousemove") {
			return {
				x: (evt.clientX - rect.left)/scale,
				y: (evt.clientY - rect.top)/scale
			};
		} else {
			return {
				x: (evt.targetTouches[0].pageX - rect.left)/scale,
				y: (evt.targetTouches[0].pageY - rect.top)/scale
			}
		}
	}
	
	function mouseCollision() { // private
		if (game.mousehide == false) {
			for (var n in game.inputs) {				
				if ( mouseX() > game.inputs[n].x && mouseX() < game.inputs[n].x + game.inputs[n].scale.width &&
					mouseY() > game.inputs[n].y && mouseY() < game.inputs[n].y + game.inputs[n].scale.height)  {						
					return n;
					break;
				}
			}
		}
	}
	
	function initMouse(hide) {
		var Selector = document.getElementById(game.canvas), n;
		
		if (hide === void 0) { hide = false; }
		if (hide == true || game.mousehide == true) {
			game.mousehide = true;
			Selector.style.cursor = "none";
		}
		
		Selector.addEventListener("click", function(event) {
			game.mousebutton = true;
			
			var n = mouseCollision()
			if (n && game.mousehide == false) {
				game.inputs[n].onClick(game.inputs[n])
			}
		});
	
		Selector.addEventListener("mousemove", function(event) {
			var mousePos = getMousePos(Selector, event, "mousemove");
			game.mouseX = mousePos.x;
			game.mouseY = mousePos.y;
			
			if (game.mousehide == false) {
				if (mouseCollision()) {
					Selector.style.cursor = "pointer";
				} else {
					Selector.style.cursor = "auto";				
				}
			}
		});
	
		Selector.addEventListener("mouseout", function() {
			game.mouseX = -1;
			game.mouseY = -1;
		});
	
		Selector.addEventListener("mousedown", function() {
			game.mousebutton = false;
			game.mousestate = true;
		});
	
		Selector.addEventListener("mouseup", function() {
			game.mousestate = false;
		});
		
		// Mobile Device
		Selector.addEventListener("touchstart", function() {
			game.mousebutton = false;
			game.mousestate = true;
		});

		Selector.addEventListener("touchend", function() {
			game.mousestate = false;
		});

		Selector.addEventListener("touchmove", function(event) {			
			event.preventDefault();
			game.mousebutton = false;
			game.mousestate = true;

			var mousePos = getMousePos(Selector, event, "touchmove");
			game.mouseX = mousePos.x;
			game.mouseY = mousePos.y;
			
		}, false);
		
		game.mouseX = -1;
		game.mouseY = -1;
		game.mousebutton = false;
		game.mousestate = false;
	}

	// Mouse - Returns the actual mouse 'x' position (in pixels) on the current screen.
	function mouseX() {
		var Result = 0;
		if ( game.mouseX === -1 ) {
			Result = -1;
		} else {
			Result = game.mouseX;// - game.x;
		}

		return Result;
	}

	// Mouse - Returns the actual mouse 'y' position (in pixels) on the current screen. 
	function mouseY() {
		var Result = 0;
		if ( game.mouseY === -1 ) {
			Result = -1;
		} else {
			Result = game.mouseY;// - game.y;
		}
		return Result;
	}

	// Mouse - Returns zero if the specified button number is not pressed, else the button is pressed. 
	function mouseButton() {
		var Value = game.mousebutton;
		game.mousebutton = 0;
		return Value;	
	}

	function mouseState() {
		return game.mousestate;
	}	
	
	// Browser - Retourne la largeur du navigateur
	function windowWidth() {
		return document.all?document.body.clientWidth:window.innerWidth;
	}

	// Browser - Retourne la hauteur du navigateur
	function windowHeight() {
		return document.all?document.body.clientHeight:window.innerHeight; 
	}

	// Random (ça peut être utile)
	function random(min, max) {
		max++;
		return Math.floor(Math.random() * (max - min)) + min;
	}

	function randomFloat(min, max) {
		return Math.random() * (max - min) + min;
	}
	
	//Pads a string to the right by adding extra characters to fit the specified length. 
	function rPad(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	
	window.requestAnimationFrame = window.requestAnimationFrame || 
								   window.mozRequestAnimationFrame ||
								   window.webkitRequestAnimationFrame ||
								   window.msRequestAnimationFrame;

	// Define keyboard
	window.KEY_BACKSPACE = 8;
	window.KEY_TAB = 9;
	window.KEY_ENTER = 13;
	window.KEY_SHIFT = 16;
	window.KEY_CTRL = 17;
	window.KEY_ALT = 18;
	window.KEY_PAUSE = 19;
	window.KEY_CAPSLOCK = 20;
	window.KEY_ESCAPE = 27;
	window.KEY_SPACE = 32;	
	window.KEY_PAGEUP = 33;
	window.KEY_PAGEDOWN = 34;
	window.KEY_END = 35;
	window.KEY_HOME = 36;
	window.KEY_LEFT = 37;
	window.KEY_UP = 38;
	window.KEY_RIGHT = 39;
	window.KEY_DOWN = 40; 
	window.KEY_INSERT = 45;
	window.KEY_DELETE = 46;
	window.KEY_0 = 48;
	window.KEY_1 = 49;
	window.KEY_2 = 50;
	window.KEY_3 = 51;
	window.KEY_4 = 52;
	window.KEY_5 = 53;
	window.KEY_6 = 54;
	window.KEY_7 = 55;
	window.KEY_8 = 56;
	window.KEY_9 = 57;
	window.KEY_A = 65;
	window.KEY_B = 66;
	window.KEY_C = 67;
	window.KEY_D = 68;
	window.KEY_E = 69;
	window.KEY_F = 70;
	window.KEY_G = 71;	
	window.KEY_H = 72;
	window.KEY_I = 73;
	window.KEY_J = 74;
	window.KEY_K = 75;
	window.KEY_L = 76;
	window.KEY_M = 77;
	window.KEY_N = 78;
	window.KEY_O = 79;
	window.KEY_P = 80;
	window.KEY_Q = 81;
	window.KEY_R = 82;
	window.KEY_S = 83;
	window.KEY_T = 84;
	window.KEY_U = 85;
	window.KEY_V = 86;
	window.KEY_W = 87;
	window.KEY_X = 88;
	window.KEY_Y = 89;
	window.KEY_Z = 90;
	window.KEY_LEFTWINDOW = 91;
	window.KEY_RIGHTWINDOW = 92;
	window.KEY_SELECT = 93;
	window.KEY_NUMPAD0 = 96;
	window.KEY_NUMPAD1 = 97;
	window.KEY_NUMPAD2 = 98;
	window.KEY_NUMPAD3 = 99;
	window.KEY_NUMPAD4 = 100;
	window.KEY_NUMPAD5 = 101;
	window.KEY_NUMPAD6 = 102;
	window.KEY_NUMPAD7 = 103;
	window.KEY_NUMPAD8 = 104;
	window.KEY_NUMPAD9 = 105;
	window.KEY_MULTIPLY = 106;
	window.KEY_ADD = 107;
	window.KEY_SUBTRACT = 109;
	window.KEY_DECIMALPOINT = 110;
	window.KEY_DIVIDE = 111;
	window.KEY_F1 = 112;
	window.KEY_F2 = 113;
	window.KEY_F3 = 114;
	window.KEY_F4 = 115;
	window.KEY_F5 = 116;
	window.KEY_F6 = 117;
	window.KEY_F7 = 118;
	window.KEY_F8 = 119;
	window.KEY_F9 = 120;
	window.KEY_F10 = 121;
	window.KEY_F11 = 122;
	window.KEY_F12 = 123;
	window.KEY_NUMLOCK = 144;	
		
	// Declare functions
	
	//FPS
	window.FPS = FPS;

	//Screen
	window.openScreen = openScreen;
	window.clearScreen = clearScreen;
	window.screenWidth = screenWidth;
	window.screenHeight = screenHeight; 
	window.centerScreen = centerScreen;
	window.resizeScreen = resizeScreen;
	window.debugScreen = debugScreen;

	
	//Sprite
	window.createSprite = createSprite;
	window.loadSprite = loadSprite;
	window.anchorSprite = anchorSprite;
	window.clipSprite = clipSprite;
	window.scaleSprite = scaleSprite;
	window.copySprite = copySprite;
	window.spritePosition = spritePosition;
	window.spriteVelocity = spriteVelocity;
	window.displaySprite = displaySprite;
	window.flipSprite = flipSprite;
	window.opacitySprite = opacitySprite;
	window.rotateSprite = rotateSprite;
	window.scrollSprite = scrollSprite;
	window.spriteCollision = spriteCollision;
	window.spriteWidth = spriteWidth;
	window.spriteHeight = spriteHeight;
	window.isSprite = isSprite;
	window.removeSprite = removeSprite;
	window.debugSprite = debugSprite;
	window.startDrawing = startDrawing;
	window.stopDrawing = stopDrawing;

	//Animation
	window.addAnimation = addAnimation;
	window.animationActive = animationActive;
	window.playAnimation = playAnimation;

	//Sound
	window.loadSound = loadSound;
	window.pauseSound = pauseSound;
	window.playSound = playSound;
	window.resumeSound = resumeSound;
	window.soundLength = soundLength;
	window.soundVolume = soundVolume;
	window.soundPosition = soundPosition;
	window.fadeSound = fadeSound;

	//Text
	window.displayText = displayText;

	//Keyboard
	window.initKeyboard = initKeyboard;
	window.keyboardPushed = keyboardPushed;
	window.keyboardReleased = keyboardReleased;
	window.isDown

	//Mouse
	window.initMouse = initMouse;
	window.mouseButton = mouseButton;
	window.mouseState = mouseState;
	window.mouseX = mouseX;
	window.mouseY = mouseY;

	//Window
	window.windowWidth = windowWidth;
	window.windowHeight = windowHeight;

	//Misc	
	window.random = random;
	window.randomFloat = randomFloat;
	window.rPad = rPad;
})();

// Sound use howler.js
/*! howler.js v2.0.0-beta | (c) 2013-2015, James Simpson of GoldFire Studios | MIT License | howlerjs.com */
!function(){"use strict";function e(){try{"undefined"!=typeof AudioContext?n=new AudioContext:"undefined"!=typeof webkitAudioContext?n=new webkitAudioContext:o=!1}catch(e){o=!1}if(!o)if("undefined"!=typeof Audio)try{new Audio}catch(e){t=!0}else t=!0}var n=null,o=!0,t=!1;if(e(),o){var r="undefined"==typeof n.createGain?n.createGainNode():n.createGain();r.gain.value=1,r.connect(n.destination)}var d=function(){this.init()};d.prototype={init:function(){var e=this||u;return e._codecs={},e._howls=[],e._muted=!1,e._volume=1,e.iOSAutoEnable=!0,e.noAudio=t,e.usingWebAudio=o,e.ctx=n,t||e._setupCodecs(),e},volume:function(e){var n=this||u;if(e=parseFloat(e),"undefined"!=typeof e&&e>=0&&1>=e){n._volume=e,o&&(r.gain.value=e);for(var t=0;t<n._howls.length;t++)if(!n._howls[t]._webAudio)for(var d=n._howls[t]._getSoundIds(),a=0;a<d.length;a++){var i=n._howls[t]._soundById(d[a]);i&&i._node&&(i._node.volume=i._volume*e)}return n}return n._volume},mute:function(e){var n=this||u;n._muted=e,o&&(r.gain.value=e?0:n._volume);for(var t=0;t<n._howls.length;t++)if(!n._howls[t]._webAudio)for(var d=n._howls[t]._getSoundIds(),a=0;a<d.length;a++){var i=n._howls[t]._soundById(d[a]);i&&i._node&&(i._node.muted=e?!0:i._muted)}return n},codecs:function(e){return(this||u)._codecs[e]},_setupCodecs:function(){var e=this||u,n=new Audio,o=n.canPlayType("audio/mpeg;").replace(/^no$/,"");return e._codecs={mp3:!(!o&&!n.canPlayType("audio/mp3;").replace(/^no$/,"")),mpeg:!!o,opus:!!n.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!n.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!n.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),aac:!!n.canPlayType("audio/aac;").replace(/^no$/,""),m4a:!!(n.canPlayType("audio/x-m4a;")||n.canPlayType("audio/m4a;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(n.canPlayType("audio/x-mp4;")||n.canPlayType("audio/mp4;")||n.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,""),webm:!!n.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")},e},_enableiOSAudio:function(){var e=this||u;if(!n||!e._iOSEnabled&&/iPhone|iPad|iPod/i.test(navigator.userAgent)){e._iOSEnabled=!1;var o=function(){var t=n.createBuffer(1,1,22050),r=n.createBufferSource();r.buffer=t,r.connect(n.destination),"undefined"==typeof r.start?r.noteOn(0):r.start(0),setTimeout(function(){(r.playbackState===r.PLAYING_STATE||r.playbackState===r.FINISHED_STATE)&&(e._iOSEnabled=!0,e.iOSAutoEnable=!1,window.removeEventListener("touchstart",o,!1))},0)};return window.addEventListener("touchstart",o,!1),e}}};var u=new d,a=function(e){var n=this;return e.src&&0!==e.src.length?void n.init(e):void console.error("An array of source files must be passed with any new Howl.")};a.prototype={init:function(e){var t=this;return t._autoplay=e.autoplay||!1,t._ext=e.ext||null,t._html5=e.html5||!1,t._muted=e.mute||!1,t._loop=e.loop||!1,t._pool=e.pool||5,t._preload="boolean"==typeof e.preload?e.preload:!0,t._rate=e.rate||1,t._sprite=e.sprite||{},t._src="string"!=typeof e.src?e.src:[e.src],t._volume=void 0!==e.volume?e.volume:1,t._duration=0,t._loaded=!1,t._sounds=[],t._endTimers={},t._onend=e.onend?[{fn:e.onend}]:[],t._onfaded=e.onfaded?[{fn:e.onfaded}]:[],t._onload=e.onload?[{fn:e.onload}]:[],t._onloaderror=e.onloaderror?[{fn:e.onloaderror}]:[],t._onpause=e.onpause?[{fn:e.onpause}]:[],t._onplay=e.onplay?[{fn:e.onplay}]:[],t._webAudio=o&&!t._html5,"undefined"!=typeof n&&n&&u.iOSAutoEnable&&u._enableiOSAudio(),u._howls.push(t),t._preload&&t.load(),t},load:function(){var e=this,n=null;if(t)return void e._emit("loaderror");"string"==typeof e._src&&(e._src=[e._src]);for(var o=0;o<e._src.length;o++){var r,d;if(e._ext&&e._ext[o]?r=e._ext[o]:(d=e._src[o],r=/^data:audio\/([^;,]+);/i.exec(d),r||(r=/\.([^.]+)$/.exec(d.split("?",1)[0])),r&&(r=r[1].toLowerCase())),u.codecs(r)){n=e._src[o];break}}return n?(e._src=n,new i(e),e._webAudio&&s(e),e):void e._emit("loaderror")},play:function(e){var o=this,t=arguments,r=null;if("number"==typeof e)r=e,e=null;else if("undefined"==typeof e){e="__default";for(var d=0,a=0;a<o._sounds.length;a++)o._sounds[a]._paused&&!o._sounds[a]._ended&&(d++,r=o._sounds[a]._id);1===d?e=null:r=null}var i=r?o._soundById(r):o._inactiveSound();if(!i)return null;if(r&&!e&&(e=i._sprite||"__default"),!o._loaded&&!o._sprite[e])return o.once("load",function(){o.play(o._soundById(i._id)?i._id:void 0)}),i._id;if(r&&!i._paused)return i._id;var _=i._seek>0?i._seek:o._sprite[e][0]/1e3,s=(o._sprite[e][0]+o._sprite[e][1])/1e3-_,l=function(){var t=!(!i._loop&&!o._sprite[e][2]);o._emit("end",i._id),!o._webAudio&&t&&o.stop(i._id).play(i._id),o._webAudio&&t&&(o._emit("play",i._id),i._seek=i._start||0,i._playStart=n.currentTime,o._endTimers[i._id]=setTimeout(l,1e3*(i._stop-i._start)/Math.abs(o._rate))),o._webAudio&&!t&&(i._paused=!0,i._ended=!0,i._seek=i._start||0,o._clearTimer(i._id),i._node.bufferSource=null),o._webAudio||t||o.stop(i._id)};o._endTimers[i._id]=setTimeout(l,1e3*s/Math.abs(o._rate)),i._paused=!1,i._ended=!1,i._sprite=e,i._seek=_,i._start=o._sprite[e][0]/1e3,i._stop=(o._sprite[e][0]+o._sprite[e][1])/1e3,i._loop=!(!i._loop&&!o._sprite[e][2]);var f=i._node;if(o._webAudio){var c=function(){o._refreshBuffer(i);var e=i._muted||o._muted?0:i._volume*u.volume();f.gain.setValueAtTime(e,n.currentTime),i._playStart=n.currentTime,"undefined"==typeof f.bufferSource.start?i._loop?f.bufferSource.noteGrainOn(0,_,86400):f.bufferSource.noteGrainOn(0,_,s):i._loop?f.bufferSource.start(0,_,86400):f.bufferSource.start(0,_,s),o._endTimers[i._id]||(o._endTimers[i._id]=setTimeout(l,1e3*s/Math.abs(o._rate))),t[1]||setTimeout(function(){o._emit("play",i._id)},0)};o._loaded?c():(o.once("load",c),o._clearTimer(i._id))}else{var p=function(){f.currentTime=_,f.muted=i._muted||o._muted||u._muted||f.muted,f.volume=i._volume*u.volume(),f.playbackRate=o._rate,setTimeout(function(){f.play(),t[1]||o._emit("play",i._id)},0)};if(4===f.readyState||!f.readyState&&navigator.isCocoonJS)p();else{var m=function(){o._endTimers[i._id]=setTimeout(l,1e3*s/Math.abs(o._rate)),p(),f.removeEventListener("canplaythrough",m,!1)};f.addEventListener("canplaythrough",m,!1),o._clearTimer(i._id)}}return i._id},pause:function(e){var n=this;if(!n._loaded)return n.once("play",function(){n.pause(e)}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused){if(r._seek=n.seek(o[t]),r._paused=!0,n._webAudio){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),r._node.bufferSource=null}else isNaN(r._node.duration)||r._node.pause();arguments[1]||n._emit("pause",r._id)}}return n},stop:function(e){var n=this;if(!n._loaded)return"undefined"!=typeof n._sounds[0]._sprite&&n.once("play",function(){n.stop(e)}),n;for(var o=n._getSoundIds(e),t=0;t<o.length;t++){n._clearTimer(o[t]);var r=n._soundById(o[t]);if(r&&!r._paused)if(r._seek=r._start||0,r._paused=!0,r._ended=!0,n._webAudio&&r._node){if(!r._node.bufferSource)return n;"undefined"==typeof r._node.bufferSource.stop?r._node.bufferSource.noteOff(0):r._node.bufferSource.stop(0),r._node.bufferSource=null}else r._node&&!isNaN(r._node.duration)&&(r._node.pause(),r._node.currentTime=r._start||0)}return n},mute:function(e,o){var t=this;if(!t._loaded)return t.once("play",function(){t.mute(e,o)}),t;if("undefined"==typeof o){if("boolean"!=typeof e)return t._muted;t._muted=e}for(var r=t._getSoundIds(o),d=0;d<r.length;d++){var a=t._soundById(r[d]);a&&(a._muted=e,t._webAudio&&a._node?a._node.gain.setValueAtTime(e?0:a._volume*u.volume(),n.currentTime):a._node&&(a._node.muted=u._muted?!0:e))}return t},volume:function(){var e,o,t=this,r=arguments;if(0===r.length)return t._volume;if(1===r.length){var d=t._getSoundIds(),a=d.indexOf(r[0]);a>=0?o=parseInt(r[0],10):e=parseFloat(r[0])}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));var i;if(!("undefined"!=typeof e&&e>=0&&1>=e))return i=o?t._soundById(o):t._sounds[0],i?i._volume:0;if(!t._loaded)return t.once("play",function(){t.volume.apply(t,r)}),t;"undefined"==typeof o&&(t._volume=e),o=t._getSoundIds(o);for(var _=0;_<o.length;_++)i=t._soundById(o[_]),i&&(i._volume=e,t._webAudio&&i._node?i._node.gain.setValueAtTime(e*u.volume(),n.currentTime):i._node&&(i._node.volume=e*u.volume()));return t},fade:function(e,o,t,r){var d=this;if(!d._loaded)return d.once("play",function(){d.fade(e,o,t,r)}),d;d.volume(e,r);for(var u=d._getSoundIds(r),a=0;a<u.length;a++){var i=d._soundById(u[a]);if(i)if(d._webAudio){var _=n.currentTime,s=_+t/1e3;i._volume=e,i._node.gain.setValueAtTime(e,_),i._node.gain.linearRampToValueAtTime(o,s),setTimeout(function(e,t){setTimeout(function(){t._volume=o,d._emit("faded",e)},s-n.currentTime>0?Math.ceil(1e3*(s-n.currentTime)):0)}.bind(d,u[a],i),t)}else{var l=Math.abs(e-o),f=e>o?"out":"in",c=l/.01,p=t/c;!function(){var n=e,t=setInterval(function(e){n+="in"===f?.01:-.01,n=Math.max(0,n),n=Math.min(1,n),n=Math.round(100*n)/100,d.volume(n,e),n===o&&(clearInterval(t),d._emit("faded",e))}.bind(d,u[a]),p)}()}}return d},loop:function(){var e,n,o,t=this,r=arguments;if(0===r.length)return t._loop;if(1===r.length){if("boolean"!=typeof r[0])return o=t._soundById(parseInt(r[0],10)),o?o._loop:!1;e=r[0],t._loop=e}else 2===r.length&&(e=r[0],n=parseInt(r[1],10));for(var d=t._getSoundIds(n),u=0;u<d.length;u++)o=t._soundById(d[u]),o&&(o._loop=e,t._webAudio&&o._node&&(o._node.bufferSource.loop=e));return t},seek:function(){var e,o,t=this,r=arguments;if(0===r.length)o=t._sounds[0]._id;else if(1===r.length){var d=t._getSoundIds(),u=d.indexOf(r[0]);u>=0?o=parseInt(r[0],10):(o=t._sounds[0]._id,e=parseFloat(r[0]))}else 2===r.length&&(e=parseFloat(r[0]),o=parseInt(r[1],10));if("undefined"==typeof o)return t;if(!t._loaded)return t.once("load",function(){t.seek.apply(t,r)}),t;var a=t._soundById(o);if(a){if(!(e>=0))return t._webAudio?a._seek+t.playing(o)?n.currentTime-a._playStart:0:a._node.currentTime;var i=t.playing(o);i&&t.pause(o,!0),a._seek=e,t._clearTimer(o),i&&t.play(o,!0)}return t},playing:function(e){var n=this,o=n._soundById(e)||n._sounds[0];return o?!o._paused:!1},duration:function(){return this._duration},unload:function(){for(var e=this,n=e._sounds,o=0;o<n.length;o++){n[o]._paused||(e.stop(n[o]._id),e._emit("end",n[o]._id)),e._webAudio||(n[o]._node.src="",n[o]._node.removeEventListener("error",n[o]._errorFn,!1),n[o]._node.removeEventListener("canplaythrough",n[o]._loadFn,!1)),delete n[o]._node,e._clearTimer(n[o]._id);var t=u._howls.indexOf(e);t>=0&&u._howls.splice(t,1)}return _&&delete _[e._src],e=null,null},on:function(e,n,o){var t=this,r=t["_on"+e];return"function"==typeof n&&r.push({id:o,fn:n}),t},off:function(e,n,o){var t=this,r=t["_on"+e];if(n){for(var d=0;d<r.length;d++)if(n===r[d].fn&&o===r[d].id){r.splice(d,1);break}}else r=[];return t},once:function(e,n,o){var t=this,r=function(){n.apply(t,arguments),t.off(e,r,o)};return t.on(e,r,o),t},_emit:function(e,n,o){for(var t=this,r=t["_on"+e],d=0;d<r.length;d++)r[d].id&&r[d].id!==n||setTimeout(function(e){e.call(this,n,o)}.bind(t,r[d].fn),0);return t},_clearTimer:function(e){var n=this;return n._endTimers[e]&&(clearTimeout(n._endTimers[e]),delete n._endTimers[e]),n},_soundById:function(e){for(var n=this,o=0;o<n._sounds.length;o++)if(e===n._sounds[o]._id)return n._sounds[o];return null},_inactiveSound:function(){var e=this;e._drain();for(var n=0;n<e._sounds.length;n++)if(e._sounds[n]._ended)return e._sounds[n].reset();return new i(e)},_drain:function(){var e=this,n=e._pool,o=0,t=0;if(!(e._sounds.length<n)){for(t=0;t<e._sounds.length;t++)e._sounds[t]._ended&&o++;for(t=e._sounds.length-1;t>=0;t--){if(n>=o)return;e._sounds[t]._ended&&(e._webAudio&&e._sounds[t]._node&&e._sounds[t]._node.disconnect(0),e._sounds.splice(t,1),o--)}}},_getSoundIds:function(e){var n=this;if("undefined"==typeof e){for(var o=[],t=0;t<n._sounds.length;t++)o.push(n._sounds[t]._id);return o}return[e]},_refreshBuffer:function(e){var o=this;return e._node.bufferSource=n.createBufferSource(),e._node.bufferSource.buffer=_[o._src],e._node.bufferSource.connect(e._panner?e._panner:e._node),e._node.bufferSource.loop=e._loop,e._loop&&(e._node.bufferSource.loopStart=e._start||0,e._node.bufferSource.loopEnd=e._stop),e._node.bufferSource.playbackRate.value=o._rate,o}};var i=function(e){this._parent=e,this.init()};if(i.prototype={init:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._seek=0,e._paused=!0,e._ended=!0,e._id=Math.round(Date.now()*Math.random()),n._sounds.push(e),e.create(),e},create:function(){var e=this,o=e._parent,t=u._muted||e._muted||e._parent._muted?0:e._volume*u.volume();return o._webAudio?(e._node="undefined"==typeof n.createGain?n.createGainNode():n.createGain(),e._node.gain.setValueAtTime(t,n.currentTime),e._node.paused=!0,e._node.connect(r)):(e._node=new Audio,e._errorFn=e._errorListener.bind(e),e._node.addEventListener("error",e._errorFn,!1),e._loadFn=e._loadListener.bind(e),e._node.addEventListener("canplaythrough",e._loadFn,!1),e._node.src=o._src,e._node.preload="auto",e._node.volume=t,e._node.load()),e},reset:function(){var e=this,n=e._parent;return e._muted=n._muted,e._loop=n._loop,e._volume=n._volume,e._muted=n._muted,e._seek=0,e._paused=!0,e._ended=!0,e._sprite=null,e._id=Math.round(Date.now()*Math.random()),e},_errorListener:function(){var e=this;e._node.error&&4===e._node.error.code&&(u.noAudio=!0),e._parent._emit("loaderror",e._id,e._node.error?e._node.error.code:0),e._node.removeEventListener("error",e._errorListener,!1)},_loadListener:function(){var e=this,n=e._parent;n._duration=Math.ceil(10*e._node.duration)/10,0===Object.keys(n._sprite).length&&(n._sprite={__default:[0,1e3*n._duration]}),n._loaded||(n._loaded=!0,n._emit("load")),n._autoplay&&n.play(),e._node.removeEventListener("canplaythrough",e._loadFn,!1)}},o)var _={},s=function(e){var n=e._src;if(_[n])return e._duration=_[n].duration,void c(e);if(/^data:[^;]+;base64,/.test(n)){window.atob=window.atob||function(e){for(var n,o,t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",r=String(e).replace(/=+$/,""),d=0,u=0,a="";o=r.charAt(u++);~o&&(n=d%4?64*n+o:o,d++%4)?a+=String.fromCharCode(255&n>>(-2*d&6)):0)o=t.indexOf(o);return a};for(var o=atob(n.split(",")[1]),t=new Uint8Array(o.length),r=0;r<o.length;++r)t[r]=o.charCodeAt(r);f(t.buffer,e)}else{var d=new XMLHttpRequest;d.open("GET",n,!0),d.responseType="arraybuffer",d.onload=function(){f(d.response,e)},d.onerror=function(){e._webAudio&&(e._html5=!0,e._webAudio=!1,e._sounds=[],delete _[n],e.load())},l(d)}},l=function(e){try{e.send()}catch(n){e.onerror()}},f=function(e,o){n.decodeAudioData(e,function(e){e&&(_[o._src]=e,c(o,e))},function(){o._emit("loaderror")})},c=function(e,n){n&&!e._duration&&(e._duration=n.duration),0===Object.keys(e._sprite).length&&(e._sprite={__default:[0,1e3*e._duration]}),e._loaded||(e._loaded=!0,e._emit("load")),e._autoplay&&e.play()};"function"==typeof define&&define.amd&&define("howler",function(){return{Howler:u,Howl:a}}),"undefined"!=typeof exports&&(exports.Howler=u,exports.Howl=a),"undefined"!=typeof window&&(window.HowlerGlobal=d,window.Howler=u,window.Howl=a,window.Sound=i)}();