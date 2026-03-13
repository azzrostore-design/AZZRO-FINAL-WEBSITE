"use client"

import { useEffect, useState } from "react"

export default function CategoryPage({ params }) {

    const { gender, category, subcategory } = params

    const [products, setProducts] = useState([])

    async function loadProducts() {

        const res = await fetch(
            `/api/products?gender=${gender}&category=${category}&subcategory=${subcategory}`
        )

        const data = await res.json()

        setProducts(data)
    }

    useEffect(() => {
        loadProducts()
    }, [])

    return (

        <div style={{ padding: "40px" }}>

            <h2>
                {gender} / {category} / {subcategory}
            </h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: "20px",
                marginTop: "20px"
            }}>

                {products.map((p) => (
                    <div key={p._id}>

                        <img
                            src={p.images?.[0]}
                            width="200"
                        />

                        <h4>{p.name}</h4>

                        <p>₹{p.price}</p>

                    </div>
                ))}

            </div>

        </div>

    )
}