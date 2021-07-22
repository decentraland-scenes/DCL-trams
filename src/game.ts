import { addRoad, RoadType } from './roads'
import { checkTime, TramSystem } from './scheduler'
import { RoadOrientation } from './station'
import { setTramType, TranType } from './tram'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

let sceneOrientation: RoadOrientation = RoadOrientation.horizontal

let trackLength: number = 57

let stationCount: number = 3

let cycleTime: number = 250 //180 //(56 / 180) * trackLength

let exceptions: RoadType[] = []


exceptions[20] =RoadType.WROADBOTH1
exceptions[21] =RoadType.WROADBOTH2

exceptions[39] =RoadType.ROADRIGHT



exceptions[45] =RoadType.ROADRIGHT

setTramType(TranType.pop)

addRoad(trackLength + 2, sceneOrientation, exceptions)

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

// when scene finishes loading
onSceneReadyObservable.add(async () => {
  let currenTime = await checkTime()

  log('GOT CURRENT TIME ', currenTime)

  currenTime += tranSystem.timeOffset

  tranSystem.time = currenTime % tranSystem.cycleTime
  tranSystem.addTrams()
})



// posters are 13 x 26