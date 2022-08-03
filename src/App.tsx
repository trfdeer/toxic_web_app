import { Alert, AppBar, Box, Button, Card, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Stack, TextField, Toolbar, Typography } from "@mui/material"
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState } from "react";
import VideoCard, { VideoCardProps } from "./components/VideoCard";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const App = () => {
  const [apiServer, setApiServer] = useState("https://4e82-185-195-233-143.eu.ngrok.io") // TODO: Remove before committing
  const [invidousInstance, setInvidousInstance] = useState("https://invidious.sethforprivacy.com/api/v1")

  const [videoInfoLoading, setVideoInfoloading] = useState(false)
  const [videoInfoError, setVideoInfoError] = useState("")

  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState("")

  const [maxCommentCount, setMaxCommenCount] = useState(100)
  const [commentData, setCommentData] = useState([])

  const [videoLinkInput, setVideLinkInput] = useState("")
  const [settingsOpen, setSettingsOpen] = useState(false)

  const [videoDataProps, setVideoDataProps] = useState<VideoCardProps>()
  const [pageSize, setPageSize] = React.useState<number>(10);


  const fetchVideoData = () => {
    setVideoDataProps(undefined)
    setVideoInfoloading(false)
    setVideoInfoError("")

    const videoId = videoLinkInput.split("=")[1]
    fetch(`${invidousInstance}/videos/${videoId}`).then(res => {
      res.json().then(data => {
        setVideoInfoloading(false)
        setVideoDataProps({
          channel: data["author"],
          description: data["description"],
          thumb: data["videoThumbnails"][0]["url"],
          title: data["title"]
        })
      }).catch(err => {
        setVideoInfoloading(false)
        setVideoInfoError(`Couldn't parse video info: ${err}`)
      })
    }).catch(err => {
      setVideoInfoloading(false)
      setVideoInfoError(`Couldn't get video info: ${err}`)
    })
    setVideoInfoloading(true)
    fetchCommentPredictions()
  }

  const fetchCommentPredictions = () => {
    setCommentData([])
    setCommentsLoading(false)
    setCommentsError("")

    const videoId = videoLinkInput.split("=")[1]

    fetch(`${apiServer}/video?v=${videoId}`).then(res => {
      res.json().then(data => {
        setCommentsLoading(false)
        setCommentData(data)
      }).catch(err => {
        setCommentsLoading(false)
        setCommentsError(`Couldn't parse comments: ${err}`)
      })
    }).catch(err => {
      setCommentsLoading(false)
      setCommentsError(`Couldn't get comments: ${err}`)
    })

    setCommentsLoading(true)
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.1, resizable: true },
    { field: "text", headerName: "Comment Text", flex: 0.5, resizable: true },
    { field: "polarity", headerName: "Polarity", flex: 0.1, resizable: true },
    { field: "label", headerName: "Classification", flex: 0.1, resizable: true }
  ]

  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Container sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" component="div">
              Toxic App
            </Typography>
            <IconButton onClick={_ => setSettingsOpen(true)}>
              <SettingsIcon />
            </IconButton>
          </Container>
        </Toolbar>
      </AppBar>


      <Container sx={{ mt: "10px" }}>
        <Stack direction="row" spacing={1}>
          <TextField variant="outlined" label="Video URL" fullWidth value={videoLinkInput} onChange={ev => setVideLinkInput(ev.target.value)} />
          <Button variant="contained" onClick={_ => fetchVideoData()}>Go!</Button>
        </Stack>

        {videoInfoLoading && <CircularProgress />}
        {videoInfoError.length > 0 &&
          <Alert severity="error">{videoInfoError}</Alert>
        }
        <VideoCard data={videoDataProps} />

        {commentsLoading && <CircularProgress />}
        {commentsError.length > 0 &&
          <Alert severity="error">{commentsError}</Alert>
        }
        {commentData.length > 0 &&
          <Box sx={{ height: 600, width: '100%', display: 'flex' }}>
            <Box sx={{ flexGrow: 1 }}>
              <DataGrid
                sx={{ mt: "12px" }}
                rows={commentData}
                columns={columns}
                rowsPerPageOptions={[5, 10, 20, 50, 100]}
                checkboxSelection
                disableSelectionOnClick
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                pagination
              />
            </Box>
          </Box>
        }
      </Container>


      <Dialog open={settingsOpen} onClose={_ => setSettingsOpen(false)}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Configure server instances
          </DialogContentText>
          <TextField
            margin="dense"
            label="API Server URL"
            fullWidth
            variant="outlined"
            value={apiServer}
            onChange={ev => setApiServer(ev.target.value)} />
          <TextField
            margin="dense"
            label="Invidious API URL"
            fullWidth
            variant="outlined"
            value={invidousInstance}
            onChange={ev => setInvidousInstance(ev.target.value)} />
          <TextField
            margin="dense"
            label="Max Comment Count"
            fullWidth
            type="number"
            variant="outlined"
            value={maxCommentCount}
            onChange={ev => setMaxCommenCount(parseInt(ev.target.value))} />
        </DialogContent>
        <DialogActions>
          <Button onClick={_ => setSettingsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default App
