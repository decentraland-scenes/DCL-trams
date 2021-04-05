import { TramSystem } from './scheduler'
import { posterMaterial, posterShape, RoadOrientation } from './station'

let tileShape = new GLTFShape('models/roads/road_openRoad.glb')
let singleCornerShape = new GLTFShape('models/roads/road_openOneCorner.glb')
let doubleCornerShape = new GLTFShape('models/roads/road_twoCorner.glb')

let lampShape = new GLTFShape('models/lights/streetlight.glb')
let lampBannerShape = new GLTFShape('models/lights/streetlight_banner.glb')

export enum RoadType {
  NORMAL = 'road_OpenRoad.glb',
  ROADLEFT = 'rleft',
  ROADRIGHT = 'rright',
  ROADBOTH = 'both',
  WROADLEFT1 = 'wrl1',
  WROADLEFT2 = 'wrl2',
  WROADRIGHT1 = 'wrr1',
  WROADRIGHT2 = 'wrr2',
  WROADBOTH1 = 'wrb1',
  WROADBOTH2 = 'wrb2',
  STATION = 'station',
}

let yaXis = new Vector3(0, 1, 0)

// export let exceptions: Record<string, RoadType> = {}

// exceptions[]

//export type ExceptionList = {index: number, type: RoadType}

//	OPENCORNER = 'road_openOneCorner.glb',
//	TWOCORNERS = 'road_twoCorner.glb',

export function addRoad(
  length: number,
  orientation: RoadOrientation,
  exceptions?: RoadType[]
) {
  for (let i = 1; i <= 2; i++) {
    for (let j = 1; j <= length; j++) {
      let tile = new Entity()

      tile.addComponent(
        new Transform({
          position: new Vector3(
            orientation == RoadOrientation.vertical ? i * 16 - 8 : j * 16 - 8,
            0,
            orientation == RoadOrientation.vertical ? j * 16 - 8 : i * 16 - 8
          ),
          rotation:
            orientation == RoadOrientation.vertical
              ? i == 1
                ? Quaternion.Euler(0, 180, 0)
                : Quaternion.Zero()
              : i == 1
              ? Quaternion.Euler(0, 90, 0)
              : Quaternion.Euler(0, 270, 0),
        })
      )

      if (exceptions && exceptions[j] != undefined) {
        switch (exceptions[j]) {
          case RoadType.ROADLEFT:
            if (i == 1) {
              tile.addComponent(doubleCornerShape)
            } else {
              tile.addComponent(tileShape)
            }
            break
          case RoadType.ROADRIGHT:
            if (i == 2) {
              tile.addComponent(doubleCornerShape)
            } else {
              tile.addComponent(tileShape)
            }
            break
          case RoadType.ROADBOTH:
            tile.addComponent(doubleCornerShape)
            break
          case RoadType.WROADLEFT1:
            if (i == 1) {
              tile.addComponent(singleCornerShape)
              if (orientation == RoadOrientation.horizontal) {
                tile.getComponent(Transform).rotation = Quaternion.Euler(
                  0,
                  180,
                  0
                )
              }
            } else {
              tile.addComponent(tileShape)
            }
            break
          case RoadType.WROADLEFT2:
            if (i == 1) {
              tile.addComponent(singleCornerShape)

              if (orientation == RoadOrientation.vertical) {
                tile.getComponent(Transform).rotate(yaXis, 90)
              }
            } else {
              tile.addComponent(tileShape)
            }
            break
          case RoadType.WROADRIGHT1:
            if (i == 2) {
              tile.addComponent(singleCornerShape)
              if (orientation == RoadOrientation.vertical) {
                tile.getComponent(Transform).rotation = Quaternion.Euler(
                  0,
                  90,
                  0
                )
              } else {
                tile.getComponent(Transform).rotation = Quaternion.Euler(
                  0,
                  270,
                  0
                )
              }
            } else {
              tile.addComponent(tileShape)
            }
            break
          case RoadType.WROADRIGHT2:
            if (i == 2) {
              tile.addComponent(singleCornerShape)
              if (orientation == RoadOrientation.horizontal) {
                tile.getComponent(Transform).rotate(yaXis, 90)
              }
            } else {
              tile.addComponent(tileShape)
            }
            break
          case RoadType.WROADBOTH1:
            tile.addComponent(singleCornerShape)
            if (i == 2) {
              if (orientation == RoadOrientation.vertical) {
                tile.getComponent(Transform).rotation = Quaternion.Euler(
                  0,
                  90,
                  0
                )
              } else {
                tile.getComponent(Transform).rotation = Quaternion.Euler(
                  0,
                  270,
                  0
                )
              }
            } else if (orientation == RoadOrientation.horizontal) {
              tile.getComponent(Transform).rotation = Quaternion.Euler(
                0,
                180,
                0
              )
            }
            break
          case RoadType.WROADBOTH2:
            tile.addComponent(singleCornerShape)
            if (i == 1) {
              if (orientation == RoadOrientation.vertical) {
                tile.getComponent(Transform).rotate(yaXis, 90)
              }
            } else if (orientation == RoadOrientation.horizontal) {
              tile.getComponent(Transform).rotate(yaXis, 90)
            }
            break
          case RoadType.STATION:
            tile.addComponent(tileShape)
            break
        }
      } else {
        // normal tile
        tile.addComponent(tileShape)

        // lights
        if (j % 5 == 0 || i % 5 == 0) {
          let lamp = new Entity()
          lamp.addComponent(
            new Transform({
              position: new Vector3(5.5, 0, 6),
            })
          )
          lamp.addComponent(lampShape)
          lamp.setParent(tile)

          if (j % 10 == 0 || i % 10 == 0) {
            let bannerPost = new Entity()
            bannerPost.addComponent(
              new Transform({
                scale: new Vector3(0.85, 1, 1),
                //position: new Vector3(5.5, 0, 6),
              })
            )
            bannerPost.addComponent(lampBannerShape)
            bannerPost.setParent(lamp)

            let banner = new Entity()
            banner.addComponent(
              new Transform({
                scale: new Vector3(2.6 * 0.85, 5.2 * 0.85, 0),
                position: new Vector3(1.25, 6.7, 0),
                rotation: Quaternion.Euler(0, 0, 180),
              })
            )
            banner.addComponent(posterShape)
            banner.addComponent(posterMaterial)
            banner.setParent(lamp)
          }
        }
      }

      engine.addEntity(tile)
    }
  }
}
