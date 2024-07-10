import { useRef, useState } from "react";
import { useAuth } from "../components/AuthContextProvider";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import EditPostForm from "../components/EditPostForm";
import CircularProgress from "@mui/material/CircularProgress";

import { FormSubmitData } from "./CreatePost";

export default function EditPost() {
  let content = (<h1 className="text-7xl">Empty</h1>);
  const { postId } = useParams();
  const [open, setOpen] = useState(true);
  const authCtx = useAuth();
  const queryClient = useQueryClient();
  const optimisticId = useRef(0);
  const navigate = useNavigate();
  const query = useQuery({
    queryFn: () => {
      return axios({
        method: 'get',
        url: 'http://localhost:8080/posts/' + postId,
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
      });
    },
    queryKey: ['posts', {
      action: 'edit',
      postId: postId,
    }],
  });
  const mutation = useMutation({
    mutationFn: (data: FormSubmitData) => {
      return axios({
        method: 'patch',
        url: 'http://localhost:8080/posts/edit/' + postId,
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
        data: {
          title: data.title,
          description: data.description,
        },
      });
    },
    onMutate: async (newData: FormSubmitData & { postId?: string }) => {
      newData.postId = "optimistic-edit-" + (++optimisticId.current);

      await queryClient.cancelQueries({
        queryKey: [
          'posts',
          {
            action: 'edit',
            postId: postId,
          }
        ]
      });

      const previousPost = queryClient.getQueryData(['posts', {
        action: 'edit',
        postId: postId,
      }]);

      queryClient.setQueryData(['posts'],
        (old: any) => {
          old.data = [newData, ...old.data];
          return old;
        }
      );
      return { previousPost };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['posts', { action: 'edit', postId: postId, }], context?.previousPost)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  function handleClose() {
    setOpen(false);
    navigate('/');
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const title = formJson.title;
    const description = formJson.description;
    const userId = authCtx?.id as string;
    mutation.mutate({
      title,
      description,
      userId,
    })
    handleClose();
  }


  if (query.isLoading) {
    content = (<CircularProgress color="secondary" />);
  }

  if (query.isError) {
    content = (<h1 className="text-7xl text-red-600">Error</h1>);
  }

  if (query.data) {
    content = (
      <EditPostForm
        open={open}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        defaultData={query.data.data}
      />
    );
  }

  return (
    <>
      {content}
    </>
  );
}