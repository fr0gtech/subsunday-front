# Sub Sunday Frontend

This is the frontend of [sub-subday.com](http://sub-sunday.com) written with [next.js](https://nextjs.org) with [heroUi](http://heroui.com) and tailwindcss.

![image](/public/og.png)

## ToDo/Open questions

1. Exact vote cutoff time and date
2. Banned games
   1. what to do when a user votes for a banned game?
      1. can user vote again or no?

## Backend

The backend can be found [here](https://github.com/fr0gtech/subsunday-back)

## Features

- Realtime updates with socket.io
- Home
  - List of top 30 most voted games for this sub sunday
- Votes
  - List of last 10 votes
- Leaderboard (overall)
  - Top chatter by vote amount
  - Top chatter by streak
  - Top Game by vote
- Light/Dark theme

## Development

Check .env file

_requirements_:

- Nodejs & pnpm
- Optional: postgresql
- Optional: Backend

1. `pnpm install`
2. `pnpm dev`
