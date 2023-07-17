import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useAuthenticate } from '../hooks/authHooks'
import { useRef } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

export default function SidebarMenu() {
    const { logout } = useAuthenticate()

    const toast = useRef<Toast>(null);

    const accept = async () => {
        toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'You have logout', life: 3000 });
        await logout()
    }

    const reject = () => {
        toast.current?.show({ severity: 'success', summary: 'Good', detail: 'You sty in!', life: 3000 });
    }

    const confirm = () => {
        confirmDialog({
            message: 'Are you sure you want to logout?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept,
            reject
        });
    };

    const items: MenuItem[] = [
        {
            label: 'Quizzes',
            icon: 'pi pi-fw pi-question',
            items: [
                {
                    label: 'New',
                    url: '/home/quiz/new',
                    icon: 'pi pi-fw pi-plus',
                },
                {
                    label: 'My Quizzes',
                    icon: 'pi pi-fw pi-list',
                    url: '/home/quiz/my'
                },
                {
                    label: 'Shaerd With Me',
                    icon: 'pi pi-fw pi-share-alt',
                    url: '/home/quiz/shared'
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
                    url: '/home/profile'
                },
                {
                    label: 'Settings',
                    icon: 'pi pi-fw pi-cog',
                    url: '/home/settings'
                }
            ]
        },
        {
            separator: true
        },
        {
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            command: () => {
                confirm()
            }
        }
    ]

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Menu model={items} className='overflow-auto h-screen left-0 w-12rem fixed top-0 m-1' />
        </div>
    )
}