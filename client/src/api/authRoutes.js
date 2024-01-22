export const SIGN_IN = async (userInfo) => {
    const response = await fetch("http://localhost:4800/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
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