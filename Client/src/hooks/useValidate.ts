import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { changeUsername, handleAuthentication, handleLoading } from "../utils/Store/Redux_functions";
import { verify_token } from "../Services/API/api";

const useValidate = () => {

    const dispatch = useDispatch()

    const token = localStorage.getItem("token");

    const { data, isSuccess, isError, isLoading } = useQuery({
        queryKey: ["Verifying Token"],
        queryFn: verify_token,
        enabled: !!token,
        retry: 1
    });

    useEffect(() => {
        dispatch(handleLoading(isLoading))
    }, [isLoading])

    useEffect(() => {
        isError &&
            (
                dispatch(handleAuthentication(false)),
                localStorage.removeItem("token")
            )
    }, [isError])

    useEffect(() => {
        if (isSuccess && !!token) {
            dispatch(handleAuthentication(true))
            dispatch(changeUsername(data.data.name))
        }
    }, [isSuccess, data, token])
}

export default useValidate;