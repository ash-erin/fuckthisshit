import React from 'react';
import { Play, Plus, Info, X } from 'lucide-react';
import { Movie } from '../types';

interface SearchResultsProps {
  query: string;
  results: Movie[];
  onPlay: (movie: Movie) => void;
  onAddToList: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
  myList?: string[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  query,
  results,
  onPlay,
  onAddToList,
  onMoreInfo,
  myList = [],
}) => {
  if (!query) return null;

  return (
    <div className="min-h-screen pt-20 px-4 md:px-8" style={{ backgroundColor: '#081932' }}>
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-8">
        Search results for "{query}"
      </h1>

      {results.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-white/60 text-lg mb-4">No results found</p>
          <p className="text-white/40">Try searching for something else</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-20">
          {results.map((movie) => {
            const isInMyList = myList.includes(movie.id);
            
            return (
              <div
              key={movie.id}
              className="group cursor-pointer"
             onClick={() => onMoreInfo(movie)}
            >
              <div className="relative overflow-hidden rounded-md transition-transform duration-300 group-hover:scale-105">
                <img
                  src={movie.thumbnail}
                  alt={movie.title}
                  className="w-full h-48 md:h-64 object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-white/70 text-xs">{movie.genre.join(', ')}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                     onClick={(e) => {
                       e.stopPropagation();
                       onPlay(movie);
                     }}
                      className="bg-white text-black p-2 rounded-full hover:bg-white/90 transition-colors"
                    >
                      <Play size={16} fill="currentColor" />
                    </button>
                    <button
                     onClick={(e) => {
                       e.stopPropagation();
                       onAddToList(movie);
                     }}
                      className={`p-2 rounded-full transition-all duration-200 group/button ${
                        isInMyList
                          ? 'text-white'
                          : 'text-white'
                      }`}
                      style={{
                        backgroundColor: isInMyList 
                          ? 'rgba(239, 68, 68, 0.8)' 
                          : 'rgba(34, 197, 94, 0.8)'
                      }}
                      onMouseEnter={(e) => {
                        if (isInMyList) {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)';
                        } else {
                          e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 1)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isInMyList) {
                          e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.8)';
                        } else {
                          e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.8)';
                        }
                      }}
                    >
                      {isInMyList ? (
                        <X size={16} />
                      ) : (
                        <Plus size={16} />
                      )}
                    </button>
                    <button
                     onClick={(e) => {
                       e.stopPropagation();
                       onMoreInfo(movie);
                     }}
                      className="bg-gray-700/80 text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-2 px-1">
                <h3 className="text-white text-sm font-medium line-clamp-2">
                  {movie.title}
                </h3>
                <p className="text-white/60 text-xs mt-1">
                  {movie.genre.join(', ')}
                </p>
              </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};