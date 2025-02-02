import Verification_header from '../Verification Header/Verification_header'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Spinner from '../Spinner/Spinner'
import { mfa_setup, mfa_verification } from '../../Services/API/api'
import { CircleCheck, CircleX, KeyRound } from 'lucide-react'
import Form_error from '../Error/Form_error'
import { useEffect, useState } from 'react'
import { QRCode } from 'react-qrcode-logo';
import { RingLoader } from 'react-spinners'

interface prop {
    MFA_Setup: boolean
    MFA_Success: (e: string) => void,
    user_id?: string
}

const MFA = ({ MFA_Setup, MFA_Success, user_id }: prop) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [verification, setVerification] = useState(false)

    const [baseSecret, setBaseSecret] = useState("")

    const { mutate: mfa_mutate, isPending: mfa_pending, isSuccess: mfa_success } = useMutation({
        mutationKey: ["MFA Verification"],
        mutationFn: mfa_verification,
        onSuccess: () => {
            setVerification(true);
            MFA_Success(baseSecret);
        }
    })

    const { data: mfaSetupData, isPending } = useQuery({
        queryKey: ["Multi-Factor Authentication Setup Request"],
        queryFn: mfa_setup,
        retry: 1,
        enabled: MFA_Setup
    })

    useEffect(() => {
        mfaSetupData && setBaseSecret(mfaSetupData.data.secret);
    }, [mfaSetupData])

    const focusDiv = (field_name: string) => {
        document.getElementById(field_name)?.focus()
    }

    const MFA_setup_steps = [
        "Download an Authenticator App",
        "Scan the QR Code",
        "Get Your MFA Code",
        "Enter the Code Below to Activate MFA"
    ]

    return (
        <div className='p-8 border-1 rounded-lg bg-white md:shadow-md flex flex-col gap-3 w-[30rem] overflow-y-auto custom-scrollbar'>
            <Verification_header name={MFA_Setup ? 'MFA Setup' : 'MFA Verification'} />

            {
                MFA_Setup && isPending ?
                    <RingLoader color='#26afb9' />
                    :
                    mfaSetupData ?
                        <>
                            <div className='flex flex-col md:flex-row gap-3'>
                                <QRCode value={mfaSetupData.data.mfa_qr} />

                                <div className='small_text flex flex-col gap-2 mt-2'>
                                    {
                                        MFA_setup_steps.map((step, index) =>
                                            <span key={step}><strong>Step {index + 1}:</strong> {step}</span>
                                        )
                                    }
                                </div>
                            </div>

                            <div className='text-red-500 small_text'>
                                Do not close or minimize this page or switch between tab(s), until MFA Setup is Completed
                            </div>
                        </>
                        :
                        MFA_Setup && <div className='text-red-500'>
                            Error in Setting MFA Setup
                        </div>
            }

            {/* Form */}
            <form onSubmit={handleSubmit((e) => mfa_mutate({ ...e, "secret": baseSecret, "user_id": user_id }))}
                className='flex flex-col gap-2'>
                <div>
                    <div className='flex justify-between items-center gap-3 border-1 py-2 px-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all cursor-text' onClick={() => focusDiv("mfa_code")}>
                        <KeyRound color='#374151'
                            strokeWidth={"1.75px"} />
                        <input type="tel"
                            className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                            placeholder='MFA Code'
                            minLength={6}
                            maxLength={6}
                            id='mfa_code'
                            disabled={mfa_success}
                            autoFocus
                            {...register("mfa_code", {
                                required: "* MFA Code Required",
                            })}
                        />
                        <div className='w-12 flex justify-end items-center'>
                            {
                                verification && (mfa_success ?
                                    <CircleCheck fill='#16a34a' color='#ffffff' />
                                    :
                                    <CircleX fill="#ef4444" color="#ffffff" />
                                )
                            }
                        </div>
                    </div>
                    <Form_error field_name={errors.mfa_code} message={errors.mfa_code?.message} />
                </div>

                <button type={mfa_pending ? 'button' : 'submit'}
                    disabled={mfa_success}
                    className='btn btn-dark'>
                    {
                        mfa_pending ?
                            <div className='flex flex-wrap gap-2 justify-center'>
                                <Spinner />
                                <>{MFA_Setup ? 'Setting Up MFA' : 'Verifying MFA Token'}</>
                            </div>
                            :
                            "Proceed"
                    }
                </button>
            </form>
        </div>
    )
}

export default MFA