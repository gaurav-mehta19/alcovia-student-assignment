import { createApp } from './app';

const PORT = process.env.PORT || 3000;

createApp().listen(PORT, () => {
  console.log(`Alcovia API running on http://localhost:${PORT}`);
});
