let searchController = (response) => {
  response.data = getSearchList(response.parameter.query)
  return response.responseWithJson()
}

let testSearchController = () => {
  console.log(getSearchList("Samsung tab"))
}

function getSearchList(deviceName) {
  var response = UrlFetchApp.fetch(SEARCH_BASE_URL + deviceName).getContentText()
  response = JSON.parse(response)
  let newsList = []
  let reviewList = []
  response["news"].forEach((news) => {
    newsList.push({
      "news_title": news[`text`],
      "news_image": news[`src`],
      "news_url": GSM_AREAN_BASE_URL + news[`href`]
    })
  })
  response["reviews"].forEach((review) => {
    reviewList.push({
      "review_title": review[`text`],
      "review_image": review[`src`],
      "review_url": GSM_AREAN_BASE_URL + review[`href`]
    })
  })
  
  return {
    "news_list": newsList,
    "review_list": reviewList
  }
}
