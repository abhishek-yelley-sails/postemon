import axios from "axios";
import { useQuery } from "react-query";
import { useAuth } from "../components/AuthContextProvider";
import PostCard from "../components/PostCard";
import { Tooltip, useTheme } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import { Outlet } from "react-router-dom";

export default function Home() {
  const authCtx = useAuth();
  const theme = useTheme();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () => {
      return axios({
        url: "http://localhost:8080/posts/all",
        method: 'get',
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
      })
    },
    queryKey: ['posts']
  });
  const query = useQuery({
    queryFn: () => {
      return axios({
        method: 'get',
        url: 'http://localhost:8080/users/',
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
      })
    },
    queryKey: ['users'],
  });

  if (query.data && !query.isLoading && !query.isError) {
    console.log("hey", query.data)
    authCtx?.changeId(query.data?.data.id);
    authCtx?.changeEmail(query.data?.data.email);
  }

  const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
  };

  let content;
  if (isLoading) {
    content = <h1 className="text-9xl">Posts...</h1>
  }
  if (isError) {
    console.log(error);
    content = <h1 className="text-9xl">Error!</h1>
  }
  if (data) {
    content = data.data.map((item: any) => {
      console.log(item);
      return (
        <PostCard key={item.postId} userId={item.userId} title={item.title} description={item.description} />
      );
    })
  }
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  return (
    <>
      <Outlet />
      <div className="flex flex-wrap m-5">
        {content}
        <Tooltip title="Add Post">
          <Zoom
            key={'primary'}
            in={true}
            timeout={transitionDuration}
            style={{
              transitionDelay: `${transitionDuration.exit}ms`,
            }}
            unmountOnExit
          >

            <Fab sx={fabStyle} aria-label={'Add'} color={'primary'}>
              {<AddIcon />}
            </Fab>
          </Zoom>
        </Tooltip>
      </div>
    </>
  );
}