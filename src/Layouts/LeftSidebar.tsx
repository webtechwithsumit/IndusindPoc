import { Link } from 'react-router-dom'

//images
import logoDark from '@/assets/images/logo-dark.png'
import logoSm from '@/assets/images/logo-sm.png'
import { getMenuItems, useAuthContext } from '@/common'
import AppMenu from './Menu'
import SimpleBar from 'simplebar-react'
import { filterMenuByRole } from '@/constants/filterMenuByRole'

/* Sidebar content */
const SideBarContent = () => {
	const { user } = useAuthContext(); // Assuming role is stored in `user.role`
	const role = user?.roles || 'Guest'; // Default role as Guest

	// Filter menu items based on the role
	const menuItems = filterMenuByRole(getMenuItems(), role);
	return (
		<>
			<AppMenu menuItems={menuItems} />
			<div className="clearfix" />
		</>
	)
}
const LeftSidebar = () => {
	return (
		<>
			<div className="leftside-menu menuitem-active bg-white">
				<Link to="/" className="logo logo-light">
					<span className="logo-lg" >
						<div className='fw-bold fs-1'> PPAC Portal </div>
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</Link>
				<a href="index.html" className="logo logo-dark">
					<span className="logo-lg">
						<img src={logoDark} alt="dark logo" />
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</a>
				<SimpleBar
					className="h-100"
					id="leftside-menu-container"
					data-simplebar=""
				>
					<SideBarContent />
					<div className="clearfix" />
				</SimpleBar>
			</div>
		</>
	)
}

export default LeftSidebar
