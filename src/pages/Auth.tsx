import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import FormControlLabel from '@mui/material/FormControlLabel';
// import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useMutation } from 'react-query';
import axios, { AxiosResponse } from 'axios';
import { useAuth } from '../components/AuthContextProvider';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to="/">
        Postemon
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface AuthData {
  email: string,
  password: string,
}

export default function Auth() {
  const navigate = useNavigate();
  const authCtx = useAuth();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const mutation = useMutation({
    mutationFn: (data: AuthData) => {
      return axios.post('http://localhost:8080/' + mode, data);
    },
    onSuccess: (data: AxiosResponse<any, any> | undefined) => {
      authCtx?.changeId(data?.data.user.id);
      authCtx?.changeEmail(data?.data.user.email);
      authCtx?.changeToken(data?.data.token);
      authCtx?.changeLoggedIn(true);
      navigate('/');
    },
  });
  useEffect(() => {
    if (authCtx?.isLoggedIn)
      navigate('/');
  }, [authCtx?.isLoggedIn, navigate]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data: AuthData = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };
    mutation.mutate(data);
  };

  if (mutation.isLoading) {
    return (
      <h1 className='text-7xl'>Loading...</h1>
    );
  }
  else if (mutation.isError) {
    console.log(mutation.error);
    return (
      <h1 className='text-7xl'>Error Ocurred!</h1>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {mode === 'signup' ? 'Sign up' : 'Sign in'}
        </Typography>
        <Box component={"form"} onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {mode === 'signup' ? 'Sign up' : 'Sign in'}
          </Button>
          <Grid container>
            <Grid item xs>
              {mode !== 'signup' &&
                <Link to="#">
                  Forgot password?
                </Link>}
            </Grid>
            <Grid item>
              <Link to={"?mode=" + (mode === 'signup' ? 'login' : 'signup')}>
                {mode === 'signup' ? "Already have an account? Log In" : "Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}