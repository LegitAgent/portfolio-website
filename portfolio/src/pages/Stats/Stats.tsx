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

async function fetchGithubStats() {
  const response = await fetch(`${CLOUDFLARE_GATEWAY}api/github/LegitAgent`);

  if (!response.ok) {
    throw new Error('Could not load Github statistics');
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
  
  const [github, setGithub] = useState<LeetCodeStatsResponse | null>(null);
  const [isLoadingGit, setIsLoadingGit] = useState<boolean>(true);
  const [hasErrorGit, setHasErrorGit] = useState<boolean>(false);

  useEffect(() => {
    async function setLeetcodeStats() {
      try {
        setGithub(await fetchGithubStats());
      } catch {
        setHasErrorGit(true);
      } finally {
        setIsLoadingGit(false);
      }
    }

    setLeetcodeStats();
  }, []);

  console.log(leetcode);
  console.log(github);

  return (
    <></>
  );
}

export default Stats;