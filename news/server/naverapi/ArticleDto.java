package com.proxy.server.naverapi;

import lombok.Getter;
import lombok.Setter;
import org.json.JSONException;
import org.json.JSONObject;

@Getter
@Setter
public class ArticleDto {
    private String title;
    private String originallink;
    private String link;
    private String description;
    private String pubDate;


    public ArticleDto(JSONObject articleJson) throws JSONException {
        this.title = articleJson.getString("title");
        this.originallink = articleJson.getString("originallink");
        this.link = articleJson.getString("link");;
        this.description = articleJson.getString("description");
        this.pubDate = articleJson.getString("pubDate");
    }
}
