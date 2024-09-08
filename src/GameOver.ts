import Phaser from "phaser";

export class GameOver extends Phaser.Scene {
  btn: Phaser.GameObjects.Sprite | undefined;
  constructor() {
    super("GameOver");
  }

  preload() {
    this.load.image("pub", "src/assets/bg.png");
    this.load.image("gameOverBtn", "src/assets/gameOverBtn.png");
    this.load.image("gameOver", "src/assets/gameOver.png");
  }

  create() {
    this.add.image(505, 284, "pub").setDisplaySize(1010, 568);
    this.add.image(505, 104, "gameOver");

    this.btn = this.add.sprite(500, 300, "gameOverBtn").setScale(0.5).setInteractive();

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
