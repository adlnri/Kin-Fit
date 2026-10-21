/* Copies the files the app ships into dist/ (Netlify publishes that folder). */
import { cpSync, mkdirSync, rmSync } from 'node:fs';

const FILES = ['index.html', 'manifest.webmanifest', 'sw.js', '_headers', 'styles.css',
  'engine.js', 'circuits.js', 'i18n-data.js', 'i18n.js', 'meals.js', 'stickers.js', 'ai.js', 'app.js', 'fonts', 'icons', 'images'];

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist');
FILES.forEach((f) => cpSync(f, `dist/${f}`, { recursive: true }));
console.log(`dist/ : ${FILES.length} entrées copiées`);
