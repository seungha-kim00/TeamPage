package com.proxy.server.naverapi;

import lombok.RequiredArgsConstructor;
import org.json.JSONException;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin(origins = {허용할 host})
@RequiredArgsConstructor
public class NaverAPIController {

    private final NaverAPIService naverAPIService;

    @GetMapping("/news")
    public List<ArticleDto> searchItems(@RequestParam String query) throws JSONException {
        return naverAPIService.searchArticles(query);
    }
}
