// const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
// const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
// const database = supabase.createClient(url, key);

let toDoListe = document.querySelector('#to-do-list');  
let formProduits = document.querySelector('#produits'); // Correction: Utilisez querySelector sans getElementById
let prixInput = document.querySelector('#prix'); // Correction: Renommé pour plus de clarté
let quantiteInput = document.querySelector('#quantite'); // Correction: Renommé pour plus de clarté

// Fonction pour valider les champs (à implémenter)
function validChamp(input) {
    // Implémentez la logique de validation ici
    console.log(`Validating ${input.produit}: ${input.value}`);
}

// Ajout des écouteurs d'événements
formProduits.date.addEventListener('input', function() {
    validChamp(this);  
});

formProduits.produit.addEventListener('input', function() {
    validChamp(this);  
});

formProduits.prix.addEventListener('input', function() {
    validChamp(this);  
});

formProduits.quantite.addEventListener('input', function() {
    validChamp(this);  
});

// Fonction pour calculer le total
function calculerTotal(quantite, prix) {
    return quantite * prix;
}

// Écouteur d'événement pour le formulaire
formProduits.addEventListener('submit', function(e) {
    e.preventDefault(); // Empêche l'envoi du formulaire

    let quantite = parseFloat(quantiteInput.value);
    let prix = parseFloat(prixInput.value);
    let total = calculerTotal(quantite, prix);

    console.log(`Total: ${total}`);

    // Ici, vous pouvez ajouter la logique pour enregistrer les données dans la base de données
});