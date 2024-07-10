import axios from "axios";
import { useQuery } from "react-query";
import { useAuth } from "../components/AuthContextProvider";
import { Outlet, useNavigate } from "react-router-dom";
import AddButton from "../components/AddButton";
import Posts from "../components/Posts";

export default function Home() {
  const authCtx = useAuth();
  const navigate = useNavigate();
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

  let content;
  if (isLoading) {
    content = <h1 className="text-9xl">Posts...</h1>
  }
  if (isError) {
    console.log(error);
    content = <h1 className="text-9xl">Error!</h1>
  }
  if (data) {
    content = (<Posts data={data.data} />);
  }

  return (
    <>
      <Outlet />
      <div className="m-5">
        {content}
        <AddButton onClick={() => { navigate('/create'); }} />
      </div>
    </>
  );
}