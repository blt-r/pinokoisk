import Slider from '@mui/material/Slider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useEffect, useState, type FormEvent } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react-lite';

import {
  CURRENT_YEAR,
  defaultFilters,
  GENRE_IDS,
  GENRES,
  MAX_RATING,
  MIN_RATING,
  MIN_YEAR,
} from '@/tmdb';
import { moviesPageStore } from '@/stores/moviesPageStore';

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

  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    moviesPageStore.filters.genres.map(id => GENRES.get(id)!)
  );

  useEffect(() => {
    return reaction(
      () => moviesPageStore.filters,
      filters => {
        setYearRange([filters.minYear, filters.maxYear]);
        setRatingRange([filters.minRating, filters.maxRating]);
        setSelectedGenres(filters.genres.map(id => GENRES.get(id)!));
      }
    );
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    moviesPageStore.setFilters({
      minYear: yearRange[0],
      maxYear: yearRange[1],
      minRating: ratingRange[0],
      maxRating: ratingRange[1],
      genres: selectedGenres.map(g => GENRE_IDS[g]),
    });
  };

  const resetFilters = () => {
    moviesPageStore.setFilters(defaultFilters());
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h2" fontSize={30} mb={2}>
        Filters
      </Typography>

      <Stack component="form" onSubmit={handleSubmit} spacing={2} mx={2}>
        <Box>
          <Typography id="year-slider-label">
            Year: {formatYearRange(yearRange)}
          </Typography>
          <Slider
            aria-labelledby="year-slider-label"
            value={yearRange}
            onChange={(_, v) => setYearRange(v as [number, number])}
            valueLabelDisplay="auto"
            min={MIN_YEAR}
            max={CURRENT_YEAR}
          />
        </Box>

        <Box>
          <Typography id="rating-slider-label">
            Rating: {formatRatingRange(ratingRange)}
          </Typography>
          <Slider
            aria-labelledby="rating-slider-label"
            value={ratingRange}
            onChange={(_, v) => setRatingRange(v as [number, number])}
            valueLabelDisplay="auto"
            min={MIN_RATING}
            max={MAX_RATING}
            step={0.1}
          />
        </Box>

        <Box>
          <Autocomplete
            multiple
            options={Object.keys(GENRE_IDS)}
            value={selectedGenres}
            onChange={(_, v) => setSelectedGenres(v)}
            renderInput={params => (
              <TextField {...params} label="Genres" variant="standard" />
            )}
          />
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={resetFilters}>
            Reset
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Apply
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
});

export default FilterForm;
