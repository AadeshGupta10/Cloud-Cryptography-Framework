interface prop {
    field_name: any,
    message: any
}

const Form_error = ({ field_name, message }: prop) => {
    return (
        <div>
            {
                field_name && <label className='text-red-400 smaller_text'>
                    {typeof (message) == "string" && message}
                </label>
            }
        </div>
    )
}

export default Form_error