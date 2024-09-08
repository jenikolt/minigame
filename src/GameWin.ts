import Phaser from "phaser";

export class GameWin extends Phaser.Scene {
  btn: Phaser.GameObjects.Sprite | undefined;
  nextMeme: Phaser.GameObjects.Sprite | undefined;
  currentMeme: Phaser.GameObjects.Image | undefined;

  constructor() {
    super("GameWin");
  }

  preload() {
    this.load.image("pub", "src/assets/bg.png");
    this.load.image("gameOverBtn", "src/assets/gameOverBtn.png");
    this.load.image("nextMeme", "src/assets/nextMeme.png");
    this.load.image("gameWin", "src/assets/gameWin.png");
    this.load.image("fox", "src/assets/fox.png");
    this.load.image("meme1", "src/assets/memes/meme1.png");
    this.load.image("meme2", "src/assets/memes/meme2.jpg");
    this.load.image("meme3", "src/assets/memes/meme3.jpg");
    this.load.image("meme4", "src/assets/memes/meme4.png");
    this.load.image("meme5", "src/assets/memes/meme5.png");
    this.load.image("meme6", "src/assets/memes/meme6.png");
    this.load.image("meme7", "src/assets/memes/meme7.png");
    this.load.image("meme8", "src/assets/memes/meme8.png");
    this.load.image("meme9", "src/assets/memes/meme9.png");
    this.load.image("meme10", "src/assets/memes/meme10.png");
    this.load.image("meme11", "src/assets/memes/meme11.jpg");
    this.load.image("meme12", "src/assets/memes/meme12.jpg");
    this.load.image("meme13", "src/assets/memes/meme13.jpg");
    this.load.image("meme14", "src/assets/memes/meme14.png");
    this.load.image("meme15", "src/assets/memes/meme15.jpg");
    this.load.image("meme16", "src/assets/memes/meme16.jpg");
    this.load.image("meme17", "src/assets/memes/meme17.jpg");
    this.load.image("meme18", "src/assets/memes/meme18.jpg");
    this.load.image("meme19", "src/assets/memes/meme19.png");
    this.load.image("meme20", "src/assets/memes/meme20.jpg");
    this.load.image("meme21", "src/assets/memes/meme21.png");
    this.load.image("meme22", "src/assets/memes/meme22.jpg");
    this.load.image("meme23", "src/assets/memes/meme23.jpg");
    this.load.image("meme24", "src/assets/memes/meme24.jpg");
  }

  create() {
    this.add.image(505, 284, "pub").setDisplaySize(1010, 568);
    this.add.image(505, 54, "gameWin").setDisplaySize(300, 50);

    let memeCount = 1;
    this.currentMeme = this.add.image(505, 304, 'meme1').setScale(0.3);

    this.btn = this.add.sprite(650, 540, "gameOverBtn").setScale(0.3).setInteractive();
    this.nextMeme = this.add.sprite(350, 540, "nextMeme").setScale(0.3).setInteractive();

    this.nextMeme.on("pointerdown", () => {
      if (this.currentMeme) {
        this.currentMeme.destroy();
      }
      if (memeCount === 24) {
        memeCount = 1;
      }
      memeCount++;

      const newMeme = "meme" + memeCount;
      this.currentMeme = this.add.image(505, 304, newMeme).setScale(0.3);
    });

    this.btn.on("pointerdown", () => {
      this.cameras.main.fade(
        500,
        0,
        0,
        0,
        false,
        (_camera: any, progress: any) => {
          if (progress === 1) {
            this.scene.start("CharacterSelection");
          }
        }
      );
    });
  }
}
