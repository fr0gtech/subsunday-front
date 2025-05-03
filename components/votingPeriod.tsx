import { getDateRange } from "@/app/lib"
import { formatDistance, isAfter } from "date-fns"

export const VotingPeriod = ({ className }: { className: string }) => {
    // display period of voting on a calendar or something?
    const voteRange = getDateRange({ fromDay: 1, fromTime: "00:00", toDay: 6, toTime: "22:00" })
    const votingClosed = isAfter(new Date(), voteRange.endDate)

    return (
        <p className={className}>
            {votingClosed &&
                `voting start in: ${formatDistance(new Date(), voteRange.startDate)}`
            }
            {!votingClosed &&
                `vote ends in: ${formatDistance(new Date(), voteRange.endDate)}`
            }
        </p>
    )
}