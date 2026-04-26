package com.thegallery.app;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final Web web;

    public ApiController(Web web) {
        this.web = web;
    }

    @GetMapping("/quote")
    public Map<String, String> getQuote() {
        return web.scrapeQuote();
    }

    @GetMapping("/news")
    public List<Map<String, String>> getNews() {
        return web.scrapeArtsNews();
    }

    @GetMapping("/images")
    public List<Map<String, String>> getImages() {
        return web.scrapeImages();
    }

    @GetMapping("/spellcheck")
    public Map<String, Object> spellCheck(@RequestParam String word) {
        return web.checkSpelling(word);
    }

    @GetMapping("/comment")
    public Map<String, String> getComment() {
        String comment = web.generateAIComment();
        return Map.of("comment", comment);
    }
}