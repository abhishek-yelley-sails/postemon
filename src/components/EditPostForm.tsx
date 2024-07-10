import { TextField } from "@mui/material";
import FormDialog from "./FormDialog";
import { useQuery } from "react-query";
import axios from "axios";
import { useAuth } from "./AuthContextProvider";

// TODO: Should not give option to edit others' post in UI
export default function EditPostForm(
  {
    defaultData,
    open,
    handleClose,
    handleSubmit
  }:
    {
      defaultData: any,
      open: boolean,
      handleClose: () => void,
      handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    }
) {
  const authCtx = useAuth();
  const { data } = useQuery({
    queryFn: () => {
      return axios({
        method: 'get',
        url: 'http://localhost:8080/users/',
        headers: {
          Authorization: 'Bearer ' + authCtx?.getToken(),
        },
      });
    },
    queryKey: [
      'posts',
      {
        action: 'edit/get-user',
      }
    ],
  });

  return (
    <FormDialog title="Edit Post" content={`Edit your post ${data?.data.email}`} open={open} handleClose={handleClose} onSubmit={handleSubmit} >
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
        defaultValue={defaultData.title}
      />
      <TextField
        id="description"
        name="description"
        type="text"
        label="Description"
        multiline
        fullWidth
        variant="standard"
        defaultValue={defaultData.description}
      />
    </FormDialog >
  )
}