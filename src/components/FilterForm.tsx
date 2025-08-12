import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import {
  CURRENT_YEAR,
  defaultFilters,
  GENRE_IDS,
  MAX_RATING,
  MIN_RATING,
  MIN_YEAR,
} from '@/tmdb';
import { moviesPageStore } from '@/stores/moviesPageStore';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Toggle } from '@/components/ui/toggle';

const formatYearRange = ([min, max]: [number, number]): string => {
  if (min === MIN_YEAR && max === CURRENT_YEAR) return 'any';
  if (min === MIN_YEAR) return `before ${max}`;
  if (max === CURRENT_YEAR) return `after ${min}`;
  if (min === max) return min.toString();
  return `${min} — ${max}`; // this is an em dash, not a hyphen
};

const formatRatingRange = ([min, max]: [number, number]): string => {
  if (min === MIN_RATING && max === MAX_RATING) return 'any';
  if (min === MIN_RATING) return `below ${max}`;
  if (max === MAX_RATING) return `above ${min}`;
  if (min === max) return `exactly ${min}`;
  return `${min} — ${max}`; // this is also an em dash
};

const FilterForm: React.FC = observer(() => {
  const [yearRange, setYearRange] = useState<[number, number]>([
    moviesPageStore.filters.minYear,
    moviesPageStore.filters.maxYear,
  ]);

  const [ratingRange, setRatingRange] = useState<[number, number]>([
    moviesPageStore.filters.minRating,
    moviesPageStore.filters.maxRating,
  ]);

  useEffect(
    () => {
      setYearRange([
        moviesPageStore.filters.minYear,
        moviesPageStore.filters.maxYear,
      ]);
      setRatingRange([
        moviesPageStore.filters.minRating,
        moviesPageStore.filters.maxRating,
      ]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      moviesPageStore.filters.minYear,
      moviesPageStore.filters.maxYear,
      moviesPageStore.filters.minRating,
      moviesPageStore.filters.maxRating,
    ]
  );

  return (
    <section className="bg-card text-card-foreground rounded-lg border p-6 shadow-md">
      <header className="mb-6 flex items-center">
        <h2 className="text-2xl">Filters</h2>
        <Button
          variant="secondary"
          className="ml-auto"
          onClick={() => moviesPageStore.setFilters(defaultFilters())}
        >
          Reset
        </Button>
      </header>
      <div className="flex flex-col gap-6">
        <Label>Year: {formatYearRange(yearRange)}</Label>
        <Slider
          value={yearRange}
          onValueChange={v => setYearRange(v as [number, number])}
          onValueCommit={v => moviesPageStore.setYearRange(v[0], v[1])}
          min={MIN_YEAR}
          max={CURRENT_YEAR}
        />

        <Label>Rating: {formatRatingRange(ratingRange)}</Label>
        <Slider
          value={ratingRange}
          onValueChange={v => setRatingRange(v as [number, number])}
          onValueCommit={v => moviesPageStore.setRatingRange(v[0], v[1])}
          min={MIN_RATING}
          max={MAX_RATING}
          step={0.1}
        />

        <Label>Genres: </Label>
        <div role="group" className="flex flex-wrap gap-2">
          {Object.keys(GENRE_IDS).map(genre => (
            <Toggle
              key={genre}
              pressed={moviesPageStore.filters.genres[genre]}
              size="sm"
              variant="outline"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              onPressedChange={pressed =>
                moviesPageStore.setGenre(genre, pressed)
              }
            >
              {genre}
            </Toggle>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FilterForm;
