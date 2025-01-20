

export async function loader() {
    // provides data to the component

    return Response.json({
        ok: true,
        message: "Hello From api"
    });
  }

export async function action({ request }) {
    const method = request.method;

    switch (method) {
        case "POST": 
            return Response.json({ message: "Success", method: "POST"});
        
        case "PATCH": 
            return Response.json({ message: "Success", method: "PATCH"});

        default:
            return new Response("Method Not Allowed", { status: 405 });
    }

}