import { useAppStore } from '@/store/store';
import { TZDate } from '@date-fns/tz';
import { formatDistance, formatISO, isAfter, isBefore } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';

export const VotingPeriod = ({ className }: { className: string }) => {
  const [time, setTime] = useState<Date>(new Date());
  const { currentRange } = useAppStore()
  // display period of voting on a calendar or something?

  const votingClosed = useMemo(() => {
    const today = new TZDate(Date.now(), 'America/New_York');
    return isAfter(today, currentRange.currentPeriod.endDate) && isBefore(today, currentRange.currentPeriod.nextStartDate)
  }, []);

  // make relative dates update, this is probably not the best way to do this but should be fine if we only display a few items
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <span className={className}>
      {/* <br />
      last Period:<br />
      <span className='text-tiny'>
        {formatISO(voteRange.lastPeriod.startDate)}<br />
        {formatISO(voteRange.lastPeriod.endDate)}<br />
        {formatISO(voteRange.lastPeriod.nextStartDate)}<br />
      </span>
      <br />
      current Period:<br />
      <span className='text-tiny'>
        {formatISO(voteRange.currentPeriod.startDate)}<br />
        {formatISO(voteRange.currentPeriod.endDate)}<br />
        {formatISO(voteRange.currentPeriod.nextStartDate)}<br />
      </span>
      <br /> */}
      {votingClosed && `voting starts in ${time && formatDistance(new TZDate(Date.now(), 'America/New_York'), currentRange.currentPeriod.nextStartDate)}`}
      {!votingClosed && `voting ends in ${time && formatDistance(new TZDate(Date.now(), 'America/New_York'), currentRange.currentPeriod.endDate)}`}
      <br />
    </span>
  );
};
