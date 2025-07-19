import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Star from '@mui/icons-material/Star';
import LinkMUI from '@mui/material/Link';
import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import type { MovieDetails } from '@/tmdb';
import FavoriteButton from '@/components/FavoriteButton';
import Button from '@mui/material/Button';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
});

const MovieDetailsContent: React.FC<{ details: MovieDetails }> = ({
  details,
}) => {
  const formattedDate = new Date(
    Date.parse(details.release_date)
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    day: 'numeric',
  });

  return (
    <Box my={2}>
      <Stack
        sx={{ flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}
        position="relative"
      >
        <Box sx={{ position: 'absolute', top: 3, right: 3 }}>
          <FavoriteButton id={details.id} />
        </Box>
        <Paper
          component="img"
          src={'https://image.tmdb.org/t/p/w500' + details.poster_path}
          alt={details.title + ' poster'}
          sx={{
            width: { xs: '50%', sm: '250px' },
            mx: { xs: 'auto', sm: 0 },
            height: 'fit-content',
            aspectRatio: '500 / 720',
            display: 'block',
          }}
        />
        <Stack direction="column" gap={1.5}>
          <Typography variant="h1" fontSize={{ xs: '2.5rem', sm: '3rem' }}>
            {details.title}
          </Typography>
          {details.title !== details.original_title && (
            <Typography fontSize="1.3rem">{details.original_title}</Typography>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: 1.6,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Typography>{formattedDate}</Typography>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Star sx={{ fontSize: '0.9rem' }} />

              <Typography sx={{ ml: 0.2 }}>
                {details.vote_average.toFixed(1)}
              </Typography>

              <Typography sx={{ ml: 1 }}>
                ({details.vote_count.toLocaleString()})
              </Typography>
            </Box>

            <Typography>{details.runtime} min</Typography>
          </Box>

          <Box>
            {details.budget !== 0 && (
              <DetailInfo name="budget">
                {currencyFormatter.format(details.budget)}
              </DetailInfo>
            )}
            {details.revenue !== 0 && (
              <DetailInfo name="revenue">
                {currencyFormatter.format(details.revenue)}
              </DetailInfo>
            )}
            {details.production_companies.length && (
              <DetailInfo name="production">
                {details.production_companies.map(c => c.name).join(', ')}
              </DetailInfo>
            )}
            {details.production_countries.length && (
              <DetailInfo name="countries">
                {details.production_countries.map(c => c.name).join(', ')}
              </DetailInfo>
            )}
            {details.spoken_languages.length && (
              <DetailInfo name="languages">
                {details.spoken_languages.map(l => l.name).join(', ')}
              </DetailInfo>
            )}
            {details.tagline && (
              <DetailInfo name="tagline">{details.tagline}</DetailInfo>
            )}
            {details.genres.length && (
              <DetailInfo name="genres">
                {details.genres.map((g, i) => (
                  <Fragment key={i}>
                    {i !== 0 && ', '}
                    {
                      <LinkMUI component={Link} to={'/?genres=' + g.name}>
                        {g.name}
                      </LinkMUI>
                    }
                  </Fragment>
                ))}
              </DetailInfo>
            )}
          </Box>
          <Typography>{details.overview}</Typography>
          <Stack gap=".5rem" direction="row" flexWrap="wrap">
            <Button
              component="a"
              href={'https://www.themoviedb.org/movie/' + details.id}
              target="_blank"
              variant="outlined"
            >
              TMDB
            </Button>
            {details.imdb_id !== '' && (
              <Button
                component="a"
                href={'https://www.imdb.com/title/' + details.imdb_id}
                target="_blank"
                variant="outlined"
              >
                IMDb
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

const DetailInfo: React.FC<{ name: string; children: ReactNode }> = ({
  name,
  children,
}) => {
  return (
    <Typography>
      <Typography component="span" color="textSecondary">
        {name + ': '}
      </Typography>
      {children}
    </Typography>
  );
};

export default MovieDetailsContent;
