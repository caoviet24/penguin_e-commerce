"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader/loader'
import useHookMutation from '@/hooks/useHookMutation'
import { identityService } from '@/services/identities.service'
import Cookie from 'js-cookie'
import { toast, ToastContainer } from 'react-toastify';
import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}
