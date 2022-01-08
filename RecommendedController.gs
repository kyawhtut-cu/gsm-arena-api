const recommendedController = (response) => {
  response.data = getRecommended(response)
  return response.responseWithJson()
}

const testRecommended = () => {
  console.log(JSON.stringify(getRecommended()))
}

function getRecommended(request = null) {
  const response = UrlFetchApp.fetch(
    GSM_AREAN_BASE_URL,
    FETCH_OPTIONS
  )
  if (response.getResponseCode() != 200) {
    if (request != null) request.status = response.getResponseCode()
    return []
  }
  const $ = Cheerio.load(response.getContentText())

  const recommendedList = {}
  $(`div[class^=module]`).each(function (indexDiv, div) {
    let title = $(div).find(`h4[class^=section-heading]`).text()
    if (indexDiv == 0 || indexDiv == 1) {
      const tempList = []
      $(div).find(`div a`).each(function (_, a) {
        tempList.push({
          device_name: $(a).text(),
          device_image: $(a).find(`img`).attr(`src`),
          key: $(a).attr(`href`).split(`.`)[0]
        })
      })
      recommendedList[`recommended_${indexDiv + 1}`] = {
        title: title,
        data: tempList
      }
    } else if (indexDiv == 2 || indexDiv == 3) {
      $(div).find(`table`).each(function (_, table) {
        let rowData = []
        $(table).find(`tbody tr`).each(function (_, tr) {
          let _rowData = []
          const _a = $(tr).find(`th a`)
          if (_a.attr(`href`) != null) {
            _rowData.push(_a.attr(`href`))
            $(tr).find(`td`).each(function (_, td) {
              const _td = $(td).text().trim()
              if (_td != null && _td != ``) {
                _rowData.push(_td)
              }
            })
          }
          if (_rowData.length > 0) {
            rowData.push({
              no: parseInt(_rowData[1]),
              device_name: _a.text().trim(),
              daily_hits: _rowData[2],
              key: _rowData[0].split(`.`)[0]
            })
          }
        })
        recommendedList[`recommended_${indexDiv + 1}`] = {
          title: title,
          data: rowData
        }
      })
    } else if (indexDiv == 4) {
      $(div).find(`table`).each(function (_, table) {
        let rowData = []
        $(table).find(`tbody tr`).each(function (_, tr) {
          const _a = $(tr).find(`th a`)
          if (_a.attr(`href`) != null) {
            const url = _a.attr(`href`).split(`?`)[1].split(`&`)
            rowData.push({
              device_name: _a.text().trim(),
              device_one_id: parseInt(url[0].split(`=`)[1]),
              device_two_id: parseInt(url[1].split(`=`)[1])
            })
          }
        })
        recommendedList[`recommended_${indexDiv + 1}`] = {
          title: title,
          data: rowData
        }
      })
    }
  })
  return recommendedList
}
