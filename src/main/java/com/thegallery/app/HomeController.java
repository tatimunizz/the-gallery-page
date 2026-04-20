package com.thegallery.app;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("pageTitle", "The Gallery");
        model.addAttribute("pageSubtitle", "A curated collection of art, wisdom, and creative inspiration from across the web");
        model.addAttribute("comment", "Art has the power to transform our daily lives.");
        model.addAttribute("quoteContent", "Inspiration exists, but it has to find you working.");
        model.addAttribute("quoteAuthor", "Pablo Picasso");
        // Os demais dados mockados estão hardcoded nos fragmentos por enquanto
        return "index";
    }
}