import { RoadOrientation, Station } from './station'
import { Tram } from './tram'
import { CurveType, easingConverter } from './tween'

//function to call the API
export async function checkTime(): Promise<number> {
  let url = 'https://worldtimeapi.org/api/timezone/etc/gmt'

  try {
    let response = await fetch(url)
    log('GOT RESPONSE, ', response)
    let json = await response.json()
    log('JSON: ', json)
    let toDate = new Date(json.utc_datetime)
    log(toDate)

    let milliSeconds =
      toDate.getMinutes() * 60000 +
      toDate.getSeconds() * 1000 +
      toDate.getMilliseconds()

    //let seconds = (toDate.getMinutes() * 60 + toDate.getSeconds() ) * 1000

    return milliSeconds / 1000

    //return seconds
  } catch (e) {
    log('error getting time data ', e)
    let milliSeconds = Date.now()

    return milliSeconds / 1000
  }
}

type trackSegment = {
  id: number
  start: number
  end: number
  duration: number
}

export class TramSystem implements ISystem {
  //ready: boolean = false
  time: number = 0
  millisecondsTimer: number = 0
  cycleTime: number
  waitTime: number
  stationCount: number
  //segments: number
  timeInMotion: number
  tram1: Tram | null = null
  tram2: Tram | null = null
  distance: number
  orientation: RoadOrientation
  initialOffset: number = 16
  stations: Station[] = []
  segments: trackSegment[] = []
  timeOffset: number = 0
  async update(dt: number) {
    if (!this.tram1 || !this.tram2) return
    this.time += dt
    this.millisecondsTimer += dt

    let currentSegment = 0
    let extraPortion = 0
    let totalTime = 0

    for (let segment of this.segments) {
      totalTime += this.waitTime
      if (this.time < totalTime) {
        currentSegment = segment.id
        extraPortion = 0
        break
      }
      totalTime += segment.duration
      if (this.time < totalTime) {
        currentSegment = segment.id

        let proportion =
          (this.time - totalTime + segment.duration) / segment.duration
        extraPortion = easingConverter(proportion, CurveType.EASEINOUTQUADRATIC)
        break
      }
      if (this.time >= this.cycleTime) {
        this.time = 0
        currentSegment = 0
        extraPortion = 0
        break
      }
    }

    let segment = this.segments[currentSegment - 1]

    let distanceFromStart =
      segment.start + extraPortion * (segment.end - segment.start)

    if (extraPortion == 0) {
      this.tram1.stopSound()
      this.tram2.stopSound()
    } else {
      let volume = extraPortion - 0.5
      if (volume > 0) volume *= -1
      volume += 0.5
      this.tram1.startSound(volume)
      this.tram2.startSound(volume)
    }

    if (this.orientation == RoadOrientation.vertical) {
      this.tram1.getComponent(Transform).position.z = distanceFromStart
      this.tram2.getComponent(Transform).position.z =
        this.distance - distanceFromStart + this.initialOffset * 2
    } else {
      this.tram1.getComponent(Transform).position.x = distanceFromStart
      this.tram2.getComponent(Transform).position.x =
        this.distance - distanceFromStart + this.initialOffset * 2
    }

    if (this.millisecondsTimer > 1) {
      this.millisecondsTimer = 0
      for (let station of this.stations) {
        if (station.active) {
          station.updateTimers(this.time)
        }
      }
    }
  }
  constructor(
    cycleTime: number,
    waitTime: number,
    stations: number,
    orientation: RoadOrientation,
    parcelLength: number,
    timeOffset?: number
  ) {
    this.cycleTime = cycleTime
    this.waitTime = waitTime
    this.stationCount = stations
    //this.segments = (stations - 2) * 2 + 2
    this.timeInMotion = cycleTime - ((stations - 2) * 2 + 2) * this.waitTime //cycleTime - this.segments * this.waitTime
    this.distance = parcelLength * 16

    this.orientation = orientation
    if (timeOffset) {
      this.timeOffset = timeOffset
    }

    //this.activate()

    let station1Position: Vector3
    // let station2Position: Vector3
    let station3Position: Vector3

    if (this.orientation == RoadOrientation.horizontal) {
      station1Position = new Vector3(16, 0, 34.05)
      station3Position = new Vector3(16 + this.distance, 0, 34.05)
    } else {
      station1Position = new Vector3(34.05, 0, 16)
      station3Position = new Vector3(34.05, 0, 16 + this.distance)
    }

    let startStation = new Station(
      { position: station1Position },
      this.orientation,
      [0 + this.waitTime],
      this.waitTime,
      this.cycleTime
    )
    this.stations.push(startStation)

    for (let i = 2; i < this.stationCount; i++) {
      let middleStation = new Station(
        {
          position:
            this.orientation == RoadOrientation.horizontal
              ? new Vector3(
                  16 + this.distance / (this.stationCount - 1),
                  0,
                  34.05
                )
              : new Vector3(
                  34.05,
                  0,
                  16 + this.distance / (this.stationCount - 1)
                ),
        },
        this.orientation,
        [
          this.cycleTime / 4 + this.waitTime,
          (this.cycleTime / 4) * 3 + this.waitTime,
        ],
        this.waitTime,
        this.cycleTime
      )
      this.stations.push(middleStation)
    }

    let endStation = new Station(
      { position: station3Position },
      this.orientation,
      [this.cycleTime / 2 + this.waitTime],
      this.waitTime,
      this.cycleTime
    )
    this.stations.push(endStation)

    for (let k = 0; k < this.stations.length - 1; k++) {
      this.segments.push({
        id: k + 1,
        start:
          this.orientation == RoadOrientation.vertical
            ? this.stations[k].getComponent(Transform).position.z
            : this.stations[k].getComponent(Transform).position.x,
        end:
          this.orientation == RoadOrientation.vertical
            ? this.stations[k + 1].getComponent(Transform).position.z
            : this.stations[k + 1].getComponent(Transform).position.x,
        duration: this.timeInMotion / ((this.stations.length - 2) * 2 + 2),
      })
    }
    for (let l = this.stations.length - 1; l > 0; l--) {
      this.segments.push({
        id: this.segments.length + 1,
        start:
          this.orientation == RoadOrientation.vertical
            ? this.stations[l].getComponent(Transform).position.z
            : this.stations[l].getComponent(Transform).position.x,
        end:
          this.orientation == RoadOrientation.vertical
            ? this.stations[l - 1].getComponent(Transform).position.z
            : this.stations[l - 1].getComponent(Transform).position.x,
        duration: this.timeInMotion / ((this.stations.length - 2) * 2 + 2),
      })
    }

    log('SEGMENTS: ', this.segments)
  }
  addTrams() {
    let tram1Position: Vector3
    let tram2Position: Vector3

    if (this.orientation == RoadOrientation.horizontal) {
      tram1Position = new Vector3(16, 0, 22.5)
      tram2Position = new Vector3(16, 0, 9.5)
    } else {
      tram1Position = new Vector3(22.5, 0, 16)
      tram2Position = new Vector3(9.5, 0, 16)
    }

    this.tram1 = new Tram(
      {
        position: tram1Position,
      },
      this.orientation
    )

    this.tram2 = new Tram(
      {
        position: tram2Position,
      },
      this.orientation
    )

    //this.ready = true
  }
  async updateTime() {
    let currenTime = await checkTime()

    currenTime += this.timeOffset

    this.time = currenTime % this.cycleTime
  }
}

// Tram Logic:
// cylcle time 2 minutes
// 10 seconds waiting in each station
// 3 stations  -> 4 stops
// total moving time 120s - 4*10 = 80

//path:
// 10 s stopped
// 20 s moving to station 2
// 10 s stopped
// 20 s moving to station 3
// 10 s stopped
// 20 s moving to station 2
// 10 s stopped
// 20 s moving to station 1
