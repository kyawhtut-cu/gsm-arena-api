let compareDeviceController = (response) => {
  response.data = getCompareDevice(response.parameter.device_id.split(`,`), response)
  return response.responseWithJson()
}

let testCompareDevice = () => {
  console.log(JSON.stringify(getCompareDevice([10626, 10626])))
}

function getCompareDevice(deviceIDList, request = null) {
  if(deviceIDList.length > 3) {
    deviceIDList.pop()
  }
  const query = deviceIDList.map((value, index) => {
    return `idPhone${index + 1}=${value}`
  }).join(`&`)
  
  const response = UrlFetchApp.fetch(
    GSM_AREAN_BASE_URL + COMPARE_ROUTE + query,
    FETCH_OPTIONS
  )
  if (response.getResponseCode() != 200) {
    if (request != null) request.status = response.getResponseCode()
    return null
  }
  const $ = Cheerio.load(response.getContentText())

  const deviceInformation = []

  $(`div[class^=compare-candidate]`).each(function (index, div) {
    if (index < deviceIDList.length) {
      const deviceTitle = $(div).find(`h3`).text().trim()
      const deviceImage = $(div).find(`div[class^=compare-media-wrap] img`).attr(`src`)
      const aTag = $(div).find(`div[class^=compare] a[class^=offer]`)
      const deviceBuyURL = aTag.attr(`href`)
      const deviceRAM = aTag.text().trim().split(`RAM`)[0].trim()
      const devicePrice = aTag.text().trim().split(`RAM`)[1].trim()
      const deviceBuySiteLogo = $(aTag).find(`img`).attr(`src`)
      deviceInformation.push({
        device_title: deviceTitle,
        device_image: deviceImage,
        device_ram: deviceRAM,
        device_price: devicePrice,
        device_buy_site_logo: deviceBuySiteLogo,
        device_buy_url: deviceBuyURL
      })
    }
  })

  return {
    device_information: deviceIDList.map((_, index) => deviceInformation[index]),
    device_specification: getSpec($, deviceIDList)
  }
}
