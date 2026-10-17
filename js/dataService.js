

async function chargerFichier(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Erreur de chargement");
    }

    return response.json();
}

export async function chargerDonnees() {
    const customers = await chargerFichier("data/customers.json");
    const products = await chargerFichier("data/products.json");
    const orders = await chargerFichier("data/orders.json");

    return {
        customers: customers,
        products: products,
        orders: orders
    };
}
