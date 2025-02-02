import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { signin } from '../../Services/API/api'
import Spinner from '../../components/Spinner/Spinner'
import Verification_header from '../../components/Verification Header/Verification_header'
import { Eye, EyeOff, LockKeyhole, Mail } from 'lucide-react'
import Form_error from '../../components/Error/Form_error'
import MFA from '@/components/MFA/MFA'

const Signin = () => {

    const [reveal, setReveal] = useState(false);
    const [openMFA, setOpenMFA] = useState(false);

    const [token, setToken] = useState('');
    const [id, setId] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm()

    const navigate = useNavigate();

    const { mutate, isPending, isError, } = useMutation({
        mutationKey: ["Sign In"],
        mutationFn: signin,
        onSuccess: (response) => {
            setToken(response.data.token);
            setId(response.data.id);
            setOpenMFA(!openMFA);

        }
    })

    const focusDiv = (field_name: string) => {
        document.getElementById(field_name)?.focus()
    }

    const handleSettingToken = () => {
        localStorage.setItem("token", token);
        navigate("/dashboard");
    }

    return (
        <div className='h-full flex flex-wrap justify-center items-center select-none'>
            {
                openMFA ?
                    <MFA
                        MFA_Setup={false}
                        MFA_Success={handleSettingToken}
                        user_id={id}
                    />
                    :
                    <div className='p-8 border-1 rounded-lg bg-white md:shadow-md flex flex-col gap-3 w-[30rem] overflow-y-auto custom-scrollbar'>
                        <Verification_header name='Sign in' />

                        {/* Form */}
                        <form onSubmit={handleSubmit((e) => mutate(e))}
                            className='flex flex-col gap-3'>
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
                                        id="email"
                                        className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                        placeholder='your@gmail.com'
                                        autoFocus
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
                                            autoComplete='false'
                                            {...register("password",
                                                {
                                                    required: "* Password Required"
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
                            </div>

                            {
                                isError && <label className='text-red-400 smaller_text'>
                                    * Invalid Email or Password
                                </label>
                            }

                            <Link to={"/forget_password"}
                                className='form-label small_text mb-0 fw-medium underline text-black'>
                                Forgot Password
                            </Link>
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
                                        "Sign in"
                                }
                            </button>
                        </form>
                        <Link to={"/signup"}
                            className='small_text text-center text-decoration-none text-black'>
                            Don't have an account? <u className='decoration-gray-400 font-medium'>
                                Sign up
                            </u>
                        </Link>
                    </div>
            }
        </div>
    )
}

export default Signin