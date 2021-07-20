import axios from "axios";

const rename = (newName, toChange) => {
    return axios({
        method: 'PATCH',
        url: `/api/${toChange}/name/`,
        data: {
            name: newName
        },
        withCredentials: true
    });
}

const renameCategory = (newName, toChange) => {
    return rename(newName, `categories/${toChange}`);
}

const renameArticle = (newName, toChange) => {
    return rename(newName, `articles/${toChange}`);
}

const renameSnippet = (newName, articleId, snippetId) => {
    return rename(newName, `articles/${articleId}/snippets/${snippetId}`);
}

export const apiHelper = { rename, renameCategory, renameArticle, renameSnippet };
