import { PropaneSharp } from "@mui/icons-material"
import { Box, Card, Typography } from "@mui/material"
import React from "react"

export interface VideoCardProps {
    thumb: string,
    title: string,
    channel: string,
    description: string
}

const VideoCard = (props: { data: VideoCardProps | undefined }) => {
    const height = { xs: "150px", md: "250px" }

    if (props.data) {
        return (
            <Card sx={{ height: height, width: "100%", mt: "12px" }}>
                <Box display="flex" alignItems="center">
                    <Box component="img" src={props.data.thumb} sx={{ height: height }} />
                    <Box display="flex" flexDirection="column" sx={{ ml: "12px", height: height, justifyContent: "space-evenly" }}>
                        <Typography variant="h6">{props.data.title}</Typography>
                        <Typography variant="caption">{props.data.channel}</Typography>
                        <Typography variant="body1">{props.data.description}</Typography>
                    </Box>
                </Box>
            </Card>
        )
    }
    return <React.Fragment />
}

export default VideoCard