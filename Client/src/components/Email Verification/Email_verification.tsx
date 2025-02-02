import { FC, useEffect, useState } from 'react'
import Verification_header from '../Verification Header/Verification_header'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Spinner from '../Spinner/Spinner'
import { email_otp, email_otp_verification } from '../../Services/API/api'
import { CircleCheck, CircleX, Mail } from 'lucide-react'
import Form_error from '../Error/Form_error'

interface prop {
    change_mail: () => void,
    email: string,
    verification_success: () => void
}

const Email_verification: FC<prop> = ({ change_mail, email, verification_success }) => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const [verification, setVerification] = useState(false)

    const [resetTime, setResetTime] = useState(60) //give time in seconds
    const [minutes, setMin] = useState(0);
    const [seconds, setSec] = useState(0)

    const [wait, setWait] = useState(true)

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (resetTime > 1) {
                setWait(true)
                setResetTime(resetTime - 1);
            } else {
                setWait(false)
                clearInterval(intervalId);
            }
        }, 1000);

        setMin(Math.floor(resetTime / 60));
        setSec(resetTime % 60);

        return () => clearInterval(intervalId);
    }, [resetTime]);

    const { mutate: email_mutate, isPending: email_pending, isSuccess: email_success } = useMutation({
        mutationKey: ["Email Verification"],
        mutationFn: email_otp_verification,
        onSuccess: () => {
            setVerification(true);
            verification_success()
        }
    })

    const { mutate: sendOtpMutate, isSuccess: otpSendSuccess } = useMutation({
        mutationKey: ["Sending Email OTP"],
        mutationFn: email_otp
    })

    const handleOTPSending = () => {
        const e = { email: email };
        sendOtpMutate(e)
    }

    useEffect(() => {
        handleOTPSending();
    }, [])

    const focusDiv = (field_name: string) => {
        document.getElementById(field_name)?.focus()
    }

    return (
        <>
            <div className='p-8 border-1 rounded-lg bg-white md:shadow-md flex flex-col gap-3 w-[30rem] overflow-y-auto custom-scrollbar'>
                <Verification_header name='OTP Verification' />

                {/* Form */}
                <form onSubmit={handleSubmit((e) => email_mutate(e))}
                    className='flex flex-col gap-2'>
                    <div>
                        {/* Email Sending on Address */}
                        <div className='small_text mb-3'>OTP is sent on <span className="font-semibold">{email == "" ? "anonymous mail" : email}</span></div>

                        <div className='flex justify-between items-center gap-3 border-1 py-2 px-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all cursor-text' onClick={() => focusDiv("email_otp")}>
                            <Mail color='#374151'
                                strokeWidth={"1.75px"} />
                            <input type="text"
                                className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                placeholder='OTP'
                                maxLength={6}
                                id='email_otp'
                                disabled={email_success}
                                autoFocus
                                {...register("email_otp_verification", {
                                    required: "* Email OTP Required",
                                })}
                            />
                            <div className='w-12 flex justify-end items-center'>
                                {
                                    verification && (email_success ?
                                        <CircleCheck fill='#16a34a' color='#ffffff' />
                                        :
                                        <CircleX fill="#ef4444" color="#ffffff" />
                                    )
                                }
                            </div>
                        </div>
                        <Form_error field_name={errors.email_otp_verification} message={errors.email_otp_verification?.message} />
                    </div>
                    {!email_success &&
                        <div className={`flex flex-wrap justify-between items-center my-2 gap-x-4 gap-y-3`}>
                            <span
                                className='form-label small_text mb-0 fw-medium underline cursor-pointer' onClick={change_mail}>
                                Change Email
                            </span>
                            <div
                                className={`form-label small_text mb-0 fw-medium ${wait ? "text-gray-500" : ""}`}>
                                {
                                    wait ?
                                        <>
                                            Resend OTP in {minutes > 0 ? `${minutes} min` : ``} {seconds < 10 ? "0" : ""}{seconds} sec
                                        </>
                                        :
                                        <div className='cursor-pointer'
                                            onClick={() => {
                                                setResetTime(60),
                                                    handleOTPSending(),
                                                    document.getElementById("email_otp")?.focus()
                                            }}>
                                            Resend OTP
                                        </div>
                                }
                            </div>
                        </div>
                    }
                    <button type={email_pending ? 'button' : 'submit'}
                        disabled={email_success || !otpSendSuccess}
                        className='btn btn-dark'>
                        {
                            email_pending ?
                                <div className='flex flex-wrap gap-2 justify-center'>
                                    <Spinner />
                                    <>Verifying</>
                                </div>
                                :
                                "Verify"
                        }
                    </button>
                </form>
            </div>
        </>
    )
}

export default Email_verification