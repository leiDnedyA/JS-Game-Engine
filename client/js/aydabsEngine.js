console.log("aydabsEngine.js initiated");
//This is my first attempt at making a working game engine in JS, wish me luck

//This class will be used to store game objects, such as players, enemies, and environmental stuff
class GameObject{
  constructor(name/*String for name*/,color/*string containing hex value*/,position/*array of 2 ints*/,size/*array of 2 ints*/,nameTag/*bool to render nametag or not*/,id/*id based on server*/){
      this.name = name;
      this.color = color;
      this.position = position;
      this.size = size;
      this.nameTag = nameTag;
      this.id = id;
    }
  }

//Handles Rendering
var Graphics = {
    canvas: document.getElementById("gameCanvas"),
    startCanvas: function(){
      var canvas = Graphics.canvas;
      canvas.width = window.innerWidth - 20;
      canvas.height = window.innerHeight * .6;
      console.log("Canvas initialized" + canvas);
      },
    drawGraphics: function(worldObjects/*Takes array of gameObjects*/){
        var playerRendered = false;
        var canvas = this.canvas;
        var ctx = canvas.getContext("2d");
        canvas.width = window.innerWidth - 20;
        canvas.height = window.innerHeight * .6;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(i=0;i<worldObjects.length;i++){
          
          ctx.fillStyle = "#000000";
          var currentObj = worldObjects[i];
          if (currentObj.id != worldObjects[Player.playerObj].id || !playerRendered){
            if(currentObj.id == worldObjects[Player.playerObj].id){
              playerRendered = true;
            }
            if(currentObj.nameTag){
              if(currentObj.name.length > 10){
                ctx.fillText(currentObj.name.substr(0,9), currentObj.position[0], currentObj.position[1]+currentObj.size[1]+16);
              }else{
                ctx.fillText(currentObj.name, currentObj.position[0], currentObj.position[1]+currentObj.size[1]+16);
              }
            
            }
          ctx.fillStyle = currentObj.color;
          ctx.fillRect(currentObj.position[0], currentObj.position[1], currentObj.size[0], currentObj.size[1]);
          }
          //console.log(currentObj);
          
        }  
      }
  }

//Sets canvas size before Game is started
Graphics.canvas.width = window.innerWidth - 20;
Graphics.canvas.height = window.innerHeight * .6;

//Basically the Engine
var Game = {
  tickNumber: 0,
  tickTimer: null,
  tickSpeed: 50,
  isStarted: false,
  gameObjects: [],
  tick: function(){
      Game.tickNumber++;
      this.update();
      if (Game.tickNumber%10 === 0){
        //console.log(Game.tickNumber);
      
        }
      Graphics.drawGraphics(Game.gameObjects);
      Game.tickTimer = window.setTimeout(function(){Game.tick()}, this.tickSpeed);
    },
  update: function(){
      Player.update();
    },
  start: function(){
    this.isStarted = true;
    Graphics.startCanvas();
    Player.initialize();
    this.tick();
    }
  }

//Player Object
var Player = {
    playerObj : null,
    playerName: "",
    speed: 5,
    velocity: [0,0],
    id: 0,
    inputs: [false, false, false, false],
    movePlayer: function(){
        Game.gameObjects[this.playerObj].position[0]+=this.velocity[0]*this.speed;
        Game.gameObjects[this.playerObj].position[1]+=this.velocity[1]*this.speed;
        updatePlayerPos(Game.gameObjects[this.playerObj].position[0], Game.gameObjects[this.playerObj].position[1]);
        },
    update: function(){
      //set name
      Game.gameObjects[this.playerObj].name = this.playerName;
      //Movement
      this.inputs = getArrowKeys(this.inputs);
      //console.log(this.inputs);
        //detects movement on vertical axis
        if(this.inputs[0] || this.inputs[1]){
          if (this.inputs[0]){this.velocity[1]=-1}
          else{this.velocity[1]=1}
        }else{
          this.velocity[1]=0;
          }
        //detects movement on horizontal axis
        if(this.inputs[2] || this.inputs[3]){
          if (this.inputs[3]){this.velocity[0]=1}
          else{this.velocity[0]=-1}
        }else{
          this.velocity[0]=0;
          }
          
        //executes move player function
        this.movePlayer();
      },
    initialize: function(){
          this.playerObj = Game.gameObjects.length;
          Game.gameObjects.push(new GameObject("Player","#FF5733", [100, 10], [40, 40], true, this.id));
          console.log(Game.gameObjects[this.playerObj]);
        }
  
  }
  
  function getArrowKeys(keyz){
    let pressedKeys = keyz;
    window.onkeyup = function(e) { 
      
      
    
    }
    window.onkeydown = function(e) {
      switch(e.key){
        
        case "ArrowUp":
          pressedKeys[0] = true;
          break;
        case "ArrowDown":
          pressedKeys[1] = true;
          break;
        case "ArrowLeft":
          pressedKeys[2] = true;
          break;
        case "ArrowRight":
          pressedKeys[3] = true;
          break;
        
        default:
          break;
        
        }
      }
    window.onkeyup = function(e) {
      switch(e.key){
        
        case "ArrowUp":
          pressedKeys[0] = false;
          break;
        case "ArrowDown":
          pressedKeys[1] = false;
          break;
        case "ArrowLeft":
          pressedKeys[2] = false;
          break;
        case "ArrowRight":
          pressedKeys[3] = false;
          break;
        
        default:
          break;
        
        }
        }
    return pressedKeys;
    }

function setPlayerName(name){
  Player.playerName = name;
  }

function gameObjectExists(name){
  for(i in Game.gameObjects){
    //console.log(Game.gameObjects[i].name);
    if (Game.gameObjects[i].name == name){
      return true;
    }
  }

    return false;
}

function gameObjectExistsId(id){
  for(i in Game.gameObjects){
    //console.log(Game.gameObjects[i].name);
    if (Game.gameObjects[i].id == id){
      return true;
    }
  }

    return false;
}

function gameObjectLookUp(id){
  for(i in Game.gameObjects){
    if (Game.gameObjects[i].id == id){
      return i;
    }
  }
    return -1;
}

//Game.start();