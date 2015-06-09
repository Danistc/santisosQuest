/**
 * Created by Jorge on 09/06/2015.
 */
(function(){

    // Initialize Phaser, and create a 400x490px game
    var game = new Phaser.Game(400, 490, Phaser.AUTO, 'gameDiv');

    // Create our 'main' state that will contain the game
    var mainState = {

        preload: function() {

            // Load the gay sprite
            game.load.image('bg', 'assets/bg.jpg');
            game.load.image('santisos', 'assets/santisos-player.png');
            game.load.image('pipe', 'assets/diamond.png');
        },

        create: function() {


            // Set the physics system
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.add.sprite(0, 0, 'bg');

            // Display the gay on the screen
            this.gay = this.game.add.sprite(0, 0, 'santisos');
            this.pipes = game.add.group(); // Create a group
            this.pipes.enableBody = true;  // Add physics to the group
            this.pipes.createMultiple(20, 'pipe'); // Create 20 pipes
            
            // Add gravity to the gay to make it fall
            game.physics.arcade.enable(this.gay);
            this.gay.body.gravity.y = 1000;

            // Call the 'jump' function when the spacekey is hit
            var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            spaceKey.onDown.add(this.jump, this);

            this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);


            this.score = 0;
            this.labelScore = game.add.text(20, 20, '0', { font: '30px Arial', fill: '#ffffff' });

        },

        update: function() {
            // If the gay is out of the world (too high or too low), call the 'restartGame' function
            if (this.gay.inWorld === false) {
                this.restart();
            }

            game.physics.arcade.overlap(this.gay, this.pipes, this.gayTime, null, this);
        },

        // Make the gay jump
        jump: function() {
            // Add a vertical velocity to the gay
            this.gay.body.velocity.y = -350;
        },

        gayTime: function() {
            var gayGroup = this.game.add.group();
            for (var i = 0; i < 10; i++) {
                var homo = this.game.add.sprite(this.game.world.randomX, this.game.world.randomY, 'santisos'); 
                gayGroup.add(homo);
            }

            game.time.events.add(Phaser.Timer.SECOND * 1, this.restart, this);            
        },
        
        // Restart the game
        restart: function(){
            // Start the 'main' state, which restarts the game
            game.state.start('main');
        },

        addOnePipe: function(x, y) {
            // Get the first dead pipe of our group
            var pipe = this.pipes.getFirstDead();

            // Set the new position of the pipe
            pipe.reset(x, y);

            // Add velocity to the pipe to make it move left
            pipe.body.velocity.x = -200;

            // Kill the pipe when it's no longer visible
            pipe.checkWorldBounds = true;
            pipe.outOfBoundsKill = true;

        },

        addRowOfPipes: function() {

            // Update score
            this.score += 1;
            this.labelScore.text = this.score;

            // Pick where the hole will be
            var hole = Math.floor(Math.random() * 5) + 1;

            // Add the 8 pipes
            for (var i = 0; i < 10; i++) {
                if (i !== hole && i !== hole + 1){
                    this.addOnePipe(400, i * 60 + 10);
                }
            }
        }
    };

    // Add and start the 'main' state to start the game
    game.state.add('main', mainState);
    game.state.start('main');

})();