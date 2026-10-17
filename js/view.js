
import { state } from "./state.js";

import {
    trouverClient,
    trouverProduitsCommande,
    calculerTotal,
    filtrerCommandes
} from "./selectors.js";

export function afficherIndicateurs() {
    let total = 0;

    state.orders.forEach(function(commande) {
        total = total + calculerTotal(commande);
    });

    document.getElementById("indicateurs").innerHTML = `
        <div class="col-md-3 mb-3">
          <div class="card p-4 h-100 bg-primary-subtle">
                <div style="font-size: 20px;">
                    Clients
                </div>
                <div style="font-size: 30px; font-weight: bold;">
                    ${state.customers.length}
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card p-4 h-100 bg-warning-subtle">
                <div style="font-size: 20px;">
                    Produits
                </div>
                <div style="font-size: 30px; font-weight: bold;">
                    ${state.products.length}
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
    <div class="card p-4 h-100" style="background-color: #F5DDF7;">
                <div style="font-size: 20px;">
                    Commandes
                </div>
                <div style="font-size: 30px; font-weight: bold;">
                    ${state.orders.length}
                </div>
            </div>
        </div>

        <div class="col-md-3 mb-3">
      <div class="card p-4 h-100 bg-success-subtle">
                <div style="font-size: 20px;">
                    Total
                </div>
                <div style="font-size: 30px; font-weight: bold;">
                    ${total} DH
                </div>
            </div>
        </div>
    `;
}

export function afficherCommandes() {
    const commandes = filtrerCommandes();
    const zone = document.getElementById("commandes");

    let lignes = "";

    commandes.forEach(function(commande) {
        const client = trouverClient(commande.customerId);
        const nomClient = client ? client.name : "Client inconnu";

        let styleStatut = "";

        if (commande.status === "Livree") {
            styleStatut = `
                color: #176b3a;
            `;
        } else if (commande.status === "En attente") {
            styleStatut = `
    
                color: #f6b607;
            `;
        } else if (commande.status === "Annulee") {
            styleStatut = `
           
                color: #4dc3f1;
            `;
        }

        lignes += `
            <tr>
                <td>${commande.id}</td>
                <td>${nomClient}</td>
                <td>${commande.date}</td>

                <td>
                    <span style="
                        display: inline-block;
                        padding: 6px 12px;
                        border-radius: 6px;
                        ${styleStatut}
                    ">
                        ${commande.status}
                    </span>
                </td>

                <td>${calculerTotal(commande)} DH</td>

                <td>
                    <button
                        class="btn btn-sm"
                        style="
                          
                            color: #f89fba;
                            border: none;
                            padding: 7px 14px;
                        "
                        onclick="voirDetails(${commande.id})"
                    >
                        Voir détails
                    </button>
                </td>
            </tr>
        `;
    });

    if (commandes.length === 0) {
        zone.innerHTML = "<p>Aucune commande trouvée.</p>";
        return;
    }

    zone.innerHTML = `
        <div class="table-responsive">
      
            <table
                class="table table-bordered align-middle"
                style="
                    --bs-table-bg: white;
                    --bs-table-color: #212529;
                    --bs-table-border-color: #dee2e6;
                    margin-bottom: 0;
                "
            >

                  <thead class="table-warning">
                    <tr>
                        <th>ID</th>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Statut</th>
                        <th>Total</th>
                        <th>Détails</th>
                    </tr>
                </thead>

                <tbody>
                    ${lignes}
                </tbody>
            </table>
        </div>
    `;
}

export function afficherDetails(id) {
    const commande = state.orders.find(function(c) {
        return c.id === id;
    });

    if (!commande) {
        return;
    }

    const client = trouverClient(commande.customerId);
    const nomClient = client ? client.name : "Client inconnu";
    const villeClient = client ? client.city : "Non disponible";

    const produits = trouverProduitsCommande(commande);

    let lignes = "";

    produits.forEach(function(produit) {
        lignes += `
            <tr>
                <td>${produit.name}</td>
                <td>${produit.price} DH</td>
                <td>${produit.quantity}</td>
                <td>${produit.total} DH</td>
            </tr>
        `;
    });

    document.getElementById("details").innerHTML = `
        <div class="card p-4 mt-3 mb-4">

            <h4>Détails de la commande ${commande.id}</h4>

            <p>Client : ${nomClient}</p>
            <p>Ville : ${villeClient}</p>
            <p>Date : ${commande.date}</p>
            <p>Statut : ${commande.status}</p>

            <div class="table-responsive">
                <table
                    class="table table-bordered align-middle"
                    style="
                        --bs-table-bg: white;
                        --bs-table-color: #212529;
                        --bs-table-border-color: #dee2e6;
                    "
                >
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Prix</th>
                            <th>Quantité</th>
                            <th>Total</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${lignes}
                    </tbody>
                </table>
            </div>

            <h5>
                Total de la commande : ${calculerTotal(commande)} DH
            </h5>

        </div>
    `;
}

export function afficherErreur(message) {
    document.getElementById("erreur").textContent = message;
}
