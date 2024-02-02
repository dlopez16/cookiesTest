export const SIGN_IN = async (userInfo, token) => {
    const response = await fetch("http://localhost:4800/signin", {
        method: "POST",
        headers: {
            credentials: "same-page",
            "Content-Type": "application/json",
            // "authorization": "Bearer " + token
        },
        body: JSON.stringify(userInfo)
    })
    if (response.ok) {
        // response.json() will return a json of all the products on the server side
        return response.json();
    } else {
        return Promise.reject(response);
    }
}


export const REGISTER = async (userInfo) => {
    try {
        const response = await fetch("http://localhost:4800/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(userInfo)
        })
        const result = await response.json();
        console.log(result)
        // return result;
    }
    catch (error) {
        console.log("Error ", error)
    }
}