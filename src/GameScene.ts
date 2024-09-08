import Phaser from 'phaser'

export class GameScene extends Phaser.Scene {
    character: any;
    progress: any;
    keySprite: any;
    player: any;
    bottles: any;
    brokenBottles: any;
    score: any;
    missedBottles!: number | 0;
    missedBottleImages: any;
    bottleBreakSound: any;
    bottleCatchSound: any;
    floor: any;
    fillcup: any;
    igor: Phaser.Sound.BaseSound | undefined;
    constructor() {
        super('GameScene');
    }
  
    init(data: any) {
        this.character = data.character;
        this.keySprite = `${this.character}_spritesheet`
    }
  
    preload() {
        this.load.image('pub', 'src/assets/bg.png');
        this.load.image('bottle_normal', 'src/assets/pivo1.png');
        this.load.image('brokenBottle', 'src/assets/pivo5.png');
        this.load.image('brokenBottleBlazer', 'src/assets/crushedblazer.png');
        this.load.image('bottle_loss', 'src/assets/blazer_.png');
        this.load.image('burger', 'src/assets/burger.png');
        this.load.audio('bottleBreak', 'src/assets/pivoSlom.mp3');
        this.load.audio('bottleCatch', 'src/assets/pivoNaliv.mp3');
        this.load.audio('igornikolaev', 'src/assets/igornikolaev.mp3');
        this.load.spritesheet( this.keySprite, `src/assets/${this.keySprite}.png`, { frameWidth: 211, frameHeight: 199 });
        this.load.spritesheet('fillcup', 'src/assets/fillcup.png', { frameWidth: 370, frameHeight: 595 });
        this.load.image('progress', 'src/assets/progress.png');
    }
  
    setFillCup() {
      this.fillcup.setFrame(this.score > 14 ? 14 : this.score);
    }
  
    create() {
        this.igor = this.sound.add('igornikolaev').setVolume(0.2);
        if (this.character === 'character3') {
            this.igor.play();
        }
        this.add.image(505, 284, 'pub').setDisplaySize(1010, 568);
        this.score = 0;
        this.floor = this.physics.add.staticBody(0, 560, 1010, 8);
        this.fillcup = this.add.sprite(900, 200, 'fillcup').setScale(0.3);
        this.progress = this.add.image(900, 300, 'progress').setScale(0.4);
        this.player = this.physics.add.sprite(400, 550, this.keySprite).setScale(0.7);
        this.player.setCollideWorldBounds(true);
  
        this.anims.create({
            key: 'turn'+this.keySprite,
            frames: this.anims.generateFrameNumbers(this.keySprite, { start: 0, end: 3 }),
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
        this.time.addEvent({
            delay: Phaser.Math.Between(1500, 3500),
            callback: this.dropBottle,
            callbackScope: this,
            loop: true
        });
  
        this.physics.add.overlap(this.player, this.bottles, this.collectBottle, undefined, this);
        this.physics.add.overlap(this.floor, this.bottles, this.bottleHitGround, undefined, this);
  
        this.missedBottles = 0;
        this.missedBottleImages = [];
        for (let i = 0; i < 3; i++) {
            this.missedBottleImages.push(this.add.image(50, 250 - i * 50, 'burger').setScale(0.5));
        }
  
        this.input.on('pointermove', (pointer: { x: number; }) => {    
            if (this.player.x < pointer.x) {
                this.player.anims.play('turn'+this.keySprite, this);
                this.player.setFlipX(false);
            } else {
                this.player.anims.play('turn'+this.keySprite, this);
                this.player.setFlipX(true);
            }
            this.player.x = Phaser.Math.Clamp(pointer.x, 0, 800);
        });
  
        try {
            this.bottleBreakSound = this.sound.add('bottleBreak');
            this.bottleCatchSound = this.sound.add('bottleCatch');
        } catch (error) {
            console.error('Error initializing sounds:', error);
            this.bottleBreakSound = null;
            this.bottleCatchSound = null;
        }
    }
  
    dropBottle() {
        const x = Phaser.Math.Between(0, 800);
        const bottleType = Math.random();
        let bottle;
  
        const typebottle = bottleType < 0.1 ? 'bottle_loss' : 'bottle_normal';
  
        bottle = this.bottles.create(x, 0, typebottle);
        bottle.setData('type', typebottle);
        
        const difficulty = this.score || 1;
  
        bottle.setScale(0.5);
        bottle.setVelocityY(Phaser.Math.Between(100, 200 * (difficulty / 2)));
        bottle.setAngularVelocity(Phaser.Math.Between(-100, 100));
    }
  
    collectBottle(_player: any, bottle: any) {
        bottle.disableBody(true, true);
        
        if (this.bottleCatchSound) {
            try {
                this.bottleCatchSound.play();
            } catch (error) {
                console.error('Error playing bottleCatchSound:', error);
            }
        }
  
        if (bottle.getData('type') === 'bottle_loss') {
            this.endGame('loss');
        } else {
            this.score++;
            this.setFillCup();
            if (this.score >= 14) {
              this.endGame('win');
            }
        }
    }
  
    bottleHitGround(_player: any, bottle: any) {
        bottle.disableBody(true, true);
        
        if (this.bottleBreakSound) {
            try {
                this.bottleBreakSound.play();
            } catch (error) {
                console.error('Error playing bottleBreakSound:', error);
            }
        }

        const brokenBottleType = bottle.getData('type') === 'bottle_loss' ? 'brokenBottleBlazer' : 'brokenBottle';
        const brokenBottle = this.add.image(bottle.x, 560, brokenBottleType).setScale(0.5).setAngle(Phaser.Math.Between(0, 180));    
        this.brokenBottles.add(brokenBottle);
  
        if (bottle.getData('type') !== 'bottle_loss') {
            this.missedBottles++;
            if (this.missedBottles <= 3) {
                this.missedBottleImages[this.missedBottles - 1].setAlpha(0.2);
            }
        }
        
        if (this.missedBottles >= 3) {
            this.endGame('loss');
        }
    }
  
    endGame(message: 'loss' | 'win') {
        this.time.removeAllEvents();
        this.physics.pause();
        this.igor?.stop();

        if (message === 'loss') {
            this.cameras.main.fade(300, 0, 0, 0, false, (_camera: any, progress: number) => {
                if (progress === 1) {
                    this.scene.start('GameOver');
                }
            });
        }

        if (message === 'win') {
            this.cameras.main.fade(300, 0, 0, 0, false, (_camera: any, progress: number) => {
                if (progress === 1) {
                    this.scene.start('GameWin');
                }
            });
        }
    }
  }