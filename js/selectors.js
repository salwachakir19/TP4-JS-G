

import { state } from "./state.js";

export function trouverClient(id) {
    return state.customers.find(function(client) {
        return client.id === id;
    });
}

export function trouverProduit(id) {
    return state.products.find(function(produit) {
        return produit.id === id;
    });
}

export function trouverProduitsCommande(commande) {
    return commande.items.map(function(item) {
        const produit = trouverProduit(item.productId);

        return {
            name: produit.name,
            category: produit.category,
            price: produit.price,
            quantity: item.quantity,
            total: produit.price * item.quantity
        };
    });
}

export function calculerTotal(commande) {
    let total = 0;

    trouverProduitsCommande(commande).forEach(function(item) {
        total = total + item.total;
    });

    return total;
}

export function filtrerCommandes() {
    return state.orders.filter(function(commande) {
        const client = trouverClient(commande.customerId);

        const rechercheOK = client.name.toLowerCase().includes(
            state.search.toLowerCase()
        );

        const statutOK = state.status === "all" ||
            commande.status === state.status;

        const produits = trouverProduitsCommande(commande);

        const categorieOK = state.category === "all" ||
            produits.some(function(item) {
                return item.category === state.category;
            });

        return rechercheOK && statutOK && categorieOK;
    });
}
