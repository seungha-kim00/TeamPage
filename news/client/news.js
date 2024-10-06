const myIpAddress = "172.30.1.1"; // 192.168.0.105
const portNumber = "3000";
let query = "";

// 검색 이벤트 발생 시 fetch 요청
$("#newsFetchButton").on("click", () => {
  // query 예외처리
  quer = "";
  query = $("#searchQuery").val(); // DOM에서 query 값 가져옴

  validateDataQuery(query); // query 검증

  getNewsByQuery(myIpAddress, portNumber, query);
});

// HTTP GET 요청
function getNewsByQuery(host, port, query) {
  const url = `https://${host}:${port}/news?query=${query}`;

  console.log(url);

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      validateData(data); // 데이터 검증

      const newsCardsContainer = $("#news_cards");
      newsCardsContainer.empty(); // 추가 검색 시, DOM 업데이트가 안되는 오류가 발생 -> 재요청 시 DOM 삭제 후 생성
      data.forEach((item) => renderNewsCard(item, newsCardsContainer));
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function validateDataQuery() {
  if (query === "") {
    alert("검색할 단어를 입력해주세요");
    return;
  }
}

function validateData(data) {
  if (data.length === 0) {
    alert("유효한 단어를 입력해주세요");
    return;
  }
}

// News_Card DOM 동적 생성
function renderNewsCard(item, parentDom) {
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
  parentDom.append(temp_html);
}
