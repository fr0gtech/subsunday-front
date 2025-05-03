import { getDateRange } from "@/app/lib"
import { TZDate } from "@date-fns/tz";
import { formatDistance, isAfter } from "date-fns"
import { useMemo } from "react";

export const VotingPeriod = ({ className }: { className: string }) => {
    // display period of voting on a calendar or something?
    const voteRange = getDateRange({ fromDay: 1, fromTime: "00:00", toDay: 6, toTime: "22:00" })

    const votingClosed = useMemo(()=>{
        const today = new TZDate(Date.now(), 'America/New_York');
        return isAfter(today, voteRange.endDate)
    },[])

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