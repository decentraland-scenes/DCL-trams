import { addRoad, RoadType } from './roads'
import { checkTime, TramSystem } from './scheduler'
import { RoadOrientation } from './station'
import { setTramType, TranType } from './tram'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

let sceneOrientation: RoadOrientation = RoadOrientation.vertical

let trackLength: number = 56

let stationCount: number = 3

let cycleTime: number = 350 //180 //(56 / 180) * trackLength

let exceptions: RoadType[] = []

exceptions[56] = RoadType.ROADRIGHT

exceptions[53] = RoadType.ROADRIGHT

exceptions[50] = RoadType.ROADRIGHT

exceptions[47] = RoadType.ROADRIGHT

exceptions[20] = RoadType.WROADBOTH2
exceptions[19] = RoadType.WROADBOTH1
exceptions[13] = RoadType.ROADBOTH

exceptions[6] = RoadType.ROADBOTH

setTramType(TranType.forest)

// Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, true, (e) => {
//   if (e.hit) {
//     console.log(
//       'POS: ',
//       engine.entities[e.hit.entityId].getComponent(Transform)
//     )
//   }
// })

let tranSystem = new TramSystem(
  cycleTime,
  10,
  stationCount,
  sceneOrientation,
  trackLength
)

engine.addSystem(tranSystem)

addRoad(trackLength + 2, sceneOrientation, exceptions)

// when scene finishes loading
onSceneReadyObservable.add(async () => {
  let currenTime = await checkTime()

  log('GOT CURRENT TIME ', currenTime)

  currenTime += tranSystem.timeOffset

  tranSystem.time = currenTime % tranSystem.cycleTime
  tranSystem.addTrams()
})
