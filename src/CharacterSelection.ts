import Phaser from 'phaser'

export class CharacterSelection extends Phaser.Scene {
    constructor() {
        super('CharacterSelection');
    }
  
    preload() {
        this.load.image('pub', 'src/assets/bg.png');
        this.load.image('character1', 'src/assets/character1.png');
        this.load.image('character2', 'src/assets/character2.png');
        this.load.image('character3', 'src/assets/character3.png');
    }
  
    create() {
        this.add.image(505, 284, 'pub').setDisplaySize(1010, 568);
        const characters = ['character1', 'character2', 'character3'];
        const spacing = 200;
        const startX = (800 - (spacing * (characters.length - 1))) / 2;
  
        this.add.text(180, 350, 'Танк', { fontSize: '24px', color: '#fff' });
        this.add.text(340, 350, 'Пехотинец', { fontSize: '24px', color: '#fff' });
        this.add.text(560, 350, 'Козырь', { fontSize: '24px', color: '#fff' });
        
  
        characters.forEach((character, index) => {
            const x = startX + (index * spacing);
            const characterSprite = this.add.image(x, 300, character).setInteractive();
            characterSprite.setScale(0.5);
  
            characterSprite.on('pointerdown', () => {
                this.cameras.main.fade(500, 0, 0, 0, false, (_camera: any, progress: any) => {
                    if (progress === 1) {
                        this.scene.start('GameScene', { character: character });
                    }
                });
            });
        });
    }
  }