const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
const database = supabase.createClient(url, key);

document.querySelector('#produits').addEventListener('submit', async function(e) {
    e.preventDefault();

    const produit = document.querySelector('#produit').value;
    const date = document.querySelector('#date').value;
    const prix = document.querySelector('#prix').value;
    const quantite = document.querySelector('#quantite').value;
    const globale = prix * quantite;
    console.log(globale)
    // Validation basique
    if (!produit || !date || !prix || !quantite) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Vérification du format de la date
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        alert('Format de date invalide. Utilisez YYYY-MM-DD');
        return;
    }

    try {
        const { data, error } = await database
            .from('produits')
            .insert([{ 
                produit, 
                date, 
                prix: parseFloat(prix), 
                quantite: parseInt(quantite),
                globale: parseFloat(globale)
            }]);

        if (error) throw error;

        alert('Produit ajouté avec succès');
        document.querySelector('#produits').reset();
    } catch (error) {
        alert('Erreur lors de l\'ajout de Produit: ' + error.message);
        console.error('Erreur lors de l\'ajout de Produit:', error);
    }
});












// Fonction pour afficher les produits depuis Supabase
async function afficherProduits() {
    try {
        const { data: produits, error } = await database
            .from('produits')
            .select('*');
        
        if (error) throw error;

        const produitList = document.querySelector('#produit-list');
        produitList.innerHTML = ''; // Réinitialiser la liste des produits

        produits.forEach(produit => {
            const produitElement = document.createElement('div');
            produitElement.classList.add('card', 'mt-4');
            produitElement.innerHTML = `
             <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center">
                <div class="produit-left flex d-flex">
                    <div>
                        <img src="https://img.freepik.com/photos-gratuite/woman-shopping-legumes-au-supermarche_1157-37876.jpg?ga=GA1.1.1272467380.1720960746&semt=ais_user" alt="" style="width: 80px;">
                    </div>
                    <div class="ml-6">
                        <h4><strong>${produit.produit}</strong></h4>
                        <p class="mt-2">${produit.prix}f</p>
                    </div>
                </div>
                <div class="date-globale ml-8 justify-content-end">
                    <p style="font-size: 12px;color: grey;">${produit.date}</p>
                    <p class="mt-2" style="font-size: 14px;color: grey;">Globale: ${produit.globale}f</p>
                </div>
                    </div>
                </div>
            `;
            produitList.appendChild(produitElement);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
    }
}

// Appel initial pour afficher les produits lorsqu'on charge la page
afficherProduits();

