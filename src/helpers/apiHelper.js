import axios from "axios";

const rename = (newName, toChange) => {
    return axios({
        method: 'PATCH',
        url: `/api/${toChange}/rename/`,
        data: {
            name: newName
        },
        withCredentials: true
    });
}


const renameCategory = (newName, toChange) => {
    return axios({
        method: 'PATCH',
        url: `/api/categories/${toChange}/rename/`,
        data: {
            name: newName
        },
        withCredentials: true
    });
}

const renameArticle = (newName, toChange) => {
    return axios({
        method: 'PATCH',
        url: `/api/articles/${toChange}/rename/`,
        data: {
            name: newName
        },
        withCredentials: true
    });
}

export const apiHelper = { rename, renameCategory, renameArticle };
