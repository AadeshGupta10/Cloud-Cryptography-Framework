import { useMutation } from '@tanstack/react-query';
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import Spinner from '../../components/Spinner/Spinner';
import Verification_header from '../../components/Verification Header/Verification_header';
import { check_email } from '../../Services/API/api';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import Form_error from '../../components/Error/Form_error';
import Email_verification from '../../components/Email Verification/Email_verification';
import Create_new_password from '../../components/Create New Password/Create_new_password';

const Forget_password = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const [openVerification, setOpenVerification] = useState(false);
    const [createPassword, setCreatePassword] = useState(false);

    const { mutate, isPending, isError } = useMutation({
        mutationKey: ["Email Check for Password Recovery"],
        mutationFn: check_email,
        onSuccess: () => {
            setOpenVerification(!openVerification)
        }
    })

    return (
        <div className='h-full flex flex-wrap justify-center items-center select-none'>
            {
                openVerification ?
                    createPassword ?
                        <Create_new_password email={watch("email")} />
                        :
                        <Email_verification change_mail={() => setOpenVerification(!openVerification)} email={watch("email")} verification_success={() => setCreatePassword(true)} />
                    :
                    <div className='p-8 border-1 rounded-lg bg-white md:shadow-md flex flex-col gap-3 w-[30rem] overflow-y-auto custom-scrollbar'>
                        <Verification_header name='Forget Password' />

                        {/* Form */}
                        <form onSubmit={handleSubmit((e) => mutate(e))}
                            className='flex flex-col gap-3'>

                            <div>
                                <label htmlFor="email"
                                    className='form-label small_text'>
                                    Email
                                </label>
                                <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all small_text cursor-text' onClick={() => document.getElementById("email")?.focus()}>
                                    <Mail color='#374151'
                                        strokeWidth={"1.75px"} />
                                    <input type="email"
                                        className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                        placeholder='registered_email@gmail.com'
                                        id='email'
                                        autoFocus
                                        {...register("email", {
                                            required: "* Email Required",
                                        })}
                                    />
                                </div>
                                <Form_error field_name={errors.email} message={errors.email?.message} />
                            </div>

                            {
                                isError && <label className='text-red-400 smaller_text'>
                                    * Invalid Email Id
                                </label>
                            }

                            <button type={isPending ? 'button' : 'submit'}
                                disabled={isPending}
                                className='btn btn-dark'>
                                {
                                    isPending ?
                                        <div className='flex flex-wrap gap-2 justify-center'>
                                            <Spinner />
                                            <>Please Wait</>
                                        </div>
                                        :
                                        "Send OTP"
                                }
                            </button>
                        </form>
                        <Link to={"/"}
                            className='small_text text-center text-black'>
                            Remember your password?
                        </Link>
                    </div>
            }
        </div>
    )
}

export default Forget_password