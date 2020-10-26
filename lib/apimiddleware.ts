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
        if (res.data == undefined || Array.isArray(res.data) && res.data.length == 0) {
            throw { message: 'No data' };
        }
        dispatch(onSuccess(res.data))
    }).catch((err) => {
        let response = "Something went wrong"
        console.log(err)
        dispatch(onFailure(response))
    });
};