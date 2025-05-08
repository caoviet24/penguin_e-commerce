
import { identityService } from '@/services/identities.service';
import { IAccount } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { createContext, useEffect, useState, useMemo } from 'react';

interface IAuthContext {
    user: IAccount | null;
    setUser: (user: IAccount | null) => void;
    logout: () => void;
}

export const UserContext = createContext<IAuthContext>({
    user: null,
    setUser: () => {},
    logout: () => {
        identityService.logout();
    },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IAccount | null>(null);

    const { data, isSuccess } = useQuery({
        queryKey: ['auth'],
        queryFn: identityService.authMe,
        enabled: !user,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess && data) {
            setUser(data as unknown as IAccount);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        console.log(user);
        
    }, [user]);
    

    const value = useMemo(
        () => ({
            user,
            setUser,
            logout: identityService.logout,
        }),
        [user],
    );

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};