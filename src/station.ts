import * as utils from '@dcl/ecs-scene-utils'

let stationShape = new GLTFShape('models/tram station/tramStation.glb')
let stationWindowsShape = new GLTFShape(
  'models/tram station/tramStation_windows.glb'
)

let posterTexture = new Texture('images/image.png')
export let posterMaterial = new Material()
posterMaterial.albedoTexture = posterTexture
posterMaterial.roughness = 0.9
posterMaterial.metallic = 0


export let posterShape = new PlaneShape()
posterShape.isPointerBlocker = true

let bellSound = new AudioClip('sounds/train-bell.mp3')
bellSound.volume = 0.7
bellSound.loop = false

export enum RoadOrientation {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export class Station extends Entity {
  timer1: Entity
  timer2: Entity
  timer3: Entity
  timer4: Entity
  station2: Entity
  timer5: Entity
  timer6: Entity
  timer7: Entity
  timer8: Entity
  active: boolean
  arrivalTimes: number[] = []
  waitTime: number
  cycleTime: number
  poster1: Entity
  poster2: Entity
  poster3: Entity
  poster4: Entity
  constructor(
    transform: TransformConstructorArgs,
    Orientation: RoadOrientation,
    arrivalTimes: number[],
    waitTime: number,
    cycleTime: number
    //double?: boolean
  ) {
    super()
    this.addComponent(new Transform(transform))
    this.addComponent(stationShape)
    engine.addEntity(this)

    this.active = false
    this.arrivalTimes = arrivalTimes
    this.cycleTime = cycleTime
    this.waitTime = waitTime

    if (Orientation == RoadOrientation.horizontal) {
      this.getComponent(Transform).rotation = Quaternion.Euler(0, 270, 0)
      this.getComponent(Transform).position.z -= 5
    } else {
      this.getComponent(Transform).position.x -= 5
      //this.getComponent(Transform).rotation = Quaternion.Euler(0, 270, 0)
    }

    let windows = new Entity()
    windows.setParent(this)
    windows.addComponent(stationWindowsShape)
    windows.addComponent(new Transform())

    this.timer1 = new Entity()
    this.timer1.addComponent(new TextShape('COMING SOON'))
    this.timer1.getComponent(TextShape).fontSize = 3
    this.timer1.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, -6.5),
      })
    )
    this.timer1.setParent(this)

    this.addComponent(new AudioSource(bellSound))

    this.timer2 = new Entity()
    this.timer2.addComponent(new TextShape('COMING SOON'))
    this.timer2.getComponent(TextShape).fontSize = 3
    this.timer2.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, 6.5),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    this.timer2.setParent(this)

    this.timer3 = new Entity()
    this.timer3.addComponent(new TextShape('COMING SOON'))
    this.timer3.getComponent(TextShape).fontSize = 3
    this.timer3.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, -6.4),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    this.timer3.setParent(this)

    this.timer4 = new Entity()
    this.timer4.addComponent(new TextShape('COMING SOON'))
    this.timer4.getComponent(TextShape).fontSize = 3
    this.timer4.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, 6.4),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    )
    this.timer4.setParent(this)

    this.poster1 = new Entity()
    this.poster1.addComponent(posterShape)
    this.poster1.addComponent(
      new Transform({
        position: new Vector3(1.8, 2.97, 3.9),
        rotation: Quaternion.Euler(0, 90, 180),
        scale: new Vector3(1.3, 2.6, 0),
      })
    )
    this.poster1.addComponent(posterMaterial)
    this.poster1.setParent(this)
    engine.addEntity(this.poster1)

    // this.poster1.addComponent(new OnPointerDown(() => {}))

    this.poster2 = new Entity()
    this.poster2.addComponent(posterShape)
    this.poster2.addComponent(
      new Transform({
        position: new Vector3(1.8, 2.97, -3.92),
        rotation: Quaternion.Euler(0, 90, 180),
        scale: new Vector3(1.3, 2.6, 0),
      })
    )
    this.poster2.addComponent(posterMaterial)
    this.poster2.setParent(this)
    engine.addEntity(this.poster2)

    //if (double) {
    this.station2 = new Entity()
    this.station2.addComponent(
      new Transform({
        position: transform.position?.clone(),
        rotation: transform.rotation?.clone(),
        scale: transform.scale?.clone(),
      })
    )
    if (Orientation == RoadOrientation.horizontal) {
      this.station2.getComponent(Transform).rotation = Quaternion.Euler(
        0,
        90,
        0
      )
      this.station2.getComponent(Transform).position.z = 1.95
    } else {
      this.station2.getComponent(Transform).rotation = Quaternion.Euler(
        0,
        180,
        0
      )
      this.station2.getComponent(Transform).position.x = 2.95
    }

    this.station2.addComponent(stationShape)
    if (Orientation == RoadOrientation.horizontal) {
      this.station2.getComponent(Transform).position.z += 1
    }
    engine.addEntity(this.station2)

    this.station2.addComponent(new AudioSource(bellSound))

    let windows2 = new Entity()
    windows2.setParent(this.station2)
    windows2.addComponent(stationWindowsShape)
    windows2.addComponent(new Transform())

    this.timer5 = new Entity()
    this.timer5.addComponent(new TextShape('COMING SOON'))
    this.timer5.getComponent(TextShape).fontSize = 3
    this.timer5.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, -6.5),
      })
    )
    this.timer5.setParent(this.station2)

    this.timer6 = new Entity()
    this.timer6.addComponent(new TextShape('COMING SOON'))
    this.timer6.getComponent(TextShape).fontSize = 3
    this.timer6.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, 6.5),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    this.timer6.setParent(this.station2)

    this.timer7 = new Entity()
    this.timer7.addComponent(new TextShape('COMING SOON'))
    this.timer7.getComponent(TextShape).fontSize = 3
    this.timer7.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, -6.4),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )
    this.timer7.setParent(this.station2)

    this.timer8 = new Entity()
    this.timer8.addComponent(new TextShape('COMING SOON'))
    this.timer8.getComponent(TextShape).fontSize = 3
    this.timer8.addComponent(
      new Transform({
        position: new Vector3(0, 5.1, 6.4),
        rotation: Quaternion.Euler(0, 0, 0),
      })
    )
    this.timer8.setParent(this.station2)

    this.poster3 = new Entity()
    this.poster3.addComponent(posterShape)
    this.poster3.addComponent(posterMaterial)
    this.poster3.addComponent(
      new Transform({
        position: new Vector3(1.8, 2.97, 3.9),
        rotation: Quaternion.Euler(0, 90, 180),
        scale: new Vector3(1.3, 2.6, 0),
      })
    )
    this.poster3.setParent(this.station2)
    engine.addEntity(this.poster3)

    // this.poster1.addComponent(new OnPointerDown(() => {}))

    this.poster4 = new Entity()
    this.poster4.addComponent(posterShape)
    this.poster4.addComponent(posterMaterial)
    this.poster4.addComponent(
      new Transform({
        position: new Vector3(1.8, 2.97, -3.92),
        rotation: Quaternion.Euler(0, 90, 180),
        scale: new Vector3(1.3, 2.6, 0),
      })
    )
    this.poster4.setParent(this.station2)
    engine.addEntity(this.poster4)

    // }

    this.addComponent(
      new utils.TriggerComponent(
        new utils.TriggerBoxShape(new Vector3(80, 20, 80)),
        {
          onCameraEnter: () => {
            this.active = true
          },
          onCameraExit: () => {
            this.active = false
          },
        }
      )
    )

    // trigger area to turn on timers
  }

  updateTimers(time: number) {
    let timeLeft = this.arrivalTimes[0] - time
    if (timeLeft < 0) {
      timeLeft += this.cycleTime
    }
    if (this.arrivalTimes.length > 1) {
      if (this.arrivalTimes[1] - time < timeLeft) {
        timeLeft = this.arrivalTimes[1] - time
        if (timeLeft < 0) {
          timeLeft += this.cycleTime
        }
      }
    }

    if (timeLeft < this.waitTime) {
      this.timer1.getComponent(TextShape).fontSize = 3
      this.timer2.getComponent(TextShape).fontSize = 3
      this.timer3.getComponent(TextShape).fontSize = 3
      this.timer4.getComponent(TextShape).fontSize = 3

      this.timer1.getComponent(TextShape).value = 'DEPARTING'
      this.timer2.getComponent(TextShape).value = 'DEPARTING'
      this.timer3.getComponent(TextShape).value = 'DEPARTING'
      this.timer4.getComponent(TextShape).value = 'DEPARTING'

      if (timeLeft < 7 && Math.floor(timeLeft + 1) % 2 == 0) {
        this.getComponent(AudioSource).playOnce()
      }
    } else {
      let numberText = secondsToText(timeLeft)

      this.timer1.getComponent(TextShape).value = numberText
      this.timer2.getComponent(TextShape).value = numberText
      this.timer3.getComponent(TextShape).value = numberText
      this.timer4.getComponent(TextShape).value = numberText

      this.timer1.getComponent(TextShape).fontSize = 5
      this.timer2.getComponent(TextShape).fontSize = 5
      this.timer3.getComponent(TextShape).fontSize = 5
      this.timer4.getComponent(TextShape).fontSize = 5
    }

    if (this.station2) {
      let timeLeftTram2: number
      if (this.arrivalTimes.length > 1) {
        timeLeftTram2 = timeLeft
      } else {
        timeLeftTram2 = (timeLeft + this.cycleTime / 2) % this.cycleTime
      }

      if (timeLeftTram2 < this.waitTime) {
        this.timer5.getComponent(TextShape).fontSize = 3
        this.timer6.getComponent(TextShape).fontSize = 3
        this.timer7.getComponent(TextShape).fontSize = 3
        this.timer8.getComponent(TextShape).fontSize = 3

        this.timer5.getComponent(TextShape).value = 'DEPARTING'
        this.timer6.getComponent(TextShape).value = 'DEPARTING'
        this.timer7.getComponent(TextShape).value = 'DEPARTING'
        this.timer8.getComponent(TextShape).value = 'DEPARTING'

        if (timeLeftTram2 < 7 && Math.floor(timeLeftTram2 + 1) % 2 == 0) {
          this.station2.getComponent(AudioSource).playOnce()
        }
      } else {
        let numberText2 = secondsToText(timeLeftTram2)

        this.timer5.getComponent(TextShape).value = numberText2
        this.timer6.getComponent(TextShape).value = numberText2
        this.timer7.getComponent(TextShape).value = numberText2
        this.timer8.getComponent(TextShape).value = numberText2

        this.timer5.getComponent(TextShape).fontSize = 5
        this.timer6.getComponent(TextShape).fontSize = 5
        this.timer7.getComponent(TextShape).fontSize = 5
        this.timer8.getComponent(TextShape).fontSize = 5
      }
    }
  }
}

export function secondsToText(time: number) {
  let minutes = Math.floor(time / 60)
  let seconds = Math.floor(time % 60)
  let numberText = String(minutes) + ':' + String(seconds)
  if (seconds < 10) {
    numberText = String(minutes) + ':0' + String(seconds)
  }
  return numberText
}
