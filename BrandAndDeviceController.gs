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

  const response = getGSMApiResponse()

  if (response == null) {
    if (request != null) request.status = response.getResponseCode()
    return []
  }

  return response.brand_list
}

function getDeviceList(request = null) {
  const response = getGSMApiResponse()

  if (response == null) {
    if (request != null) request.status = response.getResponseCode()
    return []
  }

  return response.device_list
}

function getGSMApiResponse() {
  var response = UrlFetchApp.fetch(
    QUERY_URL,
    FETCH_OPTIONS
  )

  if (response.getResponseCode() != 200) {
    return null
  }

  response = JSON.parse(response.getContentText())

  let tempBrandList = response[0]
  let tempDeviceList = response[1]

  let deviceList = tempDeviceList.map(device => {
    const brandId = device[0]
    const deviceId = device[1]
    const deviceName = device[2]
    const deviceType = device[3]
    const deviceImage = `https://fdn2.gsmarena.com/vv/bigpic/` + device[4]

    return {
      brand_id: brandId,
      device_id: deviceId,
      device_name: deviceName,
      device_type: deviceType,
      device_image: deviceImage,
      key: `${tempBrandList[brandId].toLowerCase()}_${deviceName.replaceAll(` `, `_`).toLowerCase()}-${deviceId}`
    }
  })

  const countByBrand = deviceList.reduce((acc, device) => {
    const { brand_id } = device
    if (acc[brand_id]) {
      acc[brand_id] += 1
    } else {
      acc[brand_id] = 1
    }

    return acc
  }, {})

  let brandList = Object.entries(tempBrandList).map(([key, value]) => {
    return {
      brand_id: parseInt(key),
      brand_name: value,
      device_count: countByBrand[key] ?? 0,
      key: value.toLocaleLowerCase()
    }
  })

  return {
    brand_list: brandList,
    device_list: deviceList
  }
}
