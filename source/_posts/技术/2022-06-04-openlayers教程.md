---
title: 分享一些openlayers地图框架的demo(vue + openlayers6)

date: 2022-06-04 10:30
articlePath: 2022-06-04-openlayers-demo
categories: 
  - 技术
toc: false
tags:
  - openlayers
  - 地图

---

最近使用openlayers v6开发了一个GIS项目，功能都是基于官方文档和示例代码实现的，关于openlayers6，能搜到的中文内容并不多，都是一些很基础的使用，现在分享一些更详细的demo，希望能帮到有需要的人。


功能实现了这些：

- 根据已有坐标绘制标记、线段、多边形。
- 手动在地图上添加标记、线段、多边形，并获取坐标。
- 动态改变地图标记物样式、文字。
- 单击地图标记物弹出popup窗口、地图标记物右键菜单。
- 根据websocket推送数据改变标记位置。
- 历史轨迹功能、轨迹动画功能。
- 图层切换功能。


动图演示：


![](https://images.liyangzone.com/article_img/技术相关/openlayers.gif)



示例代码：

初始化地图

```js

import Map from "ol/Map"
import View from "ol/View"
import XYZ from 'ol/source/XYZ'
import {OSM, Vector as VectorSource} from "ol/source"
import {Tile as TileLayer, Vector as VectorLayer} from "ol/layer"
initMap() {
  this.arcgisMapSource = new XYZ({
    ratio: 1,
    params: {
      isBaseLayer: true,
      visibility: true,
      projection: 'EPSG:3857',
      format: "image/png"
    },
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
  })
  this.baseLayer = new TileLayer({
    source: this.arcgisMapSource
  })

  this.mapData = new Map({
    layers: [
      this.baseLayer,
    ],
    target: "map",
    view: new View({
      center: fromLonLat([121.49309680, 31.18520803]),
      zoom: 10,
      maxZoom: 20,
    })
  });
}

```

根据已有坐标绘制图形，这里我绘制了两个标记，一个用png图片，一个用svg图片，使用svg的话有个坑就是svg里面如果有#fff这样的颜色值，需要escape转义一下，或者把颜色值改为rgb(x,x,x)这样的

```js

/*根据已有坐标绘制点*/
    drawMarker() {
      // 
      let iconFeature = new Feature({
        geometry: new Point(fromLonLat([121.49309680, 31.18520803])),
        name: '标记1 svg', // name和type是我自己加的属性，也可以用别的
        type: 'marker',
      })
      let iconStyle = new Style({
        text: new Text({
          font: '16px sans-serif ',
          text: '标记1',
          offsetY: 25,
          fill: new Fill({
            color: '#FF0000'
          }),
        }),
        image: new Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          // src: 'data:image/svg+xml;utf8,' + markerSvg, // 无需转义的svg
          src: 'data:image/svg+xml;utf8,' + escape(markerSvg),
          imgSize: [32, 32],
          rotateWithView: true,
        }),
      })
      iconFeature.setStyle(iconStyle)
      this.areaVectorSource.addFeature(iconFeature)

      let iconFeature1 = new Feature({
        geometry: new Point(fromLonLat([121.69840380683587, 31.139965591074088])),
        name: '标记2 png 旋转45度',
        type: 'marker',
      })
      let iconStyle1 = new Style({
        text: new Text({
          font: '16px sans-serif ',
          text: '标记2',
          offsetY: 25,
          fill: new Fill({
            color: '#FF0000'
          }),
        }),
        image: new Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'img/arrow-up.png',
          imgSize: [32, 32],
          rotateWithView: true,
          rotation: Math.PI / 180 * 45 //  旋转角度，单位弧度
        }),
      })
      iconFeature1.setStyle(iconStyle1)
      this.areaVectorSource.addFeature(iconFeature1)
    },
    /*已有坐标绘制线*/
    drawLineString() {
      const linePoints = [[121.56794116035155,31.560996120782647],[121.45121142402344,31.518860903482263],[121.45395800605469,31.432189936615572],[121.47181078925782,31.382962620417374],[121.56107470527343,31.41578370076762],[121.5981535626953,31.44390691899946],[121.65995165839841,31.41578370076762],[121.6970305158203,31.360684638818043],[121.73548266425782,31.310246553689936],[121.74509570136718,31.27025111578449],[121.80552050605466,31.22915949137321]]
      const lineFeature = new Feature({
        geometry: new LineString(linePoints.map(item => fromLonLat(item))),
        name: 'line1', //添加的自定义属性
        type: 'line', //添加的自定义属性
      })

      let lineStyle = new Style({
        fill: new Fill({
          color: "rgba(255, 0, 0, 0.2)"
        }),
        stroke: new Stroke({
          color: "rgba(255, 0, 0, 1)",
          width: 3
        }),
      })

      lineFeature.setStyle(lineStyle);

      this.areaVectorSource.addFeature(lineFeature)

    },

```


修改标记物的样式：

```js
changePolygonStyle() {
      let features = this.areaVectorSource.getFeatures()
      features.forEach(item => {
        console.log(item.getProperties());
        let type = item.getProperties().type
        if (type && type == 'area') {
          console.log(item);
          const style = new Style({
            fill: new Fill({
              color: "rgba(255,0,0,.5)"
            }),
            stroke: new Stroke({
              color: "rgb(85,9,178)",
              width: 3
            }),
          })
          item.setStyle(style)
        }
      })
    },

```

根据后台推送修改标记物位置，原始需求：从后台获取一个车辆列表，建立一个websocket连接，后台推送一些车辆的位置信息过来，前端实时改变车辆位置，位置信息里还有角度，也要改变车头方向。
因为要获取到openlayers控件的标记物比较麻烦，图上车辆3的标记物是一个html元素，使用openlayers的getPixelFromCoordinate方法可以将GPS坐标转换为屏幕坐标，例：getPixelFromCoordinate(fromLonLat([121.49309680, 31.18520803])) = [506.5,468.5]，然后修改绝对定位值改变元素位置。

```js

 setCurrentPosition(markerItem) {
      let targetItem = this.markerList.find(item => markerItem.name == item.name)
      let screenPoint = this.getScreePoint(markerItem)
      targetItem['left'] = screenPoint[0];
      targetItem['top'] = screenPoint[1];
      targetItem['timeDiff'] = new Date().getTime() - new Date(markerItem.time).getTime()
      targetItem['rotation'] = markerItem.rotation;
      // 这里需求是只展示5分钟内的数据
      this.visibleMarkerList = this.markerList.filter(item => item.timeDiff < 300 * 1000) 
    },
    addHtmlMarker() {
      const that = this

      function fakeTrackData(name, trackList) {
        let trackIndex = 0, len = trackList.length
        setInterval(() => {

          let point = trackList[trackIndex]
          let nextPoint = trackList[trackIndex + 1]
          
          // 这里引入了一个库 @turf/turf, 用来计算两个坐标点的角度，仅做前端展示用，实际后台推送数据有真实角度
          let bearing = bearingFunc(turfPoint(point), turfPoint(nextPoint))
          const markerItem = {
            name: name,
            time: new Date().getTime(),
            rotation: bearing,
            speed: `50km/h`,
            lon: point[0],
            lat: point[1]
          }
          that.setCurrentPosition(markerItem)
          trackIndex += 1
          if (trackIndex >= len - 2) {
            trackIndex = 0
          }
        }, 1000)
      }
      fakeTrackData("车辆3", trackData) // mock 位置数据
    },

```


显示历史轨迹，根据一组坐标先绘制一条线，然后遍历数组画轨迹点，并在开头和结尾的轨迹点标上文字，单击轨迹点可以弹出速度时间信息。

```js

addTrackPath() {
      const trackPoints = trackData.map(item => {
        return {
          lon: item[0],
          lat: item[1],
          speed: 50,
          time: new Date()
        }
      })
      const featureList = []
      const len = trackPoints.length
      /* 画轨迹点, 并在起始点添加文字*/
      trackPoints.forEach((item, index) => {
        let pointObj = {
          type: 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': fromLonLat([item.lon, item.lat]),
          },
          properties: {
            'name': `轨迹点${index+1}`,
            'type': 'trackPoint',
            'speed': item.speed,
            'time': item.time
          }
        }
        let pointStyle = new Style({
          image: new CircleStyle({
            radius: 4,
            fill: new Fill({
              color: '#32E08D',
            }),
          }),
        })

        if (index === 0) {
          pointStyle = new Style({
            text: new Text({
              font: '14px sans-serif ',
              text: '起',
              offsetY: -10,
              fill: new Fill({
                color: '#32E08D'
              })
            }),
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: '#1466E0',
              }),
            }),
          })
        }

        if (index === len - 1) {
          pointStyle = new Style({
            image: new CircleStyle({
              radius: 4,
              fill: new Fill({
                color: '#E01430',
              }),
            }),
            text: new Text({
              font: '14px sans-serif ',
              text: '终',
              offsetY: -10,
              fill: new Fill({
                color: '#E01430'
              })
            }),
          })
        }
        const pointFeature = new GeoJSON().readFeature(pointObj)
        pointFeature.setStyle(pointStyle)
        featureList.push(pointFeature)
      })

      /* 画轨迹线*/
      const polyline = polylineTool.encode(trackPoints.map(item => {
        return [item.lat.toFixed(6), item.lon.toFixed(6)]
      }), 6)
      const route = new Polyline({
        factor: 1e6,
      }).readGeometry(polyline, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857',
      });

      const routeFeature = new Feature({
        type: 'route',
        geometry: route,
      });

      const routeStyle = new Style({
        stroke: new Stroke({
          color: '#32E08D',
          width: 3,
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)',
        }),
      })
      routeFeature.setStyle(routeStyle)
      featureList.push(routeFeature)
      this.trackVectorSource.addFeatures(featureList)
    },

```

轨迹动画，这里参考了官方的示例代码：https://openlayers.org/en/latest/examples/feature-move-animation.html ，这里我将官方的小圆圈图标改成一个箭头，并添加了动态计算角度的方法，角度可以随轨迹变化。官方示例代码中`data/polyline/route.json`的数据都是乱码的，这个数据格式是`Google Static Maps Polyline Encoding`，如果要转换为这种格式需要一个加密、解密方法，我也放在项目中了。

```js

moveFeature(event) {
      function getRotation(prev, next) {
        const dx = prev[0] - next[0]
        const dy = prev[1] - next[1]
        return Math.atan2(dy, dx)
      }

      const speed = 150;
      const time = event.frameState.time;
      const elapsedTime = time - lastTime;
      distance = (distance + (speed * elapsedTime) / 1e6) % 2;
      lastTime = time;

      let realDistance = distance > 1 ? distance - 1 : distance
      const currentCoordinate = route.getCoordinateAt(
          realDistance
      );

      const nextCoordinate = route.getCoordinateAt(Math.min(realDistance + 0.0001, 1))

      rotation = getRotation(currentCoordinate, nextCoordinate)

      position.setCoordinates(currentCoordinate);
      const vectorContext = getVectorContext(event);
      vectorContext.setStyle(new Style({
        image: new Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          src: 'data:image/svg+xml;utf8,' + arrowSvgPath,
          imgSize: [32, 32],
          rotation: -rotation - 90 * Math.PI / 180
        }),
      }));
      vectorContext.drawGeometry(position);
      this.mapData.render();
    },

```

为地图标记物添加事件，单击弹出popup、右键弹出菜单，这里使用了v-contextmenu这个组件

```js
 this.mapData.on('click', function (evt) {
        var feature = that.mapData.forEachFeatureAtPixel(evt.pixel,
            function (feature) {
              return feature
            }
        )
        if (feature) {
          const coordinate = evt.coordinate
          const featureProperties = feature.getProperties()
          if (['marker', 'line', 'area', 'trackPoint'].includes(featureProperties.type)) {
            overlay.setPosition(coordinate)
            that.showPopup(content, featureProperties)
          }
        } else {
          overlay.setPosition(undefined);
        }
      })

      this.mapData.getViewport().addEventListener('contextmenu', evt => {
        evt.preventDefault();
        var feature = that.mapData.forEachFeatureAtPixel(that.mapData.getEventPixel(evt),
            function (feature) {
              return feature
            }
        )
        const menuPosition = {
          left: evt.clientX,
          top: evt.clientY
        }
        if (feature) {
          const coordinate = evt.coordinate
          const featureProperties = feature.getProperties()
          console.log(feature, featureProperties);
          that.$refs.featureContextmenu.show(menuPosition)
          this.currentFeature = feature
        } else {
        }
      })

```

图层切换：原需求是切换到一个卫星图层，这里我修改为高德地图

```js

 toggleMapSource() {
      this.mapSourceIndex = !this.mapSourceIndex
      this.mapSourceIndex ? this.baseLayer.setSource(this.autonaviMapSource) : this.baseLayer.setSource(this.arcgisMapSource)
    },

```

### 在线演示：https://liyang5945.github.io/openlayers-demo
### github地址：https://github.com/liyang5945/openlayers-demo
