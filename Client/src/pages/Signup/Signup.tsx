import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Spinner from '../../components/Spinner/Spinner'
import Verification_header from '../../components/Verification Header/Verification_header'
import { check_email_duplicacy, signup } from '../../Services/API/api'
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react'
import Form_error from '../../components/Error/Form_error'
import Email_verification from '../../components/Email Verification/Email_verification'
import MFA from '../../components/MFA/MFA'

const Signup = () => {

    const [reveal, setReveal] = useState(false)

    const [openVerification, setOpenVerification] = useState(false);
    const [openMFA, setOpenMFA] = useState(false);

    const navigate = useNavigate();

    const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm()

    const { mutate, isPending } = useMutation({
        mutationKey: ["Sign Up Data"],
        mutationFn: signup,
        onSuccess: (response) => {
            localStorage.setItem("token", response.data.token);
            navigate("/dashboard");
        }
    })

    const { mutate: checking_email_duplicacy_mutate } = useMutation({
        mutationKey: ["Checking Email Duplicacy"],
        mutationFn: check_email_duplicacy,
        onSuccess: () => {
            setOpenVerification(!openVerification)
        }
    })

    const handleSignup = (baseSecret: string) => {
        const e = { name: getValues("name"), email: getValues("email"), password: getValues("password"), mfa_base: baseSecret };
        mutate(e);
    }

    const focusDiv = (field_name: string) => {
        document.getElementById(field_name)?.focus()
    }

    return (
        <div className='h-full flex flex-wrap justify-center items-center select-none'>
            {openVerification ?
                !openMFA ?
                    <Email_verification
                        change_mail={() => setOpenVerification(!openVerification)}
                        email={watch("email")}
                        verification_success={() => setOpenMFA(!openMFA)}
                    />
                    :
                    <MFA
                        MFA_Setup={true}
                        MFA_Success={(baseSecret) => handleSignup(baseSecret)} />
                :
                // SignUp Form
                <div className='p-8 border-1 rounded-lg bg-white md:shadow-md flex flex-col gap-3 w-[30rem] overflow-y-auto custom-scrollbar'>
                    <Verification_header name='Sign up' />

                    {/* Form */}
                    <form onSubmit={handleSubmit((e) => checking_email_duplicacy_mutate({ email: e.email }))}
                        className='flex flex-col gap-2'>
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name"
                                className='form-label small_text'>
                                Full Name
                            </label>
                            <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all small_text cursor-text' onClick={() => focusDiv("name")}>
                                <UserRound color='#374151'
                                    strokeWidth={"1.75px"} />
                                <input type="text"
                                    className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                    placeholder='Jon Snow'
                                    id='name'
                                    autoFocus
                                    {...register("name",
                                        {
                                            required: "* Full Name Required",
                                            pattern: {
                                                value: /^\S[a-zA-Z ]+$/,
                                                message: "* Invalid Name"
                                            }
                                        }
                                    )}
                                />
                            </div>
                            <Form_error field_name={errors.name} message={errors.name?.message} />
                        </div>
                        {/* Email */}
                        <div>
                            <label htmlFor="email"
                                className='form-label small_text'>
                                Email
                            </label>
                            <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all small_text cursor-text' onClick={() => focusDiv("email")}>
                                <Mail color='#374151'
                                    strokeWidth={"1.75px"} />
                                <input type="email"
                                    className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                    placeholder='your@gmail.com'
                                    id='email'
                                    {...register("email", {
                                        required: "* Email Required",
                                    })}
                                />
                            </div>
                            <Form_error field_name={errors.email} message={errors.email?.message} />
                        </div>
                        <div>
                            <label htmlFor="password"
                                className='form-label small_text'>
                                Password
                            </label>
                            <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all small_text cursor-text' onClick={() => focusDiv("password")}>
                                <LockKeyhole color='#374151'
                                    strokeWidth={"1.75px"} />
                                <div className='w-full flex justify-between items-center gap-3'>
                                    <input type={reveal ? "text" : "password"}
                                        className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                        placeholder={reveal ? "XXXXXXXX" : '••••••••'}
                                        id='password'
                                        {...register("password",
                                            {
                                                required: "* Password Required",
                                                pattern: {
                                                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&-_]{8,}$/,
                                                    message: "* Password is Not Satisfying the Condition."
                                                }
                                            }
                                        )}
                                    />
                                    <div className='cursor-pointer' onClick={(e) => e.stopPropagation()}>
                                        {
                                            reveal ?
                                                <Eye className='size-5' onClick={() => setReveal(!reveal)} />
                                                :
                                                <EyeOff className='size-5' onClick={() => setReveal(!reveal)} />
                                        }
                                    </div>
                                </div>
                            </div>
                            <Form_error field_name={errors.password} message={errors.password?.message} />
                            <div className='smaller_text mt-2 font-medium'>
                                * Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and symbols (@$!%*?&-_).
                            </div>
                        </div>
                        <button type={isPending ? 'button' : 'submit'}
                            className='btn btn-dark mt-2'>
                            {
                                isPending ?
                                    <div className='flex flex-wrap gap-2 justify-center'>
                                        <Spinner />
                                        <>Please Wait</>
                                    </div>
                                    :
                                    "Sign up"
                            }
                        </button>
                    </form>
                    <Link to={"/"}
                        className='small_text text-center text-decoration-none text-black'>
                        Already have an account? <u className='decoration-gray-400 font-medium'>
                            Sign in
                        </u>
                    </Link>
                </div>
            }
        </div>
    )
}

export default Signup