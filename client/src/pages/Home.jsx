import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { GET_PRODUCTS } from "../api/productsRoutes";
import { useLoaderData } from "react-router";


// export async function loader() {
//     try {
//         const products = await GET_PRODUCTS()
//         return { products }
//     } catch (error) {
//         console.log(error)
//         return null;
//     }
// }




export default function Home(props) {





    // console.log(props)
    // const { products } = useLoaderData();

    const [products, setProducts] = useState(undefined)

    useEffect(() => {
        async function requestProducts() {
            try {
                const product = await GET_PRODUCTS()
                setProducts(product)
            } catch (error) {
                console.log(error)
            }
        }
        requestProducts();
    }, [])

    return (
        <>

            <button onClick={changeState}>click me</button>
            <Header />
            {products && products.map((products, index) => {
                return <div key={"product" + index}>
                    <h1>{products.brand}</h1>
                    <span>{products.description}</span>
                    <span>{products.price}</span>
                </div>
            })
            }
        </>
    )
}