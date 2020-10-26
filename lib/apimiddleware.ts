import axios from 'axios';
import { Dispatch } from 'react';

export const apimiddleware = (payload: any, dispatch: Dispatch<any>): void => {
    const {
        url,
        method,
        data,
        onStart,
        onSuccess,
        onFailure,
        headers
    } = payload;
    const allheaders = {
        'Content-Type': 'application/json',
        ...headers
    };
    const dataOrParams = ["GET", "DELETE"].includes(method) ? "params" : "data";
    dispatch(onStart())
    axios.request({
        url,
        method,
        headers: allheaders,
        [dataOrParams]: data
    }).then((res) => {
        if (onSuccess) dispatch(onSuccess(res.data))
    }).catch((err) => {
        let response = "Something went wrong"
        console.log(err)
        if (onFailure) dispatch(onFailure(response))
    });
};