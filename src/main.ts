import './style.css'
import Phaser from 'phaser'
import { CharacterSelection } from './CharacterSelection'
import { GameScene } from './GameScene'

const config = {
  type: Phaser.AUTO,
  parent: 'renderDiv',
  width: 1010,
  height: 568,
  physics: {
      default: 'arcade',
      arcade: {
          gravity: { y: 600, x: 0 },
          debug: false
      }
  },
  scene: [CharacterSelection, GameScene]
};

new Phaser.Game(config);