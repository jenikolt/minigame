import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    character: any;
    keySprite: any;
    player: any;
    bottles: any;
    brokenBottles: any;
    score: any;
    scoreText: any;
    missedBottles!: number | 0;
    missedBottleImages: any;
    bottleBreakSound: any;
    bottleCatchSound: any;
    floor: any;
    fillcup: any
    constructor() {
        super('GameScene');
    }
  
    init(data: any) {
        this.character = data.character;
        this.keySprite = `${this.character}_spritesheet`
    }
  
    preload() {
        this.load.image('pub', 'src/assets/bg.png');
        this.load.image('bottle', 'src/assets/pivo1.png');
        this.load.image('brokenBottle', 'src/assets/pivo5.png');
        this.load.image('greenBottle', 'src/assets/pivo2.png');
        this.load.image('blackBottle', 'src/assets/pivo3.png');
        this.load.image('redBottle', 'src/assets/pivo4.png');
        this.load.image('burger', 'src/assets/burger.png');
        this.load.audio('bottleBreak', 'src/assets/PullBottle.mp3');
        this.load.audio('bottleCatch', 'src/assets/PullOut.mp3');
        this.load.spritesheet(`${this.character}_spritesheet`, `src/assets/${this.character}_spritesheet.png`, { frameWidth: 211, frameHeight: 199 });
        this.load.spritesheet('fillcup', 'src/assets/fillcup.png', { frameWidth: 370, frameHeight: 595 });
    }
  
    setFillCup() {
      this.fillcup.setFrame(this.score > 14 ? 14 : this.score);
    }
  
    create() {
        this.add.image(505, 284, 'pub').setDisplaySize(1010, 568);
        this.score = 0;
        this.floor = this.physics.add.staticBody(0, 560, 1010, 8);
        this.fillcup = this.add.sprite(880, 350, 'fillcup').setScale(0.7);
        this.player = this.physics.add.sprite(400, 550, this.keySprite).setScale(0.7);
        this.player.setCollideWorldBounds(true);
  
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(this.keySprite, { start: 0, end: 3 }),
            frameRate: 10,
            yoyo: true,
            repeat: 1
        });
  
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers(this.keySprite, { start: 4, end: 7 }),
            frameRate: 10,
            yoyo: true,
            repeat: 1
        });
  
        this.bottles = this.physics.add.group();
        this.brokenBottles = this.add.group();
  
        this.time.addEvent({
            delay: Phaser.Math.Between(500, 1500),
            callback: this.dropBottle,
            callbackScope: this,
            loop: true
        });
  
        this.physics.add.overlap(this.player, this.bottles, this.collectBottle, undefined, this);
        this.physics.add.overlap(this.floor, this.bottles, this.bottleHitGround, undefined, this);
        
        this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#fff' });
  
        this.missedBottles = 0;
        this.missedBottleImages = [];
        for (let i = 0; i < 3; i++) {
            this.missedBottleImages.push(this.add.image(750 - i * 50, 50, 'burger').setScale(0.5));
        }
  
        this.input.on('pointermove', (pointer: { x: number; }) => {    
            if (this.player.x < pointer.x) {
                this.player.anims.play('right', this);
                // this.player.setFlipX(false);
            } else if (this.player.x > pointer.x) {
                this.player.anims.play('left', this);
                // this.player.setFlipX(true);
            }
            this.player.x = Phaser.Math.Clamp(pointer.x, 0, 800);
        });
  
        // Initialize sound with error handling
        try {
            this.bottleBreakSound = this.sound.add('bottleBreak');
            this.bottleCatchSound = this.sound.add('bottleCatch');
        } catch (error) {
            console.error('Error initializing sounds:', error);
            this.bottleBreakSound = null;
            this.bottleCatchSound = null;
        }
    }
  
    update() {
          // this.player.y = 540 + Math.sin(this.time.now / 200) * 2;
    }
  
    dropBottle() {
        const x = Phaser.Math.Between(0, 800);
        const bottleType = Math.random();
        let bottle;
  
  
        if (bottleType < 0.05) {
            bottle = this.bottles.create(x, 0, 'greenBottle');
            bottle.setData('type', 'victory');
        } else if (bottleType < 0.1) {
            bottle = this.bottles.create(x, 0, 'blackBottle');
            bottle.setData('type', 'loss');
        } else {
            bottle = this.bottles.create(x, 0, 'bottle');
            bottle.setData('type', 'normal');
        }
        const difficulty = this.score || 1;
  
        bottle.setScale(0.5);
        bottle.setVelocityY(Phaser.Math.Between(100, 200 * (difficulty / 2)));
        bottle.setAngularVelocity(Phaser.Math.Between(-100, 100));
    }
  
    collectBottle(_player: any, bottle: any) {
        bottle.disableBody(true, true);
        
        // Play sound with error handling
        if (this.bottleCatchSound) {
            try {
                this.bottleCatchSound.play();
            } catch (error) {
                console.error('Error playing bottleCatchSound:', error);
            }
        }
  
        if (bottle.getData('type') === 'victory') {
            this.endGame('You Win!');
        } else if (bottle.getData('type') === 'loss') {
            this.endGame('Game Over');
        } else {
            this.score++;
            this.scoreText.setText('Score: ' + this.score);
            this.setFillCup();
            if (this.score >= 14) {
              this.endGame('You Win!');
            }
        }
    }
  
    bottleHitGround(_player: any, bottle: any) {
        bottle.disableBody(true, true);
        
        // Play sound with error handling
        if (this.bottleBreakSound) {
            try {
                this.bottleBreakSound.play();
            } catch (error) {
                console.error('Error playing bottleBreakSound:', error);
            }
        }
  
        const brokenBottle = this.add.image(bottle.x, 560, 'brokenBottle').setScale(0.5);
        this.brokenBottles.add(brokenBottle);
  
        this.missedBottles++;
        if (this.missedBottles <= 3) {
            this.missedBottleImages[this.missedBottles - 1].setAlpha(0.2);
        }
  
        if (this.missedBottles >= 3) {
            this.endGame('Game Over');
        }
    }
  
    endGame(message: string | string[]) {
        this.time.removeAllEvents();
        this.physics.pause();
        this.add.text(400, 300, message, { fontSize: '64px', color: '#fff' }).setOrigin(0.5);
  
        this.time.delayedCall(10000, () => {
            this.cameras.main.fade(500, 0, 0, 0, false, (_camera: any, progress: number) => {
                if (progress === 1) {
                    this.scene.start('CharacterSelection');
                }
            });
        });
    }
  }