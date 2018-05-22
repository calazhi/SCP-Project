/**
 * @description formatArea 格式化函数封装，接口暴露供其他页面使用
 * @param {Object} areasList 区域信息
 * @return {Object} areasList 区域信息
*/
export const formatArea = areasList => {
  let areaArray = []
  for (let i = 0; i < areasList.length; i++) {
    areaArray[i] = []
    areaArray[i][0] = []
    for (let j = 0; j < areasList[i].borderPoints.length; j++) {
      let pointX = areasList[i].borderPoints[j].pointX
      let pointY = areasList[i].borderPoints[j].pointY
      areaArray[i][0][j] = [pointX, pointY]
    }
    areasList[i].borderPoints = areaArray[i]
    areasList[i].areaType = parseInt(areasList[i].areaType)
  }
  return areasList
}
