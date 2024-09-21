import { IoCloseCircleOutline, IoReorderThreeOutline } from 'react-icons/io5'

export default function Toggle() {
	return (
		<label className="z-40 [grid-area:toggle] md:hidden">
			<input id="header-open" type="checkbox" hidden />
			<span className="text-4xl font-bold header-closed:hidden">
				<IoCloseCircleOutline />
			</span>
			<span className="text-5xl header-open:hidden">
				<IoReorderThreeOutline />
			</span>
		</label>
	)
}
