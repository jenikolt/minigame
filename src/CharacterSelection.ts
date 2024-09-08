import Phaser from 'phaser'

export class CharacterSelection extends Phaser.Scene {
    constructor() {
        super('CharacterSelection');
    }
  
    preload() {
        this.load.image('pub', 'src/assets/bg.png');
        this.load.spritesheet('character1', 'src/assets/menu_character1.png', { frameWidth: 260, frameHeight: 274 });
        this.load.spritesheet('character2', 'src/assets/menu_character2.png', { frameWidth: 260, frameHeight: 265 });
        this.load.spritesheet('character3', 'src/assets/menu_character3.png', { frameWidth: 260, frameHeight: 282 });
        this.load.image('logo', 'src/assets/menu_logo.png');
        this.load.image('start_phrase', 'src/assets/menu_text_start.png');
    }
  
    create() {
        this.add.image(505, 284, 'pub').setDisplaySize(1010, 568);
        this.add.image(500, 100, 'logo').setScale(0.7);
        this.add.image(500, 500,'start_phrase');

        const characters = ['character1', 'character2', 'character3'];
        const spacing = 200;
        const startX = (1000 - (spacing * (characters.length - 1))) / 2;

        
        
  
        characters.forEach((character, index) => {
            this.anims.create({
                key: "idle"+character,
                frameRate: 7,
                frames: this.anims.generateFrameNumbers(character, { start: 0, end: 3 }),
                repeat: -1,
                delay: Phaser.Math.Between(0, 7) * 100,
            });
            const x = startX + (index * spacing);
            const characterSprite = this.add.sprite(x, 305, character).setInteractive();
            characterSprite.setScale(0.5);
            characterSprite.play('idle'+character)

            characterSprite.on('pointerover', () => {
                characterSprite.setScale(0.7)
                this.time.delayedCall(100, () => {
                    characterSprite.setScale(0.6)
                })
            })
            characterSprite.on('pointerout', () => {
                characterSprite.setScale(0.5)
            })
  
            characterSprite.on('pointerdown', () => {
                this.cameras.main.fade(500, 0, 0, 0, false, (_camera: unknown, progress: number) => {
                    if (progress === 1) {
                        this.scene.start('GameScene', { character: character });
                    }
                });
            });
        });
    }
  }