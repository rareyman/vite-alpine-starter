import '../styles/main.css'
import Alpine from 'alpinejs'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Optional: import any Alpine plugins here
// import persist from '@alpinejs/persist'
// Alpine.plugin(persist)

const THEME_STORAGE_KEY = 'microsite-theme'
const THEME_LOCK = {
	enabled: false,
	value: 'light',
}
const MAINTENANCE_CONFIG_URL = '/maintenance.json'
const MAINTENANCE_HTML_URL = '/maintenance.html'
const MAINTENANCE_BODY_CLASS = 'maintenance-body'

const waitForDocumentReady = () =>
	new Promise((resolve) => {
		if (document.readyState !== 'loading') {
			resolve()
			return
		}
		document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
	})

const loadMaintenanceConfig = async () => {
	try {
		const response = await fetch(MAINTENANCE_CONFIG_URL, { cache: 'no-store' })
		if (!response.ok) {
			if (response.status !== 404) {
				console.warn('Maintenance flag fetch failed', response.status)
			}
			return { maintenanceMode: false }
		}
		const payload = await response.json()
		return { maintenanceMode: Boolean(payload.maintenanceMode) }
	} catch (error) {
		console.warn('Unable to load maintenance flag', error)
		return { maintenanceMode: false }
	}
}

const renderMaintenancePage = async () => {
	try {
		const response = await fetch(MAINTENANCE_HTML_URL, { cache: 'no-store' })
		if (response.ok) {
			return response.text()
		}
		console.warn('Maintenance template missing', response.status)
	} catch (error) {
		console.warn('Unable to load maintenance template', error)
	}
	return '<p>Maintenance mode enabled</p>'
}

const updateToggleLabel = (theme) => {
	const toggleButton = document.getElementById('theme-toggle')
	if (!toggleButton) {
		return
	}
	const label = theme === 'dark' ? toggleButton.dataset.darkLabel : toggleButton.dataset.lightLabel
	if (label) {
		toggleButton.setAttribute('aria-label', label)
		toggleButton.setAttribute('title', label)
	}
	toggleButton.dataset.theme = theme
	toggleButton.setAttribute('aria-pressed', theme === 'dark')
}

const setTheme = (theme) => {
	const root = document.documentElement
	root.classList.toggle('dark', theme === 'dark')
	updateToggleLabel(theme)
}

const getPreferredTheme = () => {
	if (THEME_LOCK.enabled) {
		return THEME_LOCK.value
	}
	const stored = localStorage.getItem(THEME_STORAGE_KEY)
	if (stored === 'dark' || stored === 'light') {
		return stored
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const initMobileNav = () => {
	const toggle = document.getElementById('nav-toggle')
	const nav = document.getElementById('primary-nav-mobile')
	if (!toggle || !nav) {
		return
	}
	let isMenuOpen = false
	const mediaQuery = window.matchMedia('(min-width: 768px)')
	const closeButton = nav.querySelector('[data-action="close-mobile-nav"]')
	const mobileLinks = nav.querySelectorAll('[data-mobile-link]')
	const closeMenu = () => {
		if (!isMenuOpen) {
			return
		}
		isMenuOpen = false
		syncNav()
	}
	const syncNav = () => {
		const isDesktop = mediaQuery.matches
		if (isDesktop) {
			nav.classList.add('hidden')
			toggle.setAttribute('aria-expanded', 'true')
		} else {
			nav.classList.toggle('hidden', !isMenuOpen)
			toggle.setAttribute('aria-expanded', String(isMenuOpen))
		}
	}
	syncNav()
	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen
		syncNav()
	}
	toggle.addEventListener('click', toggleMenu)
	if (closeButton) {
		closeButton.addEventListener('click', closeMenu)
	}
	mobileLinks.forEach((link) => {
		link.addEventListener('click', closeMenu)
	})
	const handleMediaChange = () => {
		if (!mediaQuery.matches) {
			isMenuOpen = false
		}
		syncNav()
	}
	if (mediaQuery.addEventListener) {
		mediaQuery.addEventListener('change', handleMediaChange)
	} else if (mediaQuery.addListener) {
		mediaQuery.addListener(handleMediaChange)
	}
}

const initAos = () => {
	AOS.init({
		once: true,
		duration: 700,
		easing: 'ease-out-cubic',
		offset: 120,
	})
}

const startApp = async () => {
	setTheme(getPreferredTheme())
	await waitForDocumentReady()
	const toggleButton = document.getElementById('theme-toggle')
	if (toggleButton) {
		updateToggleLabel(getPreferredTheme())
		if (THEME_LOCK.enabled) {
			toggleButton.setAttribute('aria-disabled', 'true')
			toggleButton.classList.add('opacity-50', 'pointer-events-none')
		} else {
			toggleButton.addEventListener('click', () => {
				const nextTheme = document.documentElement.classList.contains('dark') ? 'light' : 'dark'
				setTheme(nextTheme)
				localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
			})
		}
	}
	initMobileNav()
	initAos()
	window.Alpine = Alpine
	Alpine.start()
}

const bootstrapApp = async () => {
	const maintenanceConfig = await loadMaintenanceConfig()
	if (maintenanceConfig.maintenanceMode) {
		await waitForDocumentReady()
		const markup = await renderMaintenancePage()
		document.body.className = MAINTENANCE_BODY_CLASS
		document.body.innerHTML = markup
		return
	}
	await startApp()
}

bootstrapApp()
