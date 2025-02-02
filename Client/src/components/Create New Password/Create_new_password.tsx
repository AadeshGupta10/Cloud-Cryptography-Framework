import { FC, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Spinner from "../Spinner/Spinner"
import Form_error from "../Error/Form_error"
import Verification_header from "../Verification Header/Verification_header"
import { useForm } from "react-hook-form"
import { create_new_password } from "../../Services/API/api"
import { useMutation } from "@tanstack/react-query"
import { Eye, EyeOff, LockKeyhole } from "lucide-react"

interface prop {
    email: String
}

const Create_new_password: FC<prop> = ({ email }) => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm()

    const [reveal, setReveal] = useState(false)

    const navigate = useNavigate();

    const { mutate, isPending } = useMutation({
        mutationKey: ["Creating New Password"],
        mutationFn: create_new_password,
        onSuccess: () => {
            navigate("/");
        }
    })

    const focusDiv = (field_name: string) => {
        document.getElementById(field_name)?.focus()
    }

    return (
        <div className='p-8 border-1 rounded-lg bg-white md:shadow-md flex flex-col gap-3 w-[30rem] overflow-y-auto custom-scrollbar'>
            <Verification_header name='Create New Password' />

            {/* Form */}
            <form onSubmit={handleSubmit((e) => mutate({ "password": e.password, "email": email }))}
                className='flex flex-col gap-3'>

                {/* Password */}
                <div>
                    <label htmlFor="password"
                        className='form-label small_text'>
                        Password
                    </label>
                    <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all small_text cursor-text' onClick={() => focusDiv("password")}>
                        <LockKeyhole color='#374151'
                            strokeWidth={"1.75px"} />
                        <div className='w-full flex justify-between items-center gap-3'>
                            <input type="text"
                                className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                placeholder="XXXXXXXX"
                                id='password'
                                {...register("password",
                                    {
                                        required: "* Password Required",
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/,
                                            message: "* Password is Not Satisfying the Condition."
                                        }
                                    }
                                )}
                            />
                        </div>
                    </div>
                    <Form_error field_name={errors.password} message={errors.password?.message} />
                </div>

                {/* Comfirm Password */}
                <div>
                    <label htmlFor="comfirm_password"
                        className='form-label small_text'>
                        Comfirm Password
                    </label>
                    <div className='flex justify-between items-center gap-3 border-1 p-2 rounded-md border-gray-300 bg-gray-50 hover:border-gray-400 transition-all small_text cursor-text' onClick={() => focusDiv("comfirm_password")}>
                        <LockKeyhole color='#374151'
                            strokeWidth={"1.75px"} />
                        <div className='w-full flex justify-between items-center gap-3'>
                            <input type={reveal ? "text" : "password"}
                                disabled={watch("password")?.length < 8}
                                className='w-full outline-none bg-transparent text-md placeholder-gray-500 font-normal'
                                placeholder={reveal ? "XXXXXXXX" : '••••••••'}
                                id='comfirm_password'
                                {...register("comfirm_password",
                                    {
                                        required: "* Comfirm Password Required",
                                        validate: () => (
                                            watch("password") === watch("comfirm_password") || "* Passwords are not matching"
                                        )
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
                    <Form_error field_name={errors.comfirm_password} message={errors.comfirm_password?.message} />
                    <div className='smaller_text mt-2 font-medium'>
                        * Password must be at least 8 characters long and include uppercase and lowercase letters, numbers, and symbols (@$!%*?&-_).
                    </div>
                </div>

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
                            "Create New Password"
                    }
                </button>
            </form>
            <Link to={"/"}
                className='small_text text-center text-black'>
                Remember your password?
            </Link>
        </div>
    )
}

export default Create_new_password