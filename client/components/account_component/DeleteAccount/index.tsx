


import React, { useEffect, useState } from 'react'
import { AccountIcon } from '@/components/Icons'
import { Account } from '@/types'
import { Backdrop, Divider, Fade, Modal } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { accountService } from '@/services/account.service'
import useHookMutation from '@/hooks/useHookMutation'


export default function DeleteAccount({ account, onDeleteSuccess }: { account: Account, onDeleteSuccess: () => void }) {

    const [openModal, setOpenModal] = useState(false);
    const [accountData, setAccountData] = useState<Account>();

    const { data: dataAccount, isSuccess: isFetchAccountSuccess } = useQuery<Account>({
        queryKey: ["get-account-by-id", account],
        queryFn: () => accountService.getAccountById(account?.acc_id),
        enabled: !!account
    });

    useEffect(() => {
        if (isFetchAccountSuccess) {
            setAccountData(dataAccount);
        }
    }, [isFetchAccountSuccess])

    const deleteAccountMutation = useHookMutation((acc_id: string) => {
        return accountService.deleteAccount(acc_id);
    })

    const handleDeleteAccount = async () => {
        if (accountData?.acc_id) {
            deleteAccountMutation.mutate(accountData.acc_id, {
                onSuccess: () => {
                    onDeleteSuccess();
                }
            });
        }

    };

    return (
        <div className='flex flex-col pt-6 pb-2 px-5 min-w-[600px]'>
            <div className='flex flex-row pb-2'>
                <AccountIcon />
                <p className='font-bold px-2'>Cập nhật tài khoản</p>
            </div>
            <Divider />
            <form className="mx-auto py-4 w-full">
                <div className="relative z-0 w-full mb-5 group">
                    <input disabled value={accountData?.username || ''} type="text" name="username" className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required />
                    <label htmlFor="username" className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Tên đăng nhập</label>
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input disabled type="text" value={accountData?.password || ''} name="password" className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Mật khẩu</label>
                </div>

                <div className="relative z-0 w-full mb-5 group">
                    <input disabled type="text" value={accountData?.role || ''} name="password" className="block py-2.5 px-0 w-full text-base text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
                    <label htmlFor="password" className="peer-focus:font-medium absolute text-base text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Vai trò</label>
                </div>

                <div className='flex flex-row items-center gap-2 mt-4'>
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input defaultChecked={accountData?.tick || false} type="checkbox" className="sr-only peer" />

                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300">Xác minh</span>
                    </label>
                    <label className="inline-flex items-center mb-5 cursor-pointer">
                        <input defaultChecked={accountData?.isBan || false} type="checkbox" className="sr-only peer" />

                        <div className="relative w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-base font-medium text-gray-900 dark:text-gray-300">Cấm</span>
                    </label>
                </div>

                <div className='flex justify-end gap-4'>
                    <button className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
                        Hủy
                    </button>
                    <button
                        type='button'
                        onClick={() => setOpenModal(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded">
                        Xóa
                    </button>
                </div>
            </form>
            <Modal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        TransitionComponent: Fade,
                    },
                }}
            >

                <Fade in={openModal} timeout={{ enter: 300, exit: 200 }}>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] flex flex-col bg-white p-2 rounded-lg">
                        <div className='flex-1'>
                            <p>Xác nhận xóa tài khoản {accountData?.username || ''}</p>
                        </div>
                        <div className='flex justify-end gap-4'>
                            <button
                                onClick={() => setOpenModal(false)}
                                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-base px-5 py-2.5  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            >
                                Hủy
                            </button>
                            <button
                                type='button'
                                onClick={handleDeleteAccount}
                                className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-base px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </Fade>
            </Modal>
        </div>
    )
}
