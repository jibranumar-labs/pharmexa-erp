import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/UI/Card/Card';
import PageHeader from '@/Components/UI/PageHeader';
import { RoleBadge } from '@/Components/UI/Badge';
import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;

    return (
        <AppLayout title="Profile">
            <Head title="Profile" />

            <PageHeader
                title="Profile"
                description="Manage your account information and security settings."
                actions={<RoleBadge role={auth.user.role} />}
            />

            <div className="mx-auto max-w-3xl space-y-6">
                <Card>
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </Card>

                <Card>
                    <UpdatePasswordForm className="max-w-xl" />
                </Card>

                <Card>
                    <DeleteUserForm className="max-w-xl" />
                </Card>
            </div>
        </AppLayout>
    );
}
