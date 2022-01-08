let deviceListByBrandController = (response) => {
  response.data = getDeviceListByBrand(
    response.parameter.brand_id,
    response.parameter.brand_name.toLowerCase(),
    response.parameter.page,
    response
  )
  return response.responseWithJson()
}

let testDeviceListByBrandPage1 = () => {
  console.log(JSON.stringify(getDeviceListByBrand(80, `xiaomi`, 1)))
}

let testDeviceListByBrandPage2 = () => {
  console.log(JSON.stringify(getDeviceListByBrand(80, `xiaomi`, 2)))
}

function getDeviceListByBrand(brandID, brandName, page, request = null) {
  let route = brandName + `-phones-` + brandID
  if (page > 1) {
    route = brandName + `-phones-f-` + brandID + `-0-p` + page
  }
  const response = UrlFetchApp.fetch(
    GSM_AREAN_BASE_URL + route + `.php`,
    FETCH_OPTIONS
  )
  if (response.getResponseCode() != 200) {
    if(request != null) request.status = response.getResponseCode()
    return {
      device_list: [],
      total_page: 0
    }
  }
  const $ = Cheerio.load(response.getContentText())
  const deviceList = []
  $(`div[class^=makers] ul li`).each(function (_, li) {
    deviceList.push({
      device_name: $(li).find(`a`).text(),
      device_image: $(li).find(`img`).attr(`src`),
      key: $(li).find(`a`).attr(`href`).split(`.`)[0]
    })
  })

  let totalPage = 1
  $(`div[class^=nav-pages] a`).each(function (_, a) {
    totalPage += 1
  })

  return {
    device_list: deviceList,
    total_page: totalPage
  }
}
