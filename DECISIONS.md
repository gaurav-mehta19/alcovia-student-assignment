# Decisions

For each non-obvious choice you made, explain **why** (not what). Honest assessment of tradeoffs matters more than sounding impressive.

## State Management

I used **TanStack Query (React Query)** for all server state, and plain local `useState` for ephemeral UI state (timer countdown, selected filter, open sheet).

Server state and UI state have different needs, and conflating them (e.g. dumping API responses into Redux or Context) means hand-writing caching, deduping, retries, and loading/error bookkeeping. React Query gives me: a cache keyed per-query so the Dashboard and History don't refetch on every focus, automatic retry with backoff, `useInfiniteQuery` for cursor pagination, and `invalidateQueries` so that after the timer POSTs a session, the Dashboard stats, streak, and History list all refresh without manual wiring. I explicitly disable retries on 4xx (a 404 won't fix itself) but retry twice on network/5xx.

I skipped Redux/Zustand because there is almost no cross-screen *client* state here — the "shared" state is really server state, which is exactly React Query's job.

## API Integration

The date-format inconsistency is handled at the **two boundaries**, not scattered through the UI.

- **Server side**, `lib/serialize.ts` is the single place shapes are produced. `toSessionListItem` emits `startedAt`/`completedAt` as epoch-ms numbers; `toSessionDetail` converts the same stored epoch to ISO strings. The rest of the codebase never re-derives dates, so the quirk lives in exactly one file.
- **Client side**, `lib/format.ts` exposes `parseApiDate(value: number | string)` which accepts *either* format and returns a `Date`. Every screen formats through `formatRelative` / `formatFullDate`, which call `parseApiDate`. So the History list (numbers) and the Session Detail screen (ISO strings) both render correctly with no per-screen branching.

Storing the canonical value as epoch-ms in SQLite (an integer column) also makes keyset pagination and range filters correct and index-friendly; ISO is only a presentation format at the detail edge.

## Pagination

Cursor pagination is **keyset-based**, not offset. The cursor is an opaque base64url payload (`{ startedAt, id }`) produced by `lib/cursor.ts`. The query orders by `started_at DESC, id DESC` and, given a cursor, filters `started_at < cur OR (started_at = cur AND id < curId)` — the `id` tiebreak makes ordering stable even when two sessions share a timestamp. I fetch `limit + 1` rows to compute `hasMore` without a second `COUNT` query.

The client uses `useInfiniteQuery`; `getNextPageParam` returns the response `cursor`, which is `null` on the last page, which React Query treats as "no more pages". When the user scrolls past the last page, `onEndReached` is guarded by `hasNextPage`, so no request fires and the list shows a "You've reached the end" footer instead of spinning forever. A malformed cursor decodes to a `400 BAD_REQUEST` rather than a 500.

## Edge Cases

- **API down / unreachable:** `apiFetch` normalizes network failures into a typed `ApiError` (`NETWORK`). Each screen renders a `StateView` with a friendly message and a **Retry** button that re-runs the query. React Query also retries transient failures twice with backoff before surfacing the error.
- **Request takes 10 seconds:** `apiFetch` uses an `AbortController` with a 10s timeout, so a hung request fails deterministically as a `TIMEOUT` error and shows the retry state instead of hanging. While in-flight, screens show **skeletons** (not spinners) so the layout is stable.
- **0 sessions:** History shows a dedicated empty `StateView` ("No sessions here yet") that's distinct from the error state — an empty filter result is not a failure. The Dashboard progress ring and week chart both handle zero gracefully (no division by zero; a minimum bar sliver keeps the chart readable).
- **A render-time crash:** a top-level `ErrorBoundary` (wrapping the whole app in `app/_layout.tsx`) catches component errors and shows the same `StateView` with a "Try again" reset, so a bug degrades to a recoverable screen instead of a white flash.
- **Fresh clone / empty DB:** the server auto-seeds when the `students` table is empty, so `npm run dev` without a prior `npm run seed` still returns data instead of 404s.

Interactive controls (filter pills, back/close buttons, session and achievement cards) carry `accessibilityRole`/`accessibilityLabel` so the app is usable with a screen reader, not just by sighted users.

## Session Detail

The list row already answers "what and when." The detail screen answers **"how did that session actually go,"** so I led with the payoff (coins earned, big and green), the essentials (type, duration, exact start/finish times), and then the **timeline breakdown** — a proportional focus/break bar plus a per-segment list. The timeline is the one piece of data you *can't* see anywhere else in the app, and it visually distinguishes a clean 25-minute Pomodoro from a Deep Focus that was broken up by a break.

I deliberately left off raw IDs, the student ID, and millisecond precision — they're real fields but they're noise to a student looking at their own session. The screen is a stack `card` with a back affordance, reachable only by tapping a History row, which keeps the tab bar for top-level navigation.

## What's Weak

The weakest remaining part is **timezone handling in the weekly stats**. `buildWeeklyStats` now buckets by day with an indexed SQL `GROUP BY` (`strftime('%w', …)`), but it uses the *server's* local timezone, so a student in a different timezone could see a session land on the "wrong" day near midnight. With more time I'd make the period window timezone-aware by accepting the client's UTC offset and passing it into the query.

Second: my automated coverage is unit-level — jest on the API (pagination, cursor, date-format contract) and on the client date/format layer — but I don't have full React Native component (RTL) tests exercising, say, the History empty/error render branches. I verified those via typecheck + a production bundle + manual flows; component render tests would be the next target.

Third, smaller: coins are computed from a fixed per-type map on the server rather than from actual duration, and the app is single-student (`stu_01` hardcoded) — both fine for the assignment's scope but not how a real product would model it.

## What Breaks at Scale

With 10,000 concurrent users, the first thing to break is **`better-sqlite3` being synchronous and single-writer**. Every query blocks the Node event loop; under load, request latency climbs and the single POST writer serializes all session creation. Reads are fine (WAL, indexed), writes are the bottleneck.

What I'd change, in order: (1) move to Postgres so writes aren't globally serialized and I get real connection pooling; (2) the weekly stats query — while now a single indexed `GROUP BY` rather than JS bucketing — is still recomputed uncached per request, so it becomes the next hot spot; I'd cache it per student (short TTL) or maintain a rollup table updated on write; (3) add pagination `limit` ceilings (already capped at 50) and rate-limiting on the write endpoint; (4) the keyset cursor design already scales — it doesn't degrade on deep pages the way `OFFSET` does, so pagination itself is not a scaling concern.

A note on the **seed data**: the fixtures' epoch timestamps were dated ~2 years in the past while the ISO timeline fields were current, which would make the Dashboard show an empty week and `0/3` today on first run. I treated the stale epochs as unintended and **rebase the demo data to "now" at seed time** (preserving the relative day spacing), so the app is populated whenever it's seeded. This also reproduces the design's "2/3 today" state exactly.

---

## (Bonus) Achievements Screen

I built a two-column grid over a summary header. The header carries a progress ring showing overall completion (unlocked / 12) plus motivational copy, echoing the Dashboard's "Today's Progress" card so the screen feels part of the same product.

For **locked vs unlocked**, I avoided a hard grayscale wall because every achievement has *progress*, and hiding it kills motivation. Unlocked cards get the amber accent, a filled icon, and an "Unlocked" tag. Locked cards keep the icon but muted, add a small lock badge, and — critically — show a **progress bar with `current/target`** so you can see how close you are. Tapping any card opens a bottom-sheet with the description, a progress ring around the icon, and either the unlock date or the exact remaining count. Cards stagger in with a `FadeInDown` on mount.

## (Bonus) Focus Timer

No spec, so I designed the smallest thing that closes the loop: **pick a type → run a countdown → bank the session.** Setup is a radio-style type picker (each type maps to a duration). Running shows a large sweeping progress ring (Reanimated, UI-thread, linear 1s sweep so it glides rather than steps) with Pause/Resume and two escape hatches: **Give up** (discards, warning haptic, no POST) and **Finish** (banks the elapsed time now). On natural completion or Finish, it POSTs to `POST /students/:id/sessions`, fires a success haptic, and shows a celebration screen with the coins earned; `invalidateQueries` then refreshes the Dashboard and History underneath. If the POST fails, the completion screen shows an error with a **Try again** button rather than losing the session silently.

I intentionally left out background/lock-screen timing, notifications, custom durations, and persistence across app kill — all reasonable v2 features, but none are needed to demonstrate the create-session flow, and each adds real platform complexity (background tasks, notification permissions) disproportionate to a timer demo.

## (Bonus) Tests

One runner (**jest**) across both packages — `ts-jest` for the Node server, `jest-expo` for the app. **Server (13 tests):** the two things the challenge names — cursor encode/decode (round-trip, url-safety, malformed → error) and pagination behaviour (`hasMore` across pages, `null` cursor on the last page, limit clamping) — plus the **date-format contract** asserted end-to-end via supertest (list returns epoch-ms *numbers*, detail returns ISO *strings*), the 404 error shape, and POST validation. Tests run against an isolated temp DB (`DB_PATH` override) so they don't touch the dev data. **App (jest, 8 tests):** the client date/format layer (`parseApiDate` accepting both formats, `formatDuration`, `formatClock`, `formatRelative`'s Today/Yesterday/weekday logic), which is the piece most likely to break silently across the two API date formats.

## (Bonus) Animations & Polish

Everything animated runs on the **UI thread via Reanimated**, so it stays at 60fps even while JS is busy fetching: staggered `FadeInDown` section entrances, the progress rings drawing via `useAnimatedProps` on the SVG stroke, the week-chart bars growing on mount, press-scale on every pressable, and the timer's countdown ring sweeping linearly (1s) rather than stepping. Loading states are **skeletons, not spinners**, so layout doesn't jump when data arrives. **Haptics** punctuate meaningful moments — selection on tab/filter/type changes, medium impact on primary actions, success on session completion, warning on give-up. The intent is that the app *feels* native, not just looks it.

## (Bonus) n8n Workflow

Not implemented (intentionally out of scope for this submission). The API layer is ready for it: session creation is transactional and the `streak_notifications` table (with its `UNIQUE(student_id, day)` constraint) is in place, so idempotency would be enforced at the DB level — the webhook fire would be gated on a successful insert into that table, guaranteeing one notification per student per day.
