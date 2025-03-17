export interface MenuItemTypes {
	key: string
	label: string
	isTitle?: boolean
	icon?: string
	url?: string
	badge?: {
		variant: string
		text: string
	}
	parentKey?: string
	target?: string
	children?: MenuItemTypes[]
	roles?: string[]
}


const MENU_ITEMS: MenuItemTypes[] = [

	{
		key: 'dashboard',
		label: 'Dashboards',
		isTitle: false,
		url: '/',
		icon: 'ri-dashboard-3-line',
		badge: {
			variant: 'success',
			text: '',
		},
	},


	{
		key: 'Masters',
		label: ' System Masters',
		isTitle: false,
		icon: 'ri-settings-3-line',
		url: '/pages/ProductMaster',
		children: [
			{
				key: 'Manage Department',
				label: 'Department Master',
				url: '/pages/DepartmentMaster',
				icon: 'ri-building-line',
				parentKey: 'Masters',
				// roles: ['Convener L2']
			},
			{
				key: 'Manage Role',
				label: ' Role Master',
				url: '/pages/RoleMaster',
				icon: 'ri-calendar-todo-line',
				parentKey: 'Masters',
				// roles: ['Convener L2']
			},
			{
				key: 'Empployee Member',
				label: 'Employee Master',
				url: '/pages/EmployeeMaster',
				icon: 'ri-group-line',
				parentKey: 'Masters',
				// roles: ['Convener L2']
			},
			{
				key: 'Manage Product Type',
				label: 'Product Type Master',
				url: '/pages/ProductTypeMaster',
				icon: 'ri-tools-line',
				parentKey: 'Masters',
				// roles: ['Convener L2']

			},

			{
				key: 'Manage CheckList',
				label: ' CheckList Master',
				url: '/pages/CheckListMaster',
				icon: 'ri-file-list-3-line',
				parentKey: 'Masters',
				// roles: ['Convener L2']
			},


			{
				key: 'Manage Holiday',
				label: ' Holiday Master',
				url: '/pages/Addholiday',
				icon: 'ri-calendar-todo-line',
				parentKey: 'Masters',
				// roles: ['Convener L2']

			},
			{
				key: 'AddProduct',
				label: ' Manage Product',
				url: '/AddProduct',
				icon: 'ri-box-3-line',
				parentKey: 'Masters',
				// roles: ['Initiator']

			},
			{
				key: 'AddProduct',
				label: ' Manage Product',
				url: '/PendingCirculation',
				icon: 'ri-box-3-line',
				parentKey: 'Masters',
				roles: ['SDG Owner']

			},

		],
	},

	{
		key: 'ApprovalTask',
		label: 'Approval',
		icon: 'ri-loop-left-line',
		children: [
			{
				key: 'ApprovalTask',
				label: 'Pending Approvals',
				url: '/pages/ApprovalTask',
				icon: 'ri-slideshow-line',
				parentKey: 'ApprovalTask',
			},
		],
	},




	{
		key: 'Collaboration',
		label: 'Collaboration',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-chat-1-line',
		roles: ['Convener L2'],
		children: [
			{
				key: 'Discussion Forum',
				label: 'Discussion Forum',
				url: '/pages/CommingSoon1',
				icon: 'ri-slideshow-line',
				parentKey: 'Collaboration',
			},
			{
				key: 'Remarks and Comment',
				label: 'Remarks and Comment',
				url: '/pages/CommingSoon2',
				icon: 'ri-slideshow-line',
				parentKey: 'Collaboration',
			},
		],
	},

	{
		key: 'Reports',
		label: 'Reports',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-bar-chart-2-line',
		roles: ['Convener L2'],
		children: [
			{
				key: 'MProduct Status ReportsIS',
				label: 'Product Status Reports',
				url: '/pages/CommingSoon3',
				icon: 'ri-slideshow-line',
				parentKey: 'Reports',
			},
			{
				key: 'Task Performance Report',
				label: 'Task Performance Report',
				url: '/pages/CommingSoon4',
				icon: 'ri-slideshow-line',
				parentKey: 'Reports',
			},
			{
				key: 'Observation  Reports',
				label: 'Observation  Reports',
				url: '/pages/CommingSoon5',
				icon: 'ri-slideshow-line',
				parentKey: 'Reports',
			},
			{
				key: 'Escltion  Repaorts',
				label: 'Esclation  Reports',
				url: '/pages/CommingSoon6',
				icon: 'ri-slideshow-line',
				parentKey: 'Reports',
			},
			{
				key: 'Audit Logs',
				label: 'Audit Logs',
				url: '/pages/CommingSoon7',
				icon: 'ri-slideshow-line',
				parentKey: 'Reports',
			},
		],
	},
	{
		key: 'Email',
		label: 'Email',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-mail-send-line',
		children: [
			{
				key: 'Manage Mail',
				label: 'Manage Mail',
				url: '/pages/CommingSoon8',
				icon: 'ri-slideshow-line',
				parentKey: 'Email',
			},
			{
				key: 'Notification',
				label: 'Notification',
				url: '/pages/CommingSoon9',
				icon: 'ri-slideshow-line',
				parentKey: 'Email',
			},
		],
	},
	{
		key: 'Legal Management',
		label: 'Legal Management',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-shield-line',
		roles: ['Convener L2'],
		children: [
			{
				key: 'Agreements',
				label: 'Agreements',
				url: '/pages/CommingSoon10',
				icon: 'ri-slideshow-line',
				parentKey: 'Legal Management',
			},
			{
				key: 'Approval Workflow',
				label: 'Approval Workflow',
				url: '/pages/CommingSoon11',
				icon: 'ri-slideshow-line',
				parentKey: 'Legal Management',
			},
		],
	},
	{
		key: 'Admin Setting',
		label: 'Admin Setting',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-tools-line',
		children: [
			{
				key: 'Template Management',
				label: 'Template Management',
				url: '/pages/CommingSoon12',
				icon: 'ri-slideshow-line',
				parentKey: 'Admin Setting',
			},
			{
				key: 'Esclation Metrix',
				label: 'Esclation Metrix',
				url: '/pages/CommingSoon13',
				icon: 'ri-slideshow-line',
				parentKey: 'Admin Setting',
			},
			{
				key: 'System Configuration',
				label: 'System Configuration',
				url: '/pages/CommingSoon14',
				icon: 'ri-slideshow-line',
				parentKey: 'Admin Setting',
			},
		],
	},
	{
		key: 'Profile',
		label: 'User Settings',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-user-settings-line',
		children: [
			{
				key: 'Profile Management',
				label: 'Profile Management',
				url: '/pages/CommingSoon15',
				icon: 'ri-slideshow-line',
				parentKey: 'Profile',
			},
			{
				key: 'Access Rights',
				label: 'Access Rights',
				url: '/pages/CommingSoon16',
				icon: 'ri-slideshow-line',
				parentKey: 'Profile',
			},
		],
	},
	{
		key: 'Tools',
		label: 'Tools',
		url: '/pages/AdhocTempleteList',
		icon: 'ri-briefcase-2-line',
		roles: ['Convener L2'],
		children: [
			{
				key: 'Process Configuration',
				label: 'Process Configuration ',
				url: '/pages/CommingSoon17',
				icon: 'ri-slideshow-line',
				parentKey: 'Analytics',
			},
			{
				key: 'Bulk Operation',
				label: 'Bulk Operation ',
				url: '/pages/CommingSoon18',
				icon: 'ri-slideshow-line',
				parentKey: 'Analytics',
			},
		],
	},
	{
		key: 'userGuide',
		label: 'Help',
		url: '/pages/AdhocTempleteList',
		roles: ['Convener L2'],
		icon: 'ri-question-mark',
		children: [
			{
				key: 'User Guide',
				label: 'User Guide',
				url: '/pages/CommingSoon19',
				icon: 'ri-slideshow-line',
				parentKey: 'userGuide',
			},
			{
				key: 'Support',
				label: 'Support',
				url: '/pages/CommingSoon20',
				icon: 'ri-slideshow-line',
				parentKey: 'userGuide',
			},
		],
	},

]

const HORIZONTAL_MENU_ITEMS: MenuItemTypes[] = [
	{
		key: 'dashboard',
		icon: 'ri-dashboard-3-line',
		label: 'Dashboards',
		isTitle: true,
		children: [
			{
				key: 'dashboard',
				label: 'Dashboard',
				url: '/',
				parentKey: 'dashboard',
			},
		],
	},
	{
		key: 'pages',
		icon: 'ri-pages-line',
		label: 'Pages',
		isTitle: true,
		children: [
			{
				key: 'auth',
				label: 'Authentication',
				isTitle: false,
				children: [
					{
						key: 'auth-login',
						label: 'Login',
						url: '/auth/login',
						parentKey: 'pages',
					},
					{
						key: 'auth-register',
						label: 'Register',
						url: '/auth/register',
						parentKey: 'pages',
					},
					{
						key: 'auth-logout',
						label: 'Logout',
						url: '/auth/logout',
						parentKey: 'pages',
					},
					{
						key: 'auth-forgot-password',
						label: 'Forgot Password',
						url: '/auth/forgot-password',
						parentKey: 'pages',
					},
					{
						key: 'auth-lock-screen',
						label: 'Lock Screen',
						url: '/auth/lock-screen',
						parentKey: 'pages',
					},
				],
			},
			{
				key: 'pages-error',
				label: 'Error',
				parentKey: 'pages',
				children: [
					{
						key: 'error-404',
						label: 'Error 404',
						url: '/pages/error-404',
						parentKey: 'pages-error',
					},
					{
						key: 'error-404-alt',
						label: 'Error 404-alt',
						url: '/pages/error-404-alt',
						parentKey: 'pages-error',
					},
					{
						key: 'error-500',
						label: 'Error 500',
						url: '/pages/error-500',
						parentKey: 'pages-error',
					},
				],
			},
			{
				key: 'pages-starter',
				label: 'Starter Page',
				url: '/pages/starter',
				parentKey: 'pages',
			},
			{
				key: 'pages-ContactList',
				label: 'Contact List',
				url: '/pages/contact-list',
				parentKey: 'pages',
			},
			{
				key: 'pages-profile',
				label: 'Profile',
				url: '/pages/profile',
				parentKey: 'pages',
			},
			{
				key: 'pages-invoice',
				label: 'Invoice',
				url: '/pages/invoice',
				parentKey: 'pages',
			},
			{
				key: 'pages-faq',
				label: 'FAQ',
				url: '/pages/faq',
				parentKey: 'pages',
			},
			{
				key: 'pages-pricing',
				label: 'Pricing',
				url: '/pages/pricing',
				parentKey: 'pages',
			},
			{
				key: 'pages-maintenance',
				label: 'Maintenance',
				url: '/pages/maintenance',
				parentKey: 'pages',
			},
			{
				key: 'pages-timeline',
				label: 'Timeline',
				url: '/pages/timeline',
				parentKey: 'pages',
			},
		],
	},
	{
		key: 'ui',
		icon: 'ri-stack-line',
		label: 'Components',
		isTitle: true,
		children: [
			{
				key: 'base1',
				label: 'Base UI 1',
				parentKey: 'ui',
				children: [
					{
						key: 'ui-accordions',
						label: 'Accordions',
						url: '/ui/accordions',
						parentKey: 'base1',
					},
					{
						key: 'ui-alerts',
						label: 'Alerts',
						url: '/ui/alerts',
						parentKey: 'base1',
					},
					{
						key: 'ui-avatars',
						label: 'Avatars',
						url: '/ui/avatars',
						parentKey: 'base1',
					},
					{
						key: 'ui-badges',
						label: 'Badges',
						url: '/ui/badges',
						parentKey: 'base1',
					},
					{
						key: 'ui-breadcrumb',
						label: 'Breadcrumb',
						url: '/ui/breadcrumb',
						parentKey: 'base1',
					},
					{
						key: 'ui-buttons',
						label: 'Buttons',
						url: '/ui/buttons',
						parentKey: 'base1',
					},
					{
						key: 'ui-cards',
						label: 'Cards',
						url: '/ui/cards',
						parentKey: 'base1',
					},
					{
						key: 'ui-carousel',
						label: 'Carousel',
						url: '/ui/carousel',
						parentKey: 'base1',
					},
					{
						key: 'ui-dropdowns',
						label: 'Dropdowns',
						url: '/ui/dropdowns',
						parentKey: 'base1',
					},
					{
						key: 'ui-embed-video',
						label: 'Embed Video',
						url: '/ui/embed-video',
						parentKey: 'base1',
					},
					{
						key: 'ui-grid',
						label: 'Grid',
						url: '/ui/grid',
						parentKey: 'base1',
					},
					{
						key: 'ui-list-group',
						label: 'List Group',
						url: '/ui/list-group',
						parentKey: 'base1',
					},
					{
						key: 'ui-links',
						label: 'Links',
						url: '/ui/links',
						parentKey: 'base1',
					},
				],
			},
			{
				key: 'base2',
				label: 'Base UI 2',
				parentKey: 'ui',
				children: [
					{
						key: 'ui-modals',
						label: 'Modals',
						url: '/ui/modals',
						parentKey: 'base2',
					},
					{
						key: 'ui-notifications',
						label: 'Notifications',
						url: '/ui/notifications',
						parentKey: 'base2',
					},
					{
						key: 'ui-offcanvas',
						label: 'Offcanvas',
						url: '/ui/offcanvas',
						parentKey: 'base2',
					},
					{
						key: 'ui-placeholders',
						label: 'Placeholders',
						url: '/ui/placeholders',
						parentKey: 'base2',
					},
					{
						key: 'ui-pagination',
						label: 'Pagination',
						url: '/ui/pagination',
						parentKey: 'base2',
					},
					{
						key: 'ui-popovers',
						label: 'Popovers',
						url: '/ui/popovers',
						parentKey: 'base2',
					},
					{
						key: 'ui-progress',
						label: 'Progress',
						url: '/ui/progress',
						parentKey: 'base2',
					},

					{
						key: 'ui-spinners',
						label: 'Spinners',
						url: '/ui/spinners',
						parentKey: 'base2',
					},
					{
						key: 'ui-tabs',
						label: 'Tabs',
						url: '/ui/tabs',
						parentKey: 'base2',
					},
					{
						key: 'ui-tooltips',
						label: 'Tooltips',
						url: '/ui/tooltips',
						parentKey: 'base2',
					},
					{
						key: 'ui-typography',
						label: 'Typography',
						url: '/ui/typography',
						parentKey: 'base2',
					},
					{
						key: 'ui-utilities',
						label: 'Utilities',
						url: '/ui/utilities',
						parentKey: 'base2',
					},
				],
			},
			{
				key: 'extended',
				label: 'Extended UI',
				parentKey: 'ui',
				children: [
					{
						key: 'extended-portlets',
						label: 'Portlets',
						url: '/extended-ui/portlets',
						parentKey: 'extended',
					},
					{
						key: 'extended-scrollbar',
						label: 'Scrollbar',
						url: '/extended-ui/scrollbar',
						parentKey: 'extended',
					},
					{
						key: 'extended-range-slider',
						label: 'Range Slider',
						url: '/extended-ui/range-slider',
						parentKey: 'extended',
					},
				],
			},
			{
				key: 'forms',
				label: 'Forms',
				parentKey: 'ui',
				children: [
					{
						key: 'forms-basic-elements',
						label: 'Basic Elements',
						url: '/ui/forms/basic-elements',
						parentKey: 'forms',
					},
					{
						key: 'forms-form-advanced',
						label: 'Form Advanced',
						url: '/ui/forms/form-advanced',
						parentKey: 'forms',
					},
					{
						key: 'forms-validation',
						label: 'Form Validation',
						url: '/ui/forms/validation',
						parentKey: 'forms',
					},
					{
						key: 'forms-wizard',
						label: 'Form Wizard',
						url: '/ui/forms/wizard',
						parentKey: 'forms',
					},
					{
						key: 'forms-file-uploads',
						label: 'File Uploads',
						url: '/ui/forms/file-uploads',
						parentKey: 'forms',
					},
					{
						key: 'forms-editors',
						label: 'Form Editors',
						url: '/ui/forms/editors',
						parentKey: 'forms',
					},
					{
						key: 'forms-image-crop',
						label: 'Image Crop',
						url: '/ui/forms/image-crop',
						parentKey: 'forms',
					},
					{
						key: 'forms-editable',
						label: 'Editable',
						url: '/ui/forms/editable',
						parentKey: 'forms',
					},
				],
			},
			{
				key: 'charts',
				label: 'Charts',
				isTitle: false,
				children: [
					{
						key: 'apex-charts',
						label: 'Apex Charts',
						url: '/charts/apex-charts',
						parentKey: 'charts',
					},
					{
						key: 'chartjs-charts',
						label: 'ChartJS',
						url: '/charts/chartjs',
						parentKey: 'charts',
					},
					{
						key: 'Sparkline-charts',
						label: 'Sparkline Charts',
						url: '/charts/sparkline-charts',
						parentKey: 'charts',
					},
				],
			},
			{
				key: 'tables',
				label: 'Tables',
				isTitle: false,
				children: [
					{
						key: 'tables-basic',
						label: 'Basic Tables',
						url: '/ui/tables/basic-tables',
						parentKey: 'tables',
					},
					{
						key: 'tables-data',
						label: 'Data Tables',
						url: '/ui/tables/data-tables',
						parentKey: 'tables',
					},
				],
			},
			{
				key: 'icons',
				label: 'Icons',
				isTitle: false,
				children: [
					{
						key: 'icons-remix',
						label: 'Remix icons',
						url: '/ui/icons/remix-icons',
						parentKey: 'icons',
					},
					{
						key: 'icons-Bootstrap',
						label: 'Bootstrap icons',
						url: '/ui/icons/Bootstrap-icons',
						parentKey: 'icons',
					},
					{
						key: 'icons-Material Icons',
						label: 'Material Design Icons',
						url: '/ui/icons/Material-icons',
						parentKey: 'icons',
					},
				],
			},
			{
				key: 'maps',
				label: 'Maps',
				isTitle: false,
				children: [
					{
						key: 'maps-google-maps',
						label: 'Google maps',
						url: '/ui/maps/google-maps',
						parentKey: 'maps',
					},
					{
						key: 'maps-vector-maps',
						label: 'Vector maps',
						url: '/ui/maps/vector-maps',
						parentKey: 'maps',
					},
				],
			},
		],
	},
]

export { MENU_ITEMS, HORIZONTAL_MENU_ITEMS }
