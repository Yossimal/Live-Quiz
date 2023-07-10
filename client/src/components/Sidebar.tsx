import { PanelMenu } from 'primereact/panelmenu'
import { MenuItem } from 'primereact/menuitem'
import { useAuth } from '../hooks/useAuth'

export default function Sidebar() {
    const { logout } = useAuth()!
    const items: MenuItem[] = [
        {
            label: 'Quizzes',
            icon: 'pi pi-fw pi-question',
            items: [
                {
                    label: 'New',
                    url: '/quiz/new',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    separator: true
                },
                {
                    label: 'My Quizzes',
                    icon: 'pi pi-fw pi-list',
                    url: '/quiz/my'
                },
                {
                    label: 'Shaerd With Me',
                    icon: 'pi pi-fw pi-share-alt',
                    url: '/quiz/shared'
                }
            ]
        },
        {
            label: 'Account',
            icon: 'pi pi-fw pi-user',
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-fw pi-user-edit',
                    url: '/profile'
                },
            ]
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: async () => {
                console.log('logout')
                await logout()
            }
        }
    ]

    return (
        <PanelMenu className='left-1 min-w-max h-screen fixed top-1' model={items} />
    )

}