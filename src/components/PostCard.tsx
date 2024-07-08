import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useQuery } from 'react-query';
import { useAuth } from './AuthContextProvider';

interface PostCardProps {
  userId: string,
  title: string,
  description: string,
}

export default function PostCard({ userId, title, description }: PostCardProps) {
  const authCtx = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryFn: () => {
      return axios({
        method: 'get',
        url: 'http://localhost:8080/users/',
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
      })
    }
  })
  return (
    <Card sx={{ width: 300, minHeight: 300, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={isLoading ? '...' : (isError ? '<not found>' : data?.data.email)}
          subheader="September 14, 2016"
        />
        {/* <CardMedia
        component="img"
        height="194"
        image="/static/images/cards/paella.jpg"
        alt="Paella dish"
      /> */}
        <CardContent>
          <Typography variant="h5" color="text.primary">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </div>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}