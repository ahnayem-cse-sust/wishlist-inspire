import db from "../db.server";
import { cors } from 'remix-utils/cors';

export async function loader() {
    // provides data to the component

    return Response.json({
        ok: true,
        message: "Hello From api"
    });
}

export async function action({ request }) {

    const method = request.method;
    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;

    if (!customerId || !productId || !shop) {
        return Response.json({
            message: "Missing data. Required data: customerId, productId, shop",
            method: method
        });
    }

    switch (method) {
        case "POST":
            const wishlist = await db.wishlist.create({
                data: {
                    customerId,
                    productId,
                    shop
                },
            });

            const response = Response.json({ message: "Product added to wishlist", method: "POST", wishlist: wishlist });
            return cors(request, response);

        case "PATCH":
            return ({ message: "Success", method: "Patch" });

        case "DELETE":

    }

}