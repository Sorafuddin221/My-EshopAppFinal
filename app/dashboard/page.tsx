'use client';

import DashboardClient from "./DashboardClient";
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import LoginSection from './LoginSection'; // Assuming LoginSection is a separate component

const DashboardPage = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/dashboard/login'); // Redirect to login if not authenticated
            } else if (!user.isApproved) {
                // Optionally, show a message or redirect to a pending approval page
                router.push('/'); // Redirect to home or a specific message page
                alert('Your account is awaiting admin approval.');
            }
        }
    }, [user, loading, router]);

    if (loading) {
        return <div>Loading dashboard...</div>; // Or a loading spinner
    }

    if (!user || !user.isApproved) {
        return null; // Or a message indicating redirection
    }

    return <DashboardClient />;
};

export default DashboardPage;