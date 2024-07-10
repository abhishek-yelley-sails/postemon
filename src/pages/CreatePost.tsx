import { useState, useRef } from "react";
import FormDialog from "../components/FormDialog";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useAuth } from "../components/AuthContextProvider";

export interface FormSubmitData {
  title: string,
  description?: string,
  userId: string,
}

export default function CreatePost() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const authCtx = useAuth();
  const queryClient = useQueryClient();
  const optimisticId = useRef(0);
  const mutation = useMutation({
    mutationFn: (data: FormSubmitData) => {
      return axios({
        url: "http://localhost:8080/posts/create",
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
        data: {
          title: data.title,
          description: data.description,
        }
      })
    },
    onMutate: async (newData: FormSubmitData & { postId?: string }) => {
      newData.postId = "optimistic-create-" + (++optimisticId.current);

      await queryClient.cancelQueries({ queryKey: ['posts'] });

      const previousPosts = queryClient.getQueryData(['posts']);

      queryClient.setQueryData(['posts'], (old: any) => { old.data = [newData, ...old.data]; return old; });

      return { previousPosts };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['posts'], context?.previousPosts)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const handleClose = () => {
    setOpen(false);
    navigate('/');
  };
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

  return (
    <FormDialog title="Create New Post" content="Write your post below" open={open} handleClose={handleClose} onSubmit={handleSubmit} >
      <TextField
        autoFocus
        required
        margin="dense"
        id="title"
        name="title"
        label="Title"
        type="text"
        fullWidth
        variant="standard"
      />
      <TextField
        id="description"
        name="description"
        type="text"
        label="Description"
        multiline
        fullWidth
        variant="standard"
      />
    </FormDialog>
  );
}