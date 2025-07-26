import { useEffect, useState } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  CURRENT_YEAR,
  defaultFilters,
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

  const [selectedGenres, setSelectedGenres] = useState<Record<string, boolean>>(
    () => ({ ...moviesPageStore.filters.genres })
  );

  useEffect(() => {
    return reaction(
      () => moviesPageStore.filters,
      filters => {
        console.log('Filters changed!!!!!!!!', filters);
        setYearRange([filters.minYear, filters.maxYear]);
        setRatingRange([filters.minRating, filters.maxRating]);
        setSelectedGenres({ ...filters.genres });
      }
    );
  }, []);

  const handleSubmit = () => {
    moviesPageStore.setFilters({
      minYear: yearRange[0],
      maxYear: yearRange[1],
      minRating: ratingRange[0],
      maxRating: ratingRange[1],
      genres: { ...selectedGenres },
    });
  };

  const resetFilters = () => {
    moviesPageStore.setFilters(defaultFilters());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <Label>Year: {formatYearRange(yearRange)}</Label>
        <Slider
          aria-labelledby="year-range-slider-label"
          value={yearRange}
          onValueChange={v => setYearRange(v as [number, number])}
          min={MIN_YEAR}
          max={CURRENT_YEAR}
        />

        <Label>Year: {formatRatingRange(ratingRange)}</Label>
        <Slider
          aria-labelledby="rating-range-slider-label"
          value={ratingRange}
          onValueChange={v => setRatingRange(v as [number, number])}
          min={MIN_RATING}
          max={MAX_RATING}
          step={0.1}
        />

        <Label>Genres: </Label>
        <div
          id="genre-group"
          role="group"
          aria-labelledby="genre-label"
          className="flex flex-wrap gap-2"
        >
          {Object.keys(selectedGenres).map(genre => (
            <Toggle
              key={genre}
              pressed={selectedGenres[genre]}
              size="sm"
              variant="outline"
              className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              onPressedChange={pressed =>
                setSelectedGenres({ ...selectedGenres, [genre]: pressed })
              }
            >
              {genre}
            </Toggle>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="secondary" onClick={resetFilters}>
          Reset
        </Button>
        <Button onClick={handleSubmit}>Apply</Button>
      </CardFooter>
    </Card>
  );
});

export default FilterForm;
