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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from './AuthContextProvider';
import { useEffect, useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface PostCardProps {
  userId: string,
  postId: string,
  title: string,
  description: string,
  time: string,
}

const options = [
  {
    name: 'Edit',
    path: '/edit/',
    icon: <EditIcon sx={{ marginRight: '15px' }} />,
  },
  {
    name: 'Delete',
    path: '/delete/',
    icon: <DeleteIcon sx={{ marginRight: '15px' }} />,
  },
];

export default function PostCard({ userId, postId, title, description, time }: PostCardProps) {
  const authCtx = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [anchorElOptions, setAnchorElOptions] = useState<HTMLElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    async function getEmail() {
      const response = await axios({
        method: 'get',
        url: 'http://localhost:8080/users/' + userId,
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
      });
      const email = response.data.email;
      if (email) {
        setEmail(email);
      }
    }
    getEmail();
  }, [authCtx, setEmail, userId]);

  const isOwner = authCtx?.id === userId;

  function handleCloseOptionsMenu() {
    setAnchorElOptions(null);
  }

  function handleOpenOptionsMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorElOptions(event.currentTarget);
  };

  return (
    <Card sx={{ width: 300, minHeight: 300, margin: '10px', display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <div>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" />
          }
          action={
            isOwner &&
            (<IconButton aria-label="settings" onClick={handleOpenOptionsMenu}>
              <MoreVertIcon />
            </IconButton>)
          }
          title={email ? email : '<unknown>'}
          subheader={new Date(time).toLocaleString('en-In')}
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
      <Menu
        sx={{ mt: '45px' }}
        id="post-options"
        anchorEl={anchorElOptions}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElOptions)}
        onClose={handleCloseOptionsMenu}
      >
        {options.map((option) => (
          <MenuItem key={option.name} onClick={() => { handleCloseOptionsMenu(); navigate(option.path + postId); }}>
            <div className='flex flex-row justify-between'>
              {option.icon}
              <Typography textAlign="center">{option.name}</Typography>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </Card>
  );
}