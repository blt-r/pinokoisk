import Slider from '@mui/material/Slider';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  CURRENT_YEAR,
  GENRE_IDS,
  MAX_RATING,
  MIN_RATING,
  MIN_YEAR,
  type Filters,
} from '../tmdb';

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

type Props = {
  onFilterChange: (filters: Filters) => void;
};

const FilterForm: React.FC<Props> = ({ onFilterChange }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [yearRange, setYearRange] = useState<[number, number]>([
    Number(searchParams.get('year_min')) || MIN_YEAR,
    Number(searchParams.get('year_max')) || CURRENT_YEAR,
  ]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([
    Number(searchParams.get('rating_min')) || MIN_RATING,
    Number(searchParams.get('rating_max')) || MAX_RATING,
  ]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    (searchParams.get('genres')?.split(',') || []).filter(
      g => GENRE_IDS[g] !== undefined
    )
  );

  const buildParams = () => {
    const params: Record<string, string> = {};

    const [minYear, maxYear] = yearRange;
    if (minYear <= maxYear) {
      if (minYear > 1990) params.year_min = minYear.toString();
      if (maxYear < CURRENT_YEAR) params.year_max = maxYear.toString();
    }

    const [minRating, maxRating] = ratingRange;
    if (minRating <= maxRating) {
      if (minRating > 0) params.rating_min = minRating.toString();
      if (maxRating < 10) params.rating_max = maxRating.toString();
    }

    if (selectedGenres.length) params.genres = selectedGenres.join(',');

    return params;
  };

  useEffect(() => {
    const params = buildParams();
    setSearchParams(params, { replace: true });
    onFilterChange({
      minYear: yearRange[0],
      maxYear: yearRange[1],
      minRating: ratingRange[0],
      maxRating: ratingRange[1],
      genres: selectedGenres.map(g => GENRE_IDS[g]),
    });
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = buildParams();
    setSearchParams(params);
    onFilterChange({
      minYear: yearRange[0],
      maxYear: yearRange[1],
      minRating: ratingRange[0],
      maxRating: ratingRange[1],
      genres: selectedGenres.map(g => GENRE_IDS[g]),
    });
  };

  const resetFilters = () => {
    setYearRange([MIN_YEAR, CURRENT_YEAR]);
    setRatingRange([MIN_RATING, MAX_RATING]);
    setSelectedGenres([]);
    setSearchParams({});
    onFilterChange({
      minYear: MIN_YEAR,
      maxYear: CURRENT_YEAR,
      minRating: MIN_RATING,
      maxRating: MAX_RATING,
      genres: [],
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h2" fontSize={30} mb={2}>
        Filters
      </Typography>

      <Stack component="form" onSubmit={handleSubmit} spacing={2} mx={2}>
        <Box>
          <label>Year: {formatYearRange(yearRange)}</label>
          <Slider
            value={yearRange}
            onChange={(_, v) => setYearRange(v as [number, number])}
            valueLabelDisplay="auto"
            min={1990}
            max={CURRENT_YEAR}
          />
        </Box>

        <Box>
          <label>Rating: {formatRatingRange(ratingRange)}</label>
          <Slider
            value={ratingRange}
            onChange={(_, v) => setRatingRange(v as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={10}
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
};

export default FilterForm;
