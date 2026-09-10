import { inject } from '@vercel/analytics';

inject();

const demoImage = document.querySelector<HTMLImageElement>('#tolstoy-demo');
const stillSource = document.querySelector<HTMLSourceElement>(
  '#tolstoy-demo-still'
);
const playbackToggle = document.querySelector<HTMLButtonElement>(
  '#tolstoy-demo-toggle'
);

if (demoImage && stillSource && playbackToggle) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let playing = !reducedMotion.matches;

  const setPlayback = (animate: boolean) => {
    playing = animate;
    stillSource.media = animate ? 'not all' : 'all';
    playbackToggle.textContent = animate
      ? 'Show still image'
      : 'Play animation';
  };

  setPlayback(playing);
  playbackToggle.hidden = false;
  playbackToggle.addEventListener('click', () => setPlayback(!playing));
  reducedMotion.addEventListener('change', (event) =>
    setPlayback(!event.matches)
  );
}
