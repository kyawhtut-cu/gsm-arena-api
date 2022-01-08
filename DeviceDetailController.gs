let deviceDetailController = (response) => {
  response.data = getDeviceDetail(
    response.parameter.key,
    response
  )
  return response.responseWithJson()
}

let testDeviceDetail = () => {
  console.log(JSON.stringify(getDeviceDetail(`samsung_galaxy_tab_s7+-10336`)))
}

let testPicture = () => {
  console.log(JSON.stringify(getPicture(`samsung_galaxy_tab_s7+-10336`)))
}

function getDeviceDetail(key, request = null) {
  const response = UrlFetchApp.fetch(
    GSM_AREAN_BASE_URL + key + `.php`,
    FETCH_OPTIONS
  )
  if (response.getResponseCode() != 200) {
    if (request != null) request.status = response.getResponseCode()
    return null
  }

  const $ = Cheerio.load(response.getContentText())

  const deviceName = $(`h1[class^=specs-phone-name-title]`).text().trim()
  const deviceImage = $(`div[class^=specs-photo-main] a img`).attr(`src`)
  const displaySize = $(`span[data-spec^=displaysize-hl]`).text().trim()
  const displayRes = $(`div[data-spec^=displayres-hl]`).text().trim()
  const accentCamera = $(`.accent-camera`).text().trim()
  const videoPixels = $(`div[data-spec^=videopixels-hl]`).text().trim()
  const ramSize = $(`.accent-expansion`).text().trim()
  const chipset = $(`div[data-spec^=chipset-hl]`).text().trim()
  const battery = $(`.accent-battery`).text().trim()
  const batteryType = $(`div[data-spec^=battype-hl]`).text().trim()
  const releaseDate = $(`span[data-spec^=released-hl]`).text().trim()
  const body = $(`span[data-spec^=body-hl]`).text().trim()
  const os = $(`span[data-spec^=os-hl]`).text().trim()
  const storage = $(`span[data-spec^=storage-hl]`).text().trim()
  const comment = $(`p[data-spec^=comment]`).text().trim()
  const specList = getSpec($)
  const priceList = getPrice($)
  const otherInformation = getOtherInformation($)
  const pictureList = getPicture(key)
  return {
    key: key,
    device_name: deviceName,
    device_image: deviceImage,
    display_size: displaySize,
    display_res: displayRes,
    camera: accentCamera,
    video: videoPixels,
    ram: ramSize,
    chipset: chipset,
    battery: battery,
    batteryType: batteryType,
    release_date: releaseDate,
    body: body,
    os_type: os,
    storage: storage,
    comment: comment,
    more_specification: specList,
    prices: priceList,
    pictures: pictureList,
    more_information: otherInformation
  }
}

function getSpec($, deviceArray = [1]) {
  const specList = []
  $(`div[id^=specs-list] table`).each(function (tableIndex, specTable) {
    const _specList = []
    let specTitle = ``
    $(specTable).find(`tbody tr`).each(function (trIndex, tr) {
      if (trIndex == 0) {
        specTitle = $(tr).find(`th`).text()
      }
      let subTitle = ``
      let subSpecList = []
      $(tr).find(`td`).each(function (tdIndex, td) {
        if (tdIndex == 0) {
          subTitle = $(td).text().trim()
        } else {
          let specValue = $(td).text().trim()
          if(specValue.toLowerCase() == `Compare PHOTO / Compare VIDEO`.toLocaleLowerCase() || specValue == null) {
            specValue = ``
          }
          subSpecList.push(specValue)
        }
      })
      if (subTitle != `` && subTitle != null) {
        _specList.push({
          title: subTitle,
          data: deviceArray.map((_, index) => subSpecList[index] ? subSpecList[index] : ``)
        })
      }
    })
    specList.push({
      title: specTitle,
      data: _specList
    })
  })
  return specList
}

function getPrice($) {
  const priceList = {}
  $(`div[class^=pricing-scroll-container] div[class^=pricing]`).each(function (pIndex, pricing) {
    const key = $(pricing).find(`span`).text()
    const tempPrice = []
    $(pricing).find(`ul li`).each(function (liIndex, li) {
      tempPrice.push({
        shop_image: $(li).find(`img`).attr(`src`),
        price: $(li).find(`a`).text(),
        buy_url: $(li).find(`a`).attr(`href`)
      })
    })
    priceList[key] = tempPrice
  })
  return priceList
}

function getOtherInformation($) {
  const otherInformation = {}
  $(`div[class^=module]`).each(function (_, div) {
    let title = $(div).find(`h4[class^=section-heading]`).text()
    const tempList = []
    $(div).find(`ul li`).each(function (_, li) {
      tempList.push({
        device_name: $(li).find(`a`).text(),
        device_image: $(li).find(`img`).attr(`src`),
        key: $(li).find(`a`).attr(`href`).split(`.`)[0]
      })
    })
    if (title.toLowerCase().startsWith(`related`)) {
      title = `Related Devices`
    } else if (title.toLowerCase().startsWith(`popular`)) {
      title = title
    } else {
      title = ``
    }

    if (title != ``) {
      otherInformation[title] = tempList
    }
  })
  return otherInformation
}

function getPicture(key) {
  const keyArray = key.split(`-`)
  const response = UrlFetchApp.fetch(GSM_AREAN_BASE_URL + keyArray[0] + `-pictures-` + keyArray[1] + `.php`).getContentText()
  const $ = Cheerio.load(response)

  const pictureList = []
  $(`div[id^=pictures-list] img`).each(function (_, img) {
    let imgURL = $(img).attr(`src`)
    if (imgURL == null) {
      imgURL = $(img).attr(`data-src`)
    }
    if (imgURL != null) {
      pictureList.push(imgURL)
    }
  })

  return pictureList
}
