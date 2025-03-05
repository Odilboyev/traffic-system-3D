# Traffic System 3D

A React-based traffic monitoring system with 3D visualization using MapLibre.

## Development

```bash
npm install
npm run dev
```

## Deployment

This project is configured for deployment on Vercel.

### Deployment Notes

- The project uses `rc-slider` for range input sliders, which is compatible with React 18.
- A `vercel.json` file is included to configure the build process.
- If you encounter dependency conflicts during deployment, you may need to use the `--legacy-peer-deps` flag during installation.

## Tech Stack

- React 18
- Vite
- MapLibre GL
- Tailwind CSS
