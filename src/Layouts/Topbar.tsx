import { Col, Image } from 'react-bootstrap'
import { ThemeSettings, useAuthContext, useThemeContext } from '@/common'
import { Link, useNavigate } from 'react-router-dom'
import Select from 'react-select';
// assets
import logo from '@/assets/images/logo.png'
import logoSm from '@/assets/images/logo-sm.png'
import logoDark from '@/assets/images/logo-dark.png'
import profilePic from '@/assets/images/OIP.jpg'

import { ProfileDropdown } from '@/components'
import { useThemeCustomizer } from '@/components'
import { useViewport } from '@/hooks'
import { useState } from 'react'

export interface MessageItem {
	id: number
	name: string
	subText: string
	avatar: string
	createdAt: Date
}

export interface NotificationItem {
	id: number
	title: string
	icon: string
	variant: string
	createdAt: Date
}

export interface ProfileOption {
	label: string
	icon: string
	redirectTo: string
}

const profileMenus: ProfileOption[] = [
	{
		label: 'MyProfile',
		icon: 'ri-customer-service-2-line',
		redirectTo: '/pages/profile',
	},
	{
		label: 'Logout',
		icon: 'ri-logout-box-line',
		redirectTo: '/auth/logout',
	},
]

type TopbarProps = {
	topbarDark?: boolean
	toggleMenu?: () => void
	navOpen?: boolean
}

const Topbar = ({ toggleMenu, navOpen }: TopbarProps) => {
	const { sideBarType } = useThemeCustomizer()
	const { width } = useViewport()
	const { user, updateRole } = useAuthContext()
	const { updateSidebar } = useThemeContext()
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)

	// Handle sidebar toggle on mobile and desktop
	const handleLeftMenuCallBack = () => {
		if (width < 768) {
			if (sideBarType === 'full') {
				showLeftSideBarBackdrop()
				document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
			} else {
				updateSidebar({ size: ThemeSettings.sidebar.size.full })
			}
		} else if (sideBarType === 'condensed') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
		} else if (sideBarType === 'full') {
			showLeftSideBarBackdrop()
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
		} else if (sideBarType === 'fullscreen') {
			updateSidebar({ size: ThemeSettings.sidebar.size.default })
			document.getElementsByTagName('html')[0].classList.add('sidebar-enable')
		} else {
			updateSidebar({ size: ThemeSettings.sidebar.size.condensed })
		}
	}

	// Creates backdrop for left sidebar
	const showLeftSideBarBackdrop = () => {
		const backdrop = document.createElement('div')
		backdrop.id = 'custom-backdrop'
		backdrop.className = 'offcanvas-backdrop fade show'
		document.body.appendChild(backdrop)

		backdrop.addEventListener('click', function () {
			document.getElementsByTagName('html')[0].classList.remove('sidebar-enable')
			hideLeftSideBarBackdrop()
		})
	}

	// Remove sidebar backdrop
	const hideLeftSideBarBackdrop = () => {
		const backdrop = document.getElementById('custom-backdrop')
		if (backdrop) {
			document.body.removeChild(backdrop)
			document.body.style.removeProperty('overflow')
		}
	}

	// Handle role change
	const handleRoleChange = (selectedOption: any) => {
		const newRole = selectedOption.value;
		setLoading(true);

		// Simulate an async operation
		setTimeout(() => {
			updateRole(newRole);
			navigate('/');
			setLoading(false);
		}, 1000);
	};

	// Prepare options for react-select
	const roleOptions = user?.multirole?.map((role: any) => ({
		value: role,
		label: role,
	}));

	// Find the currently selected role
	const selectedRole = roleOptions?.find(
		(option: any) => option.value === user?.roles
	);

	return (
		<>
			<div className="navbar-custom">
				<div className="topbar container-fluid">
					<div className="d-flex align-items-center gap-1">

						{/* Topbar Brand Logo */}
						<div className="logo-topbar">
							<Link to="/" className="logo-light">
								<span className="logo-lg">
									<Image src={logo} alt="logo" />
								</span>
								<span className="logo-sm">
									<Image src={logoSm} alt="small logo" />
								</span>
							</Link>

							<Link to="/" className="logo-dark">
								<span className="logo-lg">
									<img src={logoDark} alt="dark logo" style={{ height: '50px' }} />
								</span>
								<span className="logo-sm">
									<img src={logoSm} alt="small logo" />
								</span>
							</Link>
						</div>

						{/* Sidebar Toggle Buttons */}
						<button
							className="button-toggle-menu"
							onClick={handleLeftMenuCallBack}
						>
							<i className="ri-menu-line" />
						</button>

						<button
							className={`navbar-toggle ${navOpen ? 'open' : ''}`}
							data-bs-toggle="collapse"
							data-bs-target="#topnav-menu-content"
							onClick={toggleMenu}
						>
							<div className="lines">
								<span />
								<span />
								<span />
							</div>
						</button>

					</div>

					<ul className="topbar-menu d-flex align-items-center gap-3">
						<div className="my-0 fw-normal d-flex align-items-center">
							<h4 className="text-primary fw-bold mb-0 me-2">Department </h4>
							<h4 className=" fw-normal  text-dark mb-0 me-2">{user?.departmentName}</h4>

						</div>
						<div className="my-0 fw-normal d-flex align-items-center">
							<h4 className="text-primary fw-bold mb-0 me-2">Operate as</h4>
							<Col>
								{user?.multirole && user.multirole.length > 1 ? (
									<div className="d-flex align-items-center">
										<Select
											className=" w-100"
											value={selectedRole}
											onChange={handleRoleChange}
											options={roleOptions}
											isDisabled={loading}
											isSearchable
										/>
										{loading && (
											<span className="spinner-border spinner-border-sm ms-2" />
										)}
									</div>
								) : (
									<h5 className="text-dark">{user?.roles}</h5>
								)}
							</Col>
						</div>

						{/* Profile Dropdown */}
						<li className="dropdown">
							<ProfileDropdown
								menuItems={profileMenus}
								userImage={profilePic}
								username={user?.fullName || 'Guest'}
								userid={user?.userId || 'Guest ID'}
							/>
						</li>

					</ul>
				</div>
			</div>
		</>
	)
}

export default Topbar
