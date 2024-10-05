package com.proxy.server.naverapi;

import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;




@Slf4j(topic ="NAVER API")
@Service
public class NaverAPIService {

    private final RestTemplate restTemplate;

    // restTemplate 생성
    public NaverAPIService(RestTemplateBuilder builder){
        this.restTemplate = builder.build();
    }

    public List<ArticleDto> searchArticles(String query) throws JSONException {
        // 요청 URL 생성
        URI uri = UriComponentsBuilder
                .fromUriString("https://openapi.naver.com")
                .path("/v1/search/news.json")
                .queryParam("display", 15)
                .queryParam("query", query)
                .encode()
                .build()
                .toUri();

        log.info("uri = " + uri);   // 생성된 URI log 출력

        // HTTP 요청 메세지 생성
        RequestEntity<Void> requestEntity = RequestEntity
                .get(uri)
                .header("X-Naver-Client-Id", {본인 아이디 키 입력})
                .header("X-Naver-Client-Secret", {본인 시크릿 키 입력})
                .build();

        // restTemplate.exchange()를 통해 HTTP GET 요청을 날려 응답 메세지 받아옴
        // 받아온 메세지는 String( JSON ) 형태이기 때문에, 클라이언트로 보낼
        ResponseEntity<String> responseEntity = restTemplate.exchange(requestEntity, String.class);

        // HTTP 응답 메세지 - 상태코드 확인
        // ex) 정상 응답: 200 OK, 오류: 404 Not Found
        log.info("NAVER API Status Code : " + responseEntity.getStatusCode());

        // HTTP 응답 메세지 - 본문(json) 확인
//        log.info(responseEntity.getBody());

        return fromJSONtoItems(responseEntity.getBody());
    }

    private List<ArticleDto> fromJSONtoItems(String responseEntity) throws JSONException {
        JSONObject jsonObject = new JSONObject(responseEntity);
        JSONArray items = jsonObject.getJSONArray("items");
        List<ArticleDto> articleDtoList = new ArrayList<>();



        for (int i = 0; i < items.length(); i++) {
            JSONObject item = items.getJSONObject(i);  // index -> 안전하게 JSONObject로 변환
            ArticleDto articleDto = new ArticleDto(item);
            articleDtoList.add(articleDto);
        }

        return articleDtoList;
    }


}
