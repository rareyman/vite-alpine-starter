import '../styles/main.css'
import Alpine from 'alpinejs'

// Optional: import any Alpine plugins here
// import persist from '@alpinejs/persist'
// Alpine.plugin(persist)

const THEME_STORAGE_KEY = 'twv3-theme'

const updateToggleLabel = (theme) => {
	const toggleButton = document.getElementById('theme-toggle')
	if (!toggleButton) {
		return
	}
	const label = theme === 'dark' ? toggleButton.dataset.darkLabel : toggleButton.dataset.lightLabel
	if (label) {
		toggleButton.textContent = label
	}
	toggleButton.setAttribute('aria-pressed', theme === 'dark')
}

const setTheme = (theme) => {
	const root = document.documentElement
	root.classList.toggle('dark', theme === 'dark')
	updateToggleLabel(theme)
}

const getPreferredTheme = () =>
	localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'

setTheme(getPreferredTheme())

document.addEventListener('DOMContentLoaded', () => {
	const toggleButton = document.getElementById('theme-toggle')
	if (toggleButton) {
		updateToggleLabel(getPreferredTheme())
		toggleButton.addEventListener('click', () => {
			const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
			setTheme(nextTheme)
			localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
		})
	}
})

window.Alpine = Alpine
Alpine.start()
