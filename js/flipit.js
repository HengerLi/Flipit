/**
 * @author Ethan Heilman, Henger Li
 *
 **/


/**
 * Creates a new FlipItGame Object for playing 'flip it'.
 *
 * new FlipItGame( new FlipItRenderEngine, funct, funct, funct(num x, num y) )
 *
 * @param renderer  an object which draws the game.
 * @param playerX   a player function which decides when player X is to flip.
 * @param playerY   a player function which decides when player Y is to flip.
 * @param scoreBoardFunct function to draw scores, blank if no score board.
 *
 **/
function FlipItGame( renderer, playerX, playerY, scoreBoardFunct) {
  
  var xControlBenefit = 1;
  var yControlBenefit = 1;
  var xFlipCost = 100;
  var yFlipCost = 100;
  
  /**
   * Clears and refreshes all the varables to start a new game.
   **/
  this.newGame = function(){
    clearInterval( this.clock );

    this.running = false;
    
    this.ticks = 0;
    this.control = "X";
    this.flips = [];
	
    this.xScore = 0;
    this.yScore = 0;
	
    this.markD = [0];
    this.markA = [];
	
    this.results = "";
	this.last_state;
	this.current_state = 0;
	//this.last_control = "x";


    renderer.drawBoard( 0, [] );
  }


  /** 
   * Start a game.
   *
   * this.start( int, int )
   *
   * @param msPerTick number of milliseconds per tick or turn of the game.
   * @param numTicks  length of game in ticks/turns.
   *
   **/
  this.start = function( msPerTick, numTicks ) {
    this.newGame();

    if (this.running == false ){
	  //alert(this.markD);
	  this.running = true;

      renderer.newBoard();

      var self = this; //Save the current context
      this.clock = setInterval( function(){ self.tick( numTicks ); }, msPerTick);
    }
  };

  /**
   * Ends the current game.
   **/
  this.endGame = function() {
    clearInterval( this.clock );
    this.running = false;
	this.results = this.markD.join();
	alert('Your history moving time track：' + this.markD +'\n'+ 'You have been attacked at: '+ this.markA);
    if ( scoreBoardFunct != null ) scoreBoardFunct( this.xScore, this.yScore );
	
	
	
  };

  /**
   * The main game loop. End turn/tick this runs.
   *
   * this.tick( int )
   *
   * @param numTicks  length of game in ticks/turns.
   *
   **/
  this.tick = function( numTicks ) {
    if( this.ticks >= numTicks ) {
      this.endGame();
      return;
    } 
    
    this.ticks += 1;

    if ( this.control == "X" ) this.xScore += xControlBenefit;
    if ( this.control == "Y" ) this.yScore += yControlBenefit;

    //if a human is playing a player function is set to neverMove()
    if( playerX( this.ticks ) ){ this.defenderFlip() }; //player x makes their move
    if( playerY( this.ticks, this.markD, this.control, this.yScore, yFlipCost ) ){ this.attackerFlip() };
	//if( playerY( this.ticks ) ){ this.attackerFlip() };	//player y makes their move
    
    //only draw every fifth frame
    if ( this.ticks % 5 == 0 ) renderer.drawBoard( this.ticks, this.flips );
  };

  /**
   * When the defender, player x, flips call this function. 
   **/
  this.defenderFlip = function(dis, state) {
    
	
	this.last_state = this.current_state;
	this.current_state = state;
	
	if (this.running == true && this.current_state != this.last_state) {
      
	  //alert(this.last_state);
	  //alert(this.current_state);
      //if(this.current_state != this.last_state){
		  
	  this.flips[this.ticks] = "X";
	  this.control = "X";
		  //this.last_control = "x";
	  //}
	  //this.flips[this.ticks] = this.control;
	  //alert(this.control);
	  
      this.xScore -= dis*xFlipCost;
	  this.yScore -= yFlipCost;
	  //this.result = this.ticks;
	  this.markD.push(this.ticks);
	  alert('Your history moving time track：' + this.markD +'\n'+ 'You have been attacked at: '+ this.markA);
	 
    }
  };

  /**
   * When the attacker, player y, flips call this function. 
   **/
  this.attackerFlip = function(){
    if (this.running == true) {
      this.flips[this.ticks] = "Y";
      this.control = "Y";
	  //if(this.last_control == "X") 
	  
	  this.markA.push(this.ticks);
	  
    }
  }
  
};

function getNumberInNormalDistribution(mean,std_dev){
    return mean+(randomNormalDistribution()*std_dev);
}

function randomNormalDistribution(){
    var u=0.0, v=0.0, w=0.0, c=0.0;
    do{
        u=Math.random()*2-1.0;
        v=Math.random()*2-1.0;
        w=u*u+v*v;
    }while(w==0.0||w>=1.0)

    c=Math.sqrt((-2*Math.log(w))/w);
    //return [u*c,v*c];
    return u*c;
}
function randomExponential(rate){
  // Default to Math.random()
  
  var rE = -Math.log(Math.random())/rate;  
  //alert(rE);
 

  return rE;
}

// Computer players
var Players = { 
  "humanPlayer":function( ticks ){ return false; }, 
  "randomPlayer":function( ticks ){ if(ticks % 79 == 0) return Math.random(ticks) < 0.3; },
  "periodicPlayer":function( ticks ){ return ticks % 200 == 0; },
  "impatientAttacker":function( ticks, markD, control)
   { 
	var s = markD[markD.length-1];
	
	var t= s + Math.round(randomExponential(0.005));
	if(control == "X")
	{
		return ticks == t;
	}
   }
  };




