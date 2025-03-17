import { Link } from 'react-router-dom'

//images
import logoDark from '@/assets/images/logo-dark.png'
import indusindlogo from '@/assets/images/indusind.png'
import logoSm from '@/assets/images/favicon.ico'
import { getMenuItems, useAuthContext } from '@/common'
import AppMenu from './Menu'
import SimpleBar from 'simplebar-react'
import { filterMenuByRole } from '@/constants/filterMenuByRole'

const SideBarContent = () => {
	const { user } = useAuthContext();
	const role = user?.roles || 'Guest';

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
			<div className="leftside-menu menuitem-active bg-white  ">
				<Link to="/" className="logo logo-light bg-white p-0">
					<span className="logo-lg" >
						<div className='fw-bold fs-1'> PPAC Portal </div>
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</Link>
				<a href="index.html" className="logo logo-dark bg-white">
					<span className="logo-lg ">
						<img src={logoDark} alt="dark logo" />
					</span>
					<span className="logo-sm">
						<img src={logoSm} alt="small logo" />
					</span>
				</a>
				<SimpleBar
					className="h-100 "
					id="leftside-menu-container"
					data-simplebar=""
				>
					<SideBarContent />
					<div className="clearfix" />
				</SimpleBar>
				<div className='position-absolute bottom-0 w-100 text-center bg-white' >
					<img src={indusindlogo} alt="" style={{ width: 'inherit' }} />
				</div>
			</div>
		</>
	)
}

export default LeftSidebar
