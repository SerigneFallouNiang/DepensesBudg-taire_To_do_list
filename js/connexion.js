const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
const database = supabase.createClient(url, key);







// Connexion de l'utilisateur
const formConnexion = document.querySelector('#registerForm'); 

// Écouteur d'événement pour la soumission du formulaire de connexion
formConnexion.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (validEmail(formConnexion.email) && validPassword(formConnexion.password)) {
        try {
            const { data: { user }, error } = await database.auth.signInWithPassword({
                email: formConnexion.email.value,
                password: formConnexion.password.value,
            });

            if (error) throw error;

            alert("Connexion réussie !");
            // Redirection ou autres actions après connexion réussie
            // window.location.href = 'dashboard.html'; // Exemple de redirection
        } catch (error) {
            alert("Erreur lors de la connexion : " + error.message);
        }
    }
});


// Écouteur d'événement pour la soumission du formulaire de connexion
Deconnexion.addEventListener('click', async function(e) {
    e.preventDefault();
       // Déconnexion de l'utilisateur
    try {
        const { error } = await database.auth.signOut();
        if (error) throw error;
        alert("Déconnexion réussie !");
        // Redirection ou autres actions après déconnexion réussie
        // window.location.href = 'index.html'; // Exemple de redirection
    } catch (error) {
        alert("Erreur lors de la déconnexion : " + error.message);
    }
});

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

// Function to populate date filter options
async function populateDateFilter() {
    try {
        const { data: produits, error } = await database
            .from('produits')
            .select('date')
            .order('date', { ascending: true });

        if (error) throw error;

        const uniqueDates = [...new Set(produits.map(produit => produit.date))];
        const dateFilter = document.querySelector('#dateFilter');
        dateFilter.innerHTML = '<option selected>Selectionner une date</option>';

        uniqueDates.forEach(date => {
            const option = document.createElement('option');
            option.value = date;
            option.textContent = date;
            dateFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des dates:', error);
    }
}

// Function to display products
async function afficherProduits(dateFilter = '') {
    try {
        const query = database.from('produits').select('*');
        if (dateFilter) {
            query.eq('date', dateFilter);
        }

        const { data: produits, error } = await query;

        if (error) throw error;

        const produitList = document.querySelector('#produit-list');
        produitList.innerHTML = ''; // Reset the product list

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

// Initial call to display products and populate the date filter
afficherProduits();
populateDateFilter();

// Ajouter un evennement pour  ecouter le changement du date filtre
document.querySelector('#dateFilter').addEventListener('change', function() {
    const selectedDate = this.value;
    afficherProduits(selectedDate);
});
