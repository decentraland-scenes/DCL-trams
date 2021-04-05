import { addRoad, RoadType } from './roads'
import { TramSystem } from './scheduler'
import { RoadOrientation } from './station'
import { setTramType, TranType } from './tram'

Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, false, (e) => {
  log(`pos: `, Camera.instance.position)
  log(`rot: `, Camera.instance.rotation)
})

let sceneOrientation: RoadOrientation = RoadOrientation.vertical

let exceptions: RoadType[] = []

exceptions[8] = RoadType.ROADBOTH

exceptions[15] = RoadType.ROADBOTH
exceptions[11] = RoadType.WROADRIGHT2

exceptions[21] = RoadType.WROADBOTH1
exceptions[22] = RoadType.WROADBOTH2

exceptions[32] = RoadType.STATION
exceptions[33] = RoadType.STATION
exceptions[34] = RoadType.STATION

exceptions[50] = RoadType.ROADRIGHT
exceptions[53] = RoadType.ROADRIGHT
exceptions[56] = RoadType.ROADRIGHT
exceptions[59] = RoadType.ROADRIGHT

setTramType(TranType.forest)

addRoad(58, sceneOrientation, exceptions)

// Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, true, (e) => {
//   if (e.hit) {
//     console.log(
//       'POS: ',
//       engine.entities[e.hit.entityId].getComponent(Transform)
//     )
//   }
// })

engine.addSystem(new TramSystem(180, 10, 3, sceneOrientation, 56))
