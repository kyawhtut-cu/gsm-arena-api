let brandListController = (response) => {
  response.data = getBrandList(response)
  return response.responseWithJson()
}

let deviceListController = (response) => {
  response.data = getDeviceList(response)
  return response.responseWithJson()
}

let testBrandListController = () => {
  console.log(getBrandList())
}

let testDeviceListController = () => {
  console.log(getDeviceList())
}

function getBrandList(request = null) {
  var response = UrlFetchApp.fetch(
    QUERY_URL,
    FETCH_OPTIONS
  )
  if (response.getResponseCode() != 200) {
    if (request != null) request.status = response.getResponseCode()
    return []
  }

  response = JSON.parse(response.getContentText())
  let tempBrandList = response[0]
  let brandList = []

  for (const brand in tempBrandList) {
    brandList.push({
      brand_id: parseInt(brand),
      brand_name: tempBrandList[brand],
      key: tempBrandList[brand].toLocaleLowerCase()
    })
  }
  return brandList
}

function getDeviceList(request = null) {
  var response = UrlFetchApp.fetch(
    QUERY_URL,
    FETCH_OPTIONS
  )
  if (response.getResponseCode() != 200) {
    if (request != null) request.status = response.getResponseCode()
    return []
  }

  response = JSON.parse(response.getContentText())
  const tempDeviceList = response[1]
  let tempBrandList = response[0]
  let deviceList = []

  for (const brand in tempBrandList) {
    deviceList.push({
      brand_id: parseInt(brand),
      brand_name: tempBrandList[brand],
      key: tempBrandList[brand].toLocaleLowerCase(),
      device_list: tempDeviceList.filter((device) => {
        return device[0] == parseInt(brand)
      }).map((device) => {
        return {
          "device_id": device[1],
          "device_name": device[2],
          "device_type": device[3],
          "device_image": QUERY_DEVICE_IMAGE_BASE_URL + device[4],
          "key": `${tempBrandList[brand].toLowerCase()}_${device[2].replaceAll(` `, `_`).toLowerCase()}-${device[1]}`
        }
      })
    })
  }

  return deviceList
}
