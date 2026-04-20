package com.thegallery.app;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URI;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class Web {

  private static final String USER_AGENT = "Mozilla/5.0 (compatible; MyBot/1.0)";

  /**
   * Verify Robots.txt
   */
  private boolean isAllowedByRobots(String urlToCheck, String userAgent) {
    try {
      URL urlObj = URI.create(urlToCheck).toURL();
      String host = urlObj.getHost();
      String robotsUrl = urlObj.getProtocol() + "://" + host + "/robots.txt";

      Document robotsTxt = Jsoup.connect(robotsUrl)
          .userAgent(userAgent)
          .timeout(5000)
          .ignoreContentType(true)
          .get();

      String content = robotsTxt.text();
      String path = urlObj.getPath();

      String[] lines = content.split("\\r?\\n");
      String currentUserAgent = null;
      boolean isDisallowed = false;

      for (String line : lines) {
        line = line.trim().toLowerCase();
        if (line.startsWith("user-agent:")) {
          currentUserAgent = line.substring(11).trim();
        } else if (line.startsWith("disallow:") && currentUserAgent != null) {
          String disallowPath = line.substring(9).trim();
          if (currentUserAgent.equals("*") || currentUserAgent.equalsIgnoreCase(userAgent)) {
            if (!disallowPath.isEmpty() && path.startsWith(disallowPath)) {
              isDisallowed = true;
            }
          }
        }
      }
      return !isDisallowed;

    } catch (Exception e) {
      System.err.println("robots.txt inaccessible or invalid: " + e.getMessage());
      return true;
    }
  }

  /**
   * Scrapes a random quote from quotes.toscrape.com.
   */
  public Map<String, String> scrapeQuote() {
    String targetUrl = "http://quotes.toscrape.com/random";

    if (!isAllowedByRobots(targetUrl, USER_AGENT)) {
      System.err.println("Access disallowed by robots.txt for: " + targetUrl);
      return Map.of(
          "quote", "Inspiration exists, but it has to find you working.",
          "author", "Pablo Picasso");
    }

    try {
      TimeUnit.MILLISECONDS.sleep(500);

      Document doc = Jsoup.connect(targetUrl)
          .userAgent(USER_AGENT)
          .timeout(10000)
          .get();

      String rawQuote = doc.selectFirst(".quote .text").text();
      String author = doc.selectFirst(".quote .author").text();
      String cleanQuote = rawQuote.replaceAll("^[“\"']+|[”\"']+$", "").trim();

      return Map.of("quote", cleanQuote, "author", author);

    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      return Map.of(
          "quote", "Inspiration exists, but it has to find you working.",
          "author", "Pablo Picasso");
    }
  }

  /**
   * Scrapes news from Hyperallergic RSS feed.
   */
  public List<Map<String, String>> scrapeArtsNews() {
    String targetUrl = "https://hyperallergic.com/feed/";
    List<Map<String, String>> articles = new ArrayList<>();

    if (!isAllowedByRobots(targetUrl, USER_AGENT)) {
      System.err.println("Access disallowed by robots.txt for: " + targetUrl);
      return getFallbackNews();
    }

    try {
      TimeUnit.MILLISECONDS.sleep(500);

      Document doc = Jsoup.connect(targetUrl)
          .userAgent(USER_AGENT)
          .timeout(10000)
          .get();

      Elements items = doc.select("item");
      int count = 0;
      for (Element item : items) {
        if (count >= 5)
          break;

        String title = item.selectFirst("title").text();
        String link = item.selectFirst("link").text();
        String description = item.selectFirst("description").text();

        String cleanDescription = Jsoup.parse(description).text();

        articles.add(Map.of(
            "title", title,
            "link", link,
            "description", cleanDescription));
        count++;
      }

      if (articles.isEmpty()) {
        return getFallbackNews();
      }
      return articles;

    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      return getFallbackNews();
    }
  }

  private List<Map<String, String>> getFallbackNews() {
    List<Map<String, String>> fallback = new ArrayList<>();
    fallback.add(Map.of(
        "title", "New Exhibition Opens at MoMA",
        "link", "#",
        "description", "A groundbreaking exhibition featuring contemporary artists from around the world."));
    fallback.add(Map.of(
        "title", "The Art of Creative Coding",
        "link", "#",
        "description", "Exploring the intersection of art and technology through generative design."));
    fallback.add(Map.of(
        "title", "Street Art: The Digital Revolution",
        "link", "#",
        "description", "How digital tools are transforming traditional street art and graffiti culture."));
    return fallback;
  }

  /**
   * Scrapes the latest posts with high-quality images from the Unsplash blog.
   * First collects post links and titles from the main blog page, then visits
   * each post
   * to extract the full-resolution image directly from the main content figure.
   */
  public List<Map<String, String>> scrapeImages() {
    String targetUrl = "https://unsplash.com/blog/";
    List<Map<String, String>> images = new ArrayList<>();

    // 1. Respect robots.txt (explicitly allows /blog)
    if (!isAllowedByRobots(targetUrl, USER_AGENT)) {
      System.err.println("Access disallowed by robots.txt for: " + targetUrl);
      return getFallbackImages();
    }

    try {
      TimeUnit.MILLISECONDS.sleep(500); // Rate limiting

      Document doc = Jsoup.connect(targetUrl)
          .userAgent(USER_AGENT)
          .timeout(10000)
          .get();

      // 2. Collect up to 6 post links and titles from the main page
      Elements postCards = doc.select(".post-card.js-post-entry");
      List<PostInfo> postInfos = new ArrayList<>();

      for (Element card : postCards) {
        if (postInfos.size() >= 6)
          break;

        Element titleElement = card.selectFirst(".post-card__title");
        String title = titleElement != null ? titleElement.text() : "";

        Element linkElement = card.selectFirst(".post-card__anchor-tag");
        String link = linkElement != null ? linkElement.attr("href") : "";

        if (!title.isEmpty() && !link.isEmpty()) {
          // Ensure absolute URL
          String fullLink = link.startsWith("http") ? link : "https://unsplash.com" + link;
          postInfos.add(new PostInfo(title, fullLink));
        }
      }

      // 3. Visit each post page to extract the high-resolution image
      for (PostInfo info : postInfos) {
        String imageUrl = fetchHighResImageFromPost(info.link);

        if (!imageUrl.isEmpty()) {
          images.add(Map.of(
              "title", info.title,
              "link", info.link,
              "imageUrl", imageUrl));
        }

        // Be respectful: delay between post requests
        TimeUnit.MILLISECONDS.sleep(800);
      }

      if (images.isEmpty()) {
        return getFallbackImages();
      }
      return images;

    } catch (IOException | InterruptedException e) {
      e.printStackTrace();
      return getFallbackImages();
    }
  }

  /**
   * Fetches a single post page and extracts the main image URL from the content
   * figure.
   * Based on the actual HTML structure provided by the user.
   */
  private String fetchHighResImageFromPost(String postUrl) {
    try {
      Document doc = Jsoup.connect(postUrl)
          .userAgent(USER_AGENT)
          .timeout(10000)
          .get();

      // The main high-res image is inside a <figure> with classes "kg-card
      // kg-image-card kg-width-full"
      Element figure = doc.selectFirst("figure.kg-card.kg-image-card");
      if (figure != null) {
        Element img = figure.selectFirst("img");
        if (img != null) {
          String src = img.attr("src");
          if (!src.isEmpty()) {
            return src; // This is the high-resolution original
          }
        }
      }
    } catch (IOException e) {
      System.err.println("Failed to fetch post: " + postUrl + " - " + e.getMessage());
    }
    return ""; // Return empty if not found
  }

  // Simple helper class to hold post information before fetching the image
  private static class PostInfo {
    final String title;
    final String link;

    PostInfo(String title, String link) {
      this.title = title;
      this.link = link;
    }
  }

  private List<Map<String, String>> getFallbackImages() {
    List<Map<String, String>> fallback = new ArrayList<>();
    fallback.add(Map.of(
        "title", "The best way to find an image on Unsplash",
        "link", "https://unsplash.com/blog/the-best-way-to-find-an-image-on-unsplash/",
        "imageUrl",
        "https://storage.ghost.io/c/80/1d/801d5d13-5875-4136-9bfc-1e2fe01b2bff/content/images/size/w600/2026/03/Banner--Twitter--1.jpg"));
    fallback.add(Map.of(
        "title", "Top 20 Images on Unsplash from March 2026",
        "link", "https://unsplash.com/blog/top-20-images-on-unsplash-from-march-2026/",
        "imageUrl",
        "https://storage.ghost.io/c/80/1d/801d5d13-5875-4136-9bfc-1e2fe01b2bff/content/images/size/w600/2026/04/A-look-back-on-March--Twitter-.jpg"));
    fallback.add(Map.of(
        "title", "Illustration Contest: Drawn from Nature",
        "link", "https://unsplash.com/blog/illustration-contest-drawn-from-nature/",
        "imageUrl",
        "https://storage.ghost.io/c/80/1d/801d5d13-5875-4136-9bfc-1e2fe01b2bff/content/images/size/w600/2026/03/Drawn-from-Nature-Blog--Twitter-.jpg"));
    return fallback;
  }

}