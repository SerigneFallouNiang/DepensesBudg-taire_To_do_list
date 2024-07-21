document.addEventListener('DOMContentLoaded', function() {
    const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
    const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
    const database = supabase.createClient(url, key);

    let form = document.querySelector('#loginForm');
    let ProduitSave = document.querySelector('#save');
    let SectionConnexion = document.querySelector('#SectionConnexion');
    let SectionInscription = document.querySelector('#SectionInscription');
    let toDoListe = document.querySelector('#to-do-list');
    const Deconnexion = document.getElementById('btnDeconnexion');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (validEmail(form.email) && validPassword(form.password) && validNom(form.nom)) {
                try {
                    const { data: user, error } = await database.auth.signUp({
                        email: form.email.value,
                        password: form.password.value,
                        options: {
                            data: { 
                                name: form.nom.value 
                            }
                        }
                    });

                    if (error) throw error;

                    alert("Vous êtes inscrit avec succès ! Veuillez vérifier votre email pour confirmer votre compte.");
                    form.reset();
                } catch (error) {
                    alert("Erreur lors de l'inscription : " + error.message);
                }
            }
        });

        form.email.addEventListener('input', function() {
            validEmail(this);  
        });

        form.password.addEventListener('input', function() {
            validPassword(this);  
        });

        form.nom.addEventListener('input', function() {
            validNom(this);  
        });
    }

    // Connexion de l'utilisateur
    const formConnexion = document.querySelector('#registerForm'); 

    if (formConnexion) {
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
    }

    if (Deconnexion) {
        Deconnexion.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                const { error } = await database.auth.signOut();
                if (error) throw error;
                alert("Déconnexion réussie !");
                // Redirection ou autres actions après déconnexion réussie
                window.location.href = 'index.html'; // Exemple de redirection
            } catch (error) {
                alert("Erreur lors de la déconnexion : " + error.message);
            }
        });
    }

    document.querySelector('#produits').addEventListener('submit', async function(e) {
        e.preventDefault();

        const produit = document.querySelector('#produit').value;
        const date = document.querySelector('#date').value;
        const prix = document.querySelector('#prix').value;
        const quantite = document.querySelector('#quantite').value;
        const globale = prix * quantite;

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

    async function afficherProduits(dateFilter = '') {
        try {
            let query = database.from('produits').select('*');
            if (dateFilter) {
                query = query.eq('date', dateFilter);
            }
            const { data: produits, error } = await query;
            if (error) throw error;

            const produitListe = document.querySelector('#produit-liste');
            produitListe.innerHTML = '';

            produits.forEach(produit => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${produit.produit} | ${produit.date} | ${produit.prix} € | ${produit.quantite} | ${produit.globale} €`;
                produitListe.appendChild(li);
            });
        } catch (error) {
            console.error('Erreur lors de l\'affichage des produits:', error);
        }
    }

    document.querySelector('#dateFilter').addEventListener('change', function() {
        const selectedDate = this.value;
        afficherProduits(selectedDate);
    });

    window.addEventListener('DOMContentLoaded', async function() {
        await afficherProduits();
        await populateDateFilter();
    });
});
