# "Nothing Happened." — Meta ad, ready to upload

Video files (rendered from `src/ad3`, 20 s, 30 fps, H.264 + AAC):

| File | Use it for |
|---|---|
| `out/eljoshurdhi-NothingHappened-Reels-9x16.mp4` | Instagram/Facebook Reels and Stories |
| `out/eljoshurdhi-NothingHappened-Feed-4x5.mp4` | Facebook and Instagram feed |
| `out/eljoshurdhi-NothingHappened-Square-1x1.mp4` | Everywhere else (right column, Marketplace…) |

Re-render: `npx remotion render Ad3-Reels-9x16 out/<name>.mp4` (or `Ad3-Feed-4x5`, `Ad3-Square-1x1`).
Thumbnail: frame 0 ("A customer tapped." over the glowing Book now button) is built as the
thumbnail — upload it as the custom thumbnail if Meta picks another frame:
`npx remotion still Ad3-Reels-9x16 out/thumb.png --frame=0`.

Before the ad runs, **eljoshurdhi.com must be registered and pointed at the site** — it is the
address in the video and the link below.

## Primary text (pick one)

**A — the story**
A customer tapped "Book now" on your website. Nothing happened. So they booked with someone else.

I build websites that turn visitors into calls, bookings and sales:
• Fixed price, in writing, before work starts
• You talk directly to me, the person building it
• Live in weeks, not months

Websites from $649 → eljoshurdhi.com

**B — short**
Is your website quietly sending customers to your competitors? Get one built to bring you calls,
bookings and sales. Fixed price. Live in weeks. From $649.

## Headline
Websites that bring you customers

## Description
Fixed price, in writing. Live in weeks.

## Button
Learn More (or Get Quote)

## Link
https://eljoshurdhi.com (display link: eljoshurdhi.com)

## Notes
- Every example in the video is clearly a demo ("Luna Café" carries a DEMO tag, the broken site
  is `yourbusiness.example`). No invented numbers, reviews or client logos.
- The phone and notifications are generic drawings (no Apple/Android branding), kept mid-frame,
  which keeps them clear of Meta's rule on fake system UI.
