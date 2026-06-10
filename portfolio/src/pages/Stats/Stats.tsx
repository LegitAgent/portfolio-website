import './Stats.css';
import type { LeetCodeStatsResponse } from '../../types/stats';
import { CLOUDFLARE_GATEWAY } from '../../config/constants';
import { useEffect, useState } from 'react';

async function fetchLeetcodeStats() {
  const response = await fetch(`${CLOUDFLARE_GATEWAY}api/leetcode/albamartindarius`);

  if (!response.ok) {
    throw new Error('Could not load LeetCode statistics');
  }

  const data = await response.json();
  return data;
}

function Stats() {
  const [leetcode, setLeetcode] = useState<LeetCodeStatsResponse | null>(null);
  const [isLoadingLeet, setIsLoadingLeet] = useState<boolean>(true);
  const [hasErrorLeet, setHasErrorLeet] = useState<boolean>(false);

  useEffect(() => {
    async function setLeetcodeStats() {
      try {
        setLeetcode(await fetchLeetcodeStats());
      } catch {
        setHasErrorLeet(true);
      } finally {
        setIsLoadingLeet(false);
      }
    }

    setLeetcodeStats();
  }, []);
  
  console.log(leetcode);

  return (
    <></>
  );
}

export default Stats;