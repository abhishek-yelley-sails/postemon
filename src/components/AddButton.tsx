import AddIcon from '@mui/icons-material/Add';
import Zoom from '@mui/material/Zoom';
import Fab from '@mui/material/Fab';
import { Tooltip, useTheme } from '@mui/material';

export default function AddButton({ onClick }: { onClick: (e: React.MouseEvent<HTMLElement>) => void }) {
  const theme = useTheme();
  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };
  const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
  };
  return (
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
        <Fab sx={fabStyle} aria-label={'Add'} color={'primary'} onClick={onClick}>
          {<AddIcon />}
        </Fab>
      </Zoom>
    </Tooltip>
  );
}