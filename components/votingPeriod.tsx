import { getDateRange } from "@/app/lib"
import { TZDate } from "@date-fns/tz";
import { formatDistance, isAfter, isBefore } from "date-fns"
import { useEffect, useMemo, useState } from "react";

export const VotingPeriod = ({ className }: { className: string }) => {
    
  const [time, setTime] = useState<Date>(new Date())

    // display period of voting on a calendar or something?
    const voteRange = getDateRange()

    const votingClosed = useMemo(()=>{
        const today = new TZDate(Date.now(), 'America/New_York');
        return isBefore(today, voteRange.startDate)
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
        <span className={className}>
            {votingClosed &&
                `voting start in: ${time && formatDistance(new Date(), voteRange.startDate)}`
            }
            {!votingClosed &&
                `voting ends in ${time && formatDistance(new Date(), voteRange.endDate)}`
            }
        </span>
    )
}