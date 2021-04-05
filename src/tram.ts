import { RoadOrientation } from './station'

let tramShape = new GLTFShape('models/trams/popart_tram.glb')
let tramWindowShape = new GLTFShape('models/trams/popart_windows.glb')

export class Tram extends Entity {
  orientation: RoadOrientation
  currentVol: number = 0
  constructor(
    transform: TransformConstructorArgs,
    orientation: RoadOrientation
  ) {
    super()
    this.addComponent(new Transform(transform))
    if (orientation == RoadOrientation.vertical) {
      this.getComponent(Transform).rotation = Quaternion.Euler(0, 90, 0)
    }
    this.addComponent(tramShape)
    engine.addEntity(this)

    this.orientation = orientation

    let trainSound = new AudioClip('sound/train.mp3')

    this.addComponent(new AudioSource(trainSound))
    //this.getComponent(AudioSource).playing = true
    this.getComponent(AudioSource).loop = true
    this.getComponent(AudioSource).volume = 0.1

    const popartWindowsGlb = new Entity('popartWindowsGlb')
    popartWindowsGlb.setParent(this)
    popartWindowsGlb.addComponent(new Transform())
    popartWindowsGlb.addComponent(tramWindowShape)
    engine.addEntity(popartWindowsGlb)
  }
  startSound(volume: number) {
    this.getComponent(AudioSource).playing = true
    if (Math.abs(this.currentVol - volume) > 0.1) {
      this.getComponent(AudioSource).volume = volume + 0.1
      this.currentVol = volume
    }
  }
  stopSound() {
    this.getComponent(AudioSource).playing = false
  }
}
