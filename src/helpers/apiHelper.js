import axios from "axios";

export const rename = (newName, toChange) => {
    return axios({
        method: 'PATCH',
        url: `/api/${toChange}/rename/`,
        data: {
            name: newName
        },
        withCredentials: true
    });
}
