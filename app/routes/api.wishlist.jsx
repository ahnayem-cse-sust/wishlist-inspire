import db from "../db.server";
import { cors } from 'remix-utils/cors';

export async function loader({ request }) {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");
  
  
    if(!customerId || !shop || !productId) {
      return Response.json({
        message: "Missing data. Required data: customerId, productId, shop",
        method: "GET"
      });
    }
  
    // If customerId, shop, productId is provided, return wishlist items for that customer.
    const wishlist = await db.wishlist.findMany({
      where: {
        customerId: customerId,
        shop: shop,
        productId: productId,
      },
    });
  
  
    const response = Response.json({
      ok: true,
      message: "Success",
      data: wishlist,
    });
  
    return cors(request, response);
  
  }

export async function action({ request }) {

    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const _action = data.action;

    if (!customerId || !productId || !shop || !_action) {
        return Response.json({
            message: "Missing data. Required data: customerId, productId, shop",
            method: _action
        });
    }

    let response;

    switch (_action) {
        case "CREATE":
            const wishlist = await db.wishlist.create({
                data: {
                    customerId,
                    productId,
                    shop
                },
            });

            response = Response.json({ message: "Product added to wishlist", method: _action, wishlist: true });
            return cors(request, response);

        case "PATCH":
            return Response.json({ message: "Success", method: "Patch" });

        case "DELETE":
            await db.wishlist.deleteMany({
                where:{
                    customerId: customerId,
                    shop: shop,
                    productId: productId,
                },
            });

            response = Response.json({ message: "Product removed from your wishlist", method: _action, wishlist: false });
            return cors(request, response);
        
        default:
            return new Response("Method Not Allowed", { status: 405});
    }

}