import { Menu } from 'primereact/menu'
import { MenuItem } from 'primereact/menuitem'
import { useAuthenticate } from '../hooks/authHooks'
import { useRef, useState } from 'react'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';

export default function SidebarMenu() {
    const { logout } = useAuthenticate();
    const [showSidebar, setShowSidebar] = useState(false);

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
                }
            ]
        },
        {
            separator: true
        },
        {
            command: () => {
                confirm()
            },
            label: 'Logout',
            icon: 'pi pi-fw pi-sign-out',
            className: 'absolute bottom-0 mb-2 w-full'
        }
    ]

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Button
                icon="pi pi-bars"
                className="mr-2 mb-2 block md:hidden"
                onClick={() => setShowSidebar(true)}
            />
            <Sidebar
                visible={showSidebar}
                onHide={() => setShowSidebar(false)}
                dismissable
                showCloseIcon={false}
                position="left"
                className='w-auto'

            >
                <Menu model={items} className="h-screen fixed top-0 left-0" />
            </Sidebar>
            <div className="hidden md:block">
                <Menu model={items} className="overflow-auto h-screen left-0 w-12rem fixed top-0 m-1" />
            </div>
        </div>
    );
}