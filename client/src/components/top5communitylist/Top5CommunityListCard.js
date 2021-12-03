
import { Accordion, Card } from "@mui/material"
import { useState, useContext } from "react"
import GlobalStoreContext from "../../context/store"
import Top5CommunityListCardAccordionDetails from "./Top5CommunityListCardAccordionDetails";
import Top5CommunityListCardAccordionSummary from "./Top5CommunityListCardAccordionSummary";

export default function Top5CommunityListCard(props) {
    const { store } = useContext(GlobalStoreContext)
    // const { i, commList, expanded, handleAccorChangeCallback } = props
    const { i, commList } = props
    const [expanded, setExpanded] = useState(false)
    const handleAccorChange = (panel) => (event, isExpanaded) => {
        setExpanded(isExpanaded ? panel : false)
    }
    const like = () => {
        store.likeCommList(commList)
    }
    const dislike = () => {
        store.dislikeCommList(commList)
    }
    const view = () => {
        if (expanded !== commList._id) {
            store.viewCommList(commList)
        }
    }
    const comment = (event) => {
        if (event.key === 'Enter') {
            let comment = event.target.value
            if (comment) {
                store.commentCommList(commList, comment)
                event.target.value = ''
            }
        }
    }
    return (
        <Card sx={{ mb: 1 }} >
            <Accordion
                key={'comm-accor-' + commList._id}
                expanded={expanded === commList._id}
                onChange={handleAccorChange(commList._id)}
                // onChange={handleAccorChangeCallback(commList._id)}
                onClick={view}
                sx={{ backgroundColor: '#e3f2fd' }}
            >
                <Top5CommunityListCardAccordionSummary
                    commList={commList}
                    likeCallback={like}
                    dislikeCallback={dislike}
                />
                <Top5CommunityListCardAccordionDetails
                    i={i}
                    commList={commList}
                    commentCallback={comment}
                />

            </Accordion>
        </Card>
    )
}