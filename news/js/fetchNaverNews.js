$(window).on("load", function () {
  setTimeout(function () {
    $(".spinner").hide(); // 스피너 요소를 숨김
    $(".content").show(); // 컨텐츠를 표시
  }, 3000); // 3초 후 로딩 완료
});

// 네이버 opi
$(function () {
  const clientId = "n8kbdycWPla4PFTlGcHv";
  const clientSecret = "DQJeMhw0Sp";

  // CORS 프록시 URL 추가
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";

  // 네이버 API 요청 URL
  const url =
    "https://openapi.naver.com/v1/search/news.json?query=%EC%A3%BC%EC%8B%9D&display=10&start=1&sort=sim";

  fetch(proxyUrl + url, {
    method: "GET",
    headers: {
      "X-Naver-Client-Id": clientId,
      "X-Naver-Client-Secret": clientSecret,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      data.items.forEach((item) => {
        let temp_html = `
            <div class="card text-center">
                <div class="card-header">
                <ul class="nav nav-tabs card-header-tabs">
                    <li class="nav-item">
                    <a class="nav-link active" aria-current="true" href="#">미리보기</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href=${item.originallink}>원본 기사</a>
                    </li>
                    <li class="nav-item" id="time">${item.pubDate}</li>
                </ul>
                </div>
                <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${item.description}</p>
                <a href=${item.link} class="btn btn-outline-primary">뉴스 확인하기</a>
                </div>
            </div>
            `;
        $("#news_cards").append(temp_html);
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
});
