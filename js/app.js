

import { state } from "./state.js";
import { chargerDonnees } from "./dataService.js";

import {
    afficherIndicateurs,
    afficherCommandes,
    afficherDetails,
    afficherErreur
} from "./view.js";

function afficherTout() {
    afficherIndicateurs();
    afficherCommandes();
}

window.voirDetails = function(id) {
    afficherDetails(id);
};

async function demarrer() {
    try {
        const donnees = await chargerDonnees();

        state.customers = donnees.customers;
        state.products = donnees.products;
        state.orders = donnees.orders;

        afficherTout();

    } catch (erreur) {
        afficherErreur("Impossible de charger les fichiers JSON.");
        console.error(erreur);
    }
}

document.getElementById("recherche").addEventListener("input", function() {
    state.search = this.value;
    afficherCommandes();
});

document.getElementById("statut").addEventListener("change", function() {
    state.status = this.value;
    afficherCommandes();
});

document.getElementById("categorie").addEventListener("change", function() {
    state.category = this.value;
    afficherCommandes();
});

demarrer();
