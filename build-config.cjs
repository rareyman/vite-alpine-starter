/*
 * Configuration that helps keep dev/prod output paths and public URLs aligned
 * with the Parcel version of this starter. Update `publicUrl` when deploying
 * to a subfolder and adjust `outDir`/`devOutDir` if your hosting workflow
 * expects specific directories.
 */

module.exports = {
	publicUrl: '/',
	outDir: 'dist',
	devOutDir: 'dist-dev',
	devPort: 5173,
	previewPort: 4173,
}
