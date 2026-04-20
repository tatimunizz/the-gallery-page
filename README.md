# The Gallery

A curated web application that aggregates live content from the internet—quotes, art news, and high‑quality images—to create an inspiring, gallery‑like experience. The application is built with **Spring Boot** and serves both the backend API and the frontend static assets from a single deployable JAR.

## Features

- **Quote of the Day** – Scraped from [quotes.toscrape.com](http://quotes.toscrape.com) with `robots.txt` compliance.
- **Art News** – Latest headlines from [Hyperallergic](https://hyperallergic.com) RSS feed.
- **Visual Inspiration** – High‑resolution images extracted from the [Unsplash Blog](https://unsplash.com/blog/).
- **Spell Checker** – Backend integration with the Datamuse API.
- **Contextual Comments** – Random, theme‑aware commentary generated from scraped tags.
- **Image Zoom** – Hover scaling and click‑to‑open modal for full‑screen viewing.
- **Ambient Sound** – Custom audio player for an immersive experience.

## Technologies

- **Backend:** Java 17, Spring Boot 3.2, Maven, Jsoup
- **Frontend:** HTML, CSS, JavaScript (served statically from `src/main/resources/static`)
- **Template Engine:** Thymeleaf (for fragment modularisation)

## Prerequisites

- **Java 17** or later ([Download](https://adoptium.net/))
- **Maven** (the project includes the Maven Wrapper, so no global installation is required)

## Getting Started

### 1. Clone the Repository

git clone https://github.com/tatimunizz/the-gallery-page.git
cd the-gallery

### 2. Run the Application

Use the Maven Wrapper to start the Spring Boot server:

**Windows (PowerShell / Command Prompt)**
.\mvnw spring-boot:run

**macOS / Linux**
./mvnw spring-boot:run

Once the server is running, open your browser and visit:

http://localhost:8080

The application will serve the frontend directly from the embedded Tomcat server.

## API Endpoints

All endpoints are prefixed with `/api` and return JSON.

| Endpoint | Description |
|----------|-------------|
| GET /api/quote | Returns a random quote and its author. |
| GET /api/news | Returns a list of up to 5 art news articles. |
| GET /api/images | Returns a list of up to 6 images with titles and links. |
| GET /api/spellcheck?word={word} | Checks spelling and returns suggestions. |
| GET /api/comment?tag={tag} | Returns a contextual random comment. |

## Building for Production

To create a single, executable JAR file that contains both the backend and the frontend static assets:

.\mvnw clean package      # Windows
./mvnw clean package      # macOS / Linux

The JAR will be located in the `target/` directory. Run it with:

java -jar target/the-gallery-*.jar

The application will be available at http://localhost:8080.

## Project Structure

the-gallery/
├── src/
│   ├── main/
│   │   ├── java/com/artgallery/backend/   # Java source files (Web, Controllers)
│   │   ├── resources/
│   │   │   ├── static/                     # Frontend assets (CSS, JS, images)
│   │   │   ├── templates/                  # Thymeleaf HTML fragments
│   │   │   └── application.properties      # Spring Boot configuration
├── .gitignore
├── pom.xml
└── README.md

## Responsible Web Scraping

This project follows best practices for ethical scraping:

- Verifies `robots.txt` before every request.
- Implements rate limiting (delays between requests).
- Uses a realistic `User-Agent` string.
- Never attempts to bypass authentication or CAPTCHAs.
- Falls back to curated local data if a source is unavailable.

## License

This project is for educational purposes as part of a university assignment. All aggregated content belongs to their respective owners.

---
*Built with ☕ and Spring Boot*