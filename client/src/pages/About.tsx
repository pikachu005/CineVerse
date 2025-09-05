export default function About() {
  return (
    <main className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-foreground">
            About CineVerse
          </h1>
          
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-8">
            <div className="bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Your Ultimate Cinema Discovery Platform
              </h2>
              <p>
                CineVerse is your gateway to the vast world of cinema, offering a comprehensive 
                platform for discovering movies, TV shows, and web series from around the globe. 
                Our mission is to connect you with the perfect entertainment content tailored to 
                your preferences.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-bold text-foreground mb-3">🎬 Discover Movies</h3>
                <p>
                  Explore popular movies from Hollywood, Bollywood, and Tollywood. Stay updated 
                  with daily and weekly trending lists, and dive deep into movie details including 
                  cast, crew, storylines, ratings, and genres.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-bold text-foreground mb-3">📺 TV Shows & Series</h3>
                <p>
                  Discover trending TV shows and web series with comprehensive information about 
                  episodes, seasons, networks, and production details. Find your next binge-worthy 
                  series with ease.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-bold text-foreground mb-3">🎥 Watch Trailers</h3>
                <p>
                  Access official trailers for movies and TV shows directly from YouTube, 
                  embedded seamlessly within our platform for the best viewing experience.
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 border">
                <h3 className="text-xl font-bold text-foreground mb-3">🔍 Smart Search</h3>
                <p>
                  Our intelligent search functionality supports movies, TV shows, and web series 
                  with debounced search and type-specific results for quick and accurate discovery.
                </p>
              </div>
            </div>

            <div className="bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Comprehensive Information
              </h2>
              <p className="mb-4">
                For every movie and TV show, we provide detailed information including:
              </p>
              <ul className="grid md:grid-cols-2 gap-2 list-disc list-inside">
                <li>High-quality posters and backdrops</li>
                <li>Plot summaries and storylines</li>
                <li>Cast and crew information</li>
                <li>User ratings and vote counts</li>
                <li>Release dates and runtime details</li>
                <li>Genre classifications</li>
                <li>Budget and revenue information</li>
                <li>Production company details</li>
                <li>Similar content recommendations</li>
                <li>Official trailers and videos</li>
              </ul>
            </div>

            <div className="bg-muted/30 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Regional Cinema
              </h2>
              <p>
                We celebrate the diversity of global cinema by featuring content from different 
                regions and film industries. Whether you're interested in Hollywood blockbusters, 
                Bollywood musicals, or Tollywood dramas, CineVerse has curated collections for 
                every taste and preference.
              </p>
            </div>

            <div className="text-center space-y-4 pt-8">
              <p className="text-lg font-medium text-foreground">
                Powered by TMDB
              </p>
              <p className="text-sm">
                Developed by Ram Krishna Jha.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}