let nav = localStorage.getItem('nav')
export const state = () => ({
	menu: nav ? JSON.parse(nav) : []
})

export const mutations = {
	add (state, text) {
		state.menu.push(text)
	},
	resetState (state)
	{
		state.menu = []
	},
	toggleIsOpen (state, item)
	{
		const items = _.filter(this.menuItems, {level: item.level});
		item.isOpen=!item.isOpen
	}
}