import { getDateRange } from "@/app/lib"
import { TZDate } from "@date-fns/tz";
import { formatDistance, isAfter } from "date-fns"
import { useEffect, useMemo, useState } from "react";

export const VotingPeriod = ({ className }: { className: string }) => {
    
  const [time, setTime] = useState<Date>(new Date())

    // display period of voting on a calendar or something?
    const voteRange = getDateRange({ fromDay: 1, fromTime: "00:00", toDay: 6, toTime: "22:00" })

    const votingClosed = useMemo(()=>{
        const today = new TZDate(Date.now(), 'America/New_York');
        return isAfter(today, voteRange.endDate)
    },[])

      // make relative dates update, this is probably not the best way to do this but should be fine if we only display a few items
      useEffect(() =>{
        const interval = setInterval(()=>{
          setTime(new Date())
        }, 5000)
    
        return () =>{
          clearInterval(interval)
        }
      },[])
    return (
        <p className={className}>
            {votingClosed &&
                `voting start in: ${time && formatDistance(new Date(), voteRange.startDate)}`
            }
            {!votingClosed &&
                `vote ends in: ${time && formatDistance(new Date(), voteRange.endDate)}`
            }
        </p>
    )
}