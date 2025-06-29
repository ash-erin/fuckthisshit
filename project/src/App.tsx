import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContentRow } from './components/ContentRow';
import { VideoPlayer } from './components/VideoPlayer';
import { MovieModal } from './components/MovieModal';
import { SearchResults } from './components/SearchResults';
import { ProfileDropdown } from './components/ProfileDropdown';
import { NotificationDropdown } from './components/NotificationDropdown';
import { SettingsModal } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { LogoutModal } from './components/LogoutModal';
import { featuredMovie, contentRows, movies, getMostLikedMovies } from './data/movies';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Movie } from './types';

function App() {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [myList, setMyList] = useLocalStorage<string[]>('project-mylist', []);
  const [searchSuggestions, setSearchSuggestions] = useState<Movie[]>([]);
  const [movieLikes, setMovieLikes] = useLocalStorage<Record<string, number>>('project-likes', {});
  const [userLikes, setUserLikes] = useLocalStorage<string[]>('project-user-likes', []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Get all movies from regular movies array and content rows
      const allMovies = [...movies];
      
      // Add movies from content rows that aren't already in the regular movies array
      contentRows.forEach(row => {
        row.movies.forEach(movie => {
          if (!allMovies.find(m => m.id === movie.id)) {
            allMovies.push(movie);
          }
        });
      });
      
      const results = allMovies.filter(movie =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.description.toLowerCase().includes(query.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(results);
      setSearchSuggestions(results.slice(0, 6)); // Limit suggestions to 6 items
    } else {
      setSearchResults([]);
      setSearchSuggestions([]);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handlePlay = (movie: Movie) => {
    setCurrentMovie(movie);
  };

  const handleAddToList = (movie: Movie) => {
    setMyList(prev => 
      prev.includes(movie.id) 
        ? prev.filter(id => id !== movie.id)
        : [...prev, movie.id]
    );
  };

  const handleMoreInfo = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleSignOut = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    // In a real app, this would clear auth tokens and redirect to login
    console.log('Signing out...');
  };

  const handleLogoClick = () => {
    // This function is no longer needed as we handle it in Header
    // but keeping it for backward compatibility
    window.location.reload();
  };

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    setShowProfileDropdown(false);
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(!showProfileDropdown);
    setShowNotificationDropdown(false);
  };

  const handleLike = (movie: Movie) => {
    if (userLikes.includes(movie.id)) {
      // Remove like
      setUserLikes(prev => prev.filter(id => id !== movie.id));
      setMovieLikes(prev => ({
        ...prev,
        [movie.id]: Math.max(0, (prev[movie.id] || movie.likes || 0) - 1)
      }));
    } else {
      // Add like
      setUserLikes(prev => [...prev, movie.id]);
      setMovieLikes(prev => ({
        ...prev,
        [movie.id]: (prev[movie.id] || movie.likes || 0) + 1
      }));
    }
  };

  // Update movies with current like counts
  const moviesWithUpdatedLikes = movies.map(movie => ({
    ...movie,
    likes: movieLikes[movie.id] || movie.likes || 0
  }));

  // Update content rows with current like counts
  const updatedContentRows = contentRows.map(row => {
    if (row.id === 'most-liked') {
      // Get all movies from regular movies array and custom content rows
      const allMoviesForLiking = [...moviesWithUpdatedLikes];
      
      // Add custom movies from content rows to the liking system
      contentRows.forEach(contentRow => {
        if (contentRow.id !== 'most-liked') {
          contentRow.movies.forEach(movie => {
            // Only add if it's not already in the regular movies array
            if (!moviesWithUpdatedLikes.find(m => m.id === movie.id)) {
              const updatedMovie = {
                ...movie,
                likes: movieLikes[movie.id] || movie.likes || 0
              };
              allMoviesForLiking.push(updatedMovie);
            }
          });
        }
      });
      
      const mostLiked = allMoviesForLiking
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 12);
      return { ...row, movies: mostLiked };
    }
    return {
      ...row,
      movies: row.movies.map(movie => 
        moviesWithUpdatedLikes.find(m => m.id === movie.id) || movie
      )
    };
  });

  // Also include custom movies from content rows that are in myList
  const myListMovies = movies.filter(movie => myList.includes(movie.id));
  
  // Get custom movies from content rows that are in myList (avoiding duplicates)
  const customMoviesInMyList: Movie[] = [];
  const addedIds = new Set(myListMovies.map(m => m.id));
  
  contentRows.forEach(row => {
    row.movies.forEach(movie => {
      if (myList.includes(movie.id) && !addedIds.has(movie.id)) {
        // Apply current like count to custom movies
        const updatedMovie = {
          ...movie,
          likes: movieLikes[movie.id] || movie.likes || 0
        };
        customMoviesInMyList.push(updatedMovie);
        addedIds.add(movie.id);
      }
    });
  });
  
  const allMyListMovies = [...myListMovies, ...customMoviesInMyList];
  
  const finalContentRows = allMyListMovies.length > 0 
    ? [{ id: 'mylist', title: 'My List', movies: allMyListMovies }, ...updatedContentRows]
    : updatedContentRows;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#081932' }}>
      <Header
        onSearch={handleSearch}
        onProfileClick={handleProfileClick}
        onNotificationClick={handleNotificationClick}
        onLogoClick={handleLogoClick}
        isScrolled={isScrolled}
        searchSuggestions={searchSuggestions}
        onMovieSelect={handleMovieSelect}
      />

      <ProfileDropdown
        isOpen={showProfileDropdown}
        onClose={() => setShowProfileDropdown(false)}
        onSignOut={handleSignOut}
        onSettings={() => setShowSettingsModal(true)}
        onHelp={() => setShowHelpModal(true)}
      />

      <NotificationDropdown
        isOpen={showNotificationDropdown}
        onClose={() => setShowNotificationDropdown(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      <HelpModal
        isOpen={showHelpModal}
        onClose={() => setShowHelpModal(false)}
      />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      {searchQuery ? (
        <SearchResults
          query={searchQuery}
          results={searchResults}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
          onMoreInfo={handleMoreInfo}
          myList={myList}
        />
      ) : (
        <>
          <Hero
            movie={featuredMovie}
            onPlay={handlePlay}
            onAddToList={handleAddToList}
            onMoreInfo={handleMoreInfo}
            myList={myList}
          />

          <div className="relative -mt-16 z-10">
            {finalContentRows.map((row) => (
              <div
                key={row.id}
               data-content-row
                id={row.id === 'mylist' ? 'mylist-section' : undefined}
                data-section={row.id === 'most-liked' ? 'most-popular' : undefined}
                className={row.id === 'mylist' ? 'pt-8' : ''}
              >
                <ContentRow
                  title={row.title}
                  movies={row.movies}
                  onPlay={handlePlay}
                  onAddToList={handleAddToList}
                  onMoreInfo={handleMoreInfo}
                  isMyListRow={row.id === 'mylist'}
                  myList={myList}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {currentMovie && (
        <VideoPlayer
          movie={currentMovie}
          onClose={() => setCurrentMovie(null)}
        />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onPlay={handlePlay}
          onAddToList={handleAddToList}
          onLike={handleLike}
          currentLikes={movieLikes[selectedMovie.id] || selectedMovie.likes || 0}
          isLiked={userLikes.includes(selectedMovie.id)}
          myList={myList}
        />
      )}
    </div>
  );
}

export default App;