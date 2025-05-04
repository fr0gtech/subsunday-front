import { useAppStore } from '@/store/store';
import { TZDate } from '@date-fns/tz';
import { formatDistance, formatISO, isAfter, isBefore } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
const today = new TZDate(Date.now(), 'America/New_York');

export const VotingPeriod = ({ className }: { className: string }) => {
  const [time, setTime] = useState<Date>(new Date());
  const { selectedRange } = useAppStore()
  // display period of voting on a calendar or something?

  const votingClosed = useMemo(() => {
    return isAfter(today, selectedRange.currentPeriod.endDate) && isBefore(today, selectedRange.currentPeriod.nextStartDate)
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
        {formatISO(selectedRange.lastPeriod.startDate)}<br />
        {formatISO(selectedRange.lastPeriod.endDate)}<br />
        {formatISO(selectedRange.lastPeriod.nextStartDate)}<br />
      </span>
      <br />
      current Period:<br />
      <span className='text-tiny'>
        {formatISO(selectedRange.currentPeriod.startDate)}<br />
        {formatISO(selectedRange.currentPeriod.endDate)}<br />
        {formatISO(selectedRange.currentPeriod.nextStartDate)}<br />
      </span>
      <br /> */}
      {votingClosed && `voting starts in ${time && formatDistance(today, selectedRange.currentPeriod.nextStartDate)}`}
      {!votingClosed && `${isAfter(selectedRange.currentPeriod.endDate, today) ? "voting ends" : "voting ended"} ${time && formatDistance(selectedRange.currentPeriod.endDate, today, { addSuffix: true })}`}
      <br />
    </span>
  );
};
