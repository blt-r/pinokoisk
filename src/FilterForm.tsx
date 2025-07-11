import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Slider,
  Autocomplete,
  TextField,
  Box,
  Paper,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import {
  CURRENT_YEAR,
  genreIdsToNames,
  genreNamesToIds,
  GENRES,
  MAX_RATING,
  MIN_RATING,
  MIN_YEAR,
  type Filters,
} from './tmdb';

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
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    genreNamesToIds(searchParams.get('genres')?.split(',') || [])
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

    const validGenres = genreIdsToNames(selectedGenres);
    if (validGenres.length) params.genres = validGenres.join(',');

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
      genres: selectedGenres,
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
      genres: selectedGenres,
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
          <label>Year Range</label>
          <Slider
            value={yearRange}
            onChange={(_, v) => setYearRange(v as [number, number])}
            valueLabelDisplay="auto"
            min={1990}
            max={CURRENT_YEAR}
          />
        </Box>

        <Box>
          <label>Rating Range</label>
          <Slider
            value={ratingRange}
            onChange={(_, v) => setRatingRange(v as [number, number])}
            valueLabelDisplay="auto"
            min={0}
            max={10}
          />
        </Box>

        <Box>
          <Autocomplete
            multiple
            options={Array.from(GENRES.keys())}
            value={selectedGenres}
            onChange={(_, v) => setSelectedGenres(v)}
            renderInput={params => (
              <TextField {...params} label="Genres" variant="standard" />
            )}
            getOptionLabel={id => GENRES.get(id) || ''}
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
