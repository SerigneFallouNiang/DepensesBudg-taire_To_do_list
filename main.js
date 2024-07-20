// Configuration de Supabase
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
const database = supabase.createClient(url, key);

// Sélection des éléments du DOM
const form = document.querySelector('#loginForm');
const formConnexion = document.querySelector('#registerForm');
const Deconnexion = document.getElementById('btnDeconnexion');
const produitForm = document.querySelector('#produits');
const dateFilter = document.querySelector('#dateFilter');

// Fonction de validation de l'email
const validEmail = function(inputEmail) {
    let emailRegExp = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$', 'g');
    let small = inputEmail.nextElementSibling;
    let testEmail = emailRegExp.test(inputEmail.value);
    if (testEmail) {
        small.innerHTML = 'Adresse Valide';
        small.classList.add('text-success');
        small.classList.remove('text-danger');
        return true;
    } else {
        small.innerHTML = 'Adresse Non Valide';
        small.classList.add('text-danger');
        small.classList.remove('text-success');
        return false;
    }
};

// Fonction de validation du mot de passe
const validPassword = function(inputPassword) {
    let msg;
    let valid = false;
    if (inputPassword.value.length < 8) {
        msg = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (!/[A-Z]/.test(inputPassword.value)) {
        msg = "Le mot de passe doit contenir au moins 1 majuscule";
    } else if (!/[a-z]/.test(inputPassword.value)) {
        msg = "Le mot de passe doit contenir au moins 1 minuscule";
    } else if (!/[0-9]/.test(inputPassword.value)) {
        msg = "Le mot de passe doit contenir au moins 1 chiffre";
    } else {
        msg = "Le mot de passe est valide";
        valid = true;
    }
    let small = inputPassword.nextElementSibling;
    if (valid) {
        small.innerHTML = 'Mot de passe Valide';
        small.classList.add('text-success');
        small.classList.remove('text-danger');
        return true;
    } else {
        small.innerHTML = msg;
        small.classList.add('text-danger');
        small.classList.remove('text-success');
        return false;
    }
};

// Fonction de validation du nom
const validNom = function(inputNom) {
    let msg;
    let valid = false;
    if (inputNom.value.length < 3 || inputNom.value.length > 15) {
        msg = "Le nom doit être compris entre 3 et 15 caractères";
    } else {
        msg = "Le nom est valide";
        valid = true;
    }
    let small = inputNom.nextElementSibling;
    if (valid) {
        small.innerHTML = 'Nom Valide';
        small.classList.add('text-success');
        small.classList.remove('text-danger');
        return true;
    } else {
        small.innerHTML = msg;
        small.classList.add('text-danger');
        small.classList.remove('text-success');
        return false;
    }
};

// Gestionnaire d'événement pour l'inscription
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (form.email && form.password && form.nom &&
            validEmail(form.email) && validPassword(form.password) && validNom(form.nom)) {
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

    // Écoute des champs pour validation en temps réel
    if (form.email) form.email.addEventListener('input', function() { validEmail(this); });
    if (form.password) form.password.addEventListener('input', function() { validPassword(this); });
    if (form.nom) form.nom.addEventListener('input', function() { validNom(this); });
}

// Gestionnaire d'événement pour la connexion
if (formConnexion) {
    formConnexion.addEventListener('submit', async function(e) {
        e.preventDefault();
        if (formConnexion.email && formConnexion.password &&
            validEmail(formConnexion.email) && validPassword(formConnexion.password)) {
            try {
                const { data: { user }, error } = await database.auth.signInWithPassword({
                    email: formConnexion.email.value,
                    password: formConnexion.password.value,
                });
                if (error) throw error;
                alert("Connexion réussie !");
                window.location.href = 'index.html';
                // Redirection ou autres actions après connexion réussie
            } catch (error) {
                alert("Erreur lors de la connexion : " + error.message);
            }
        }
    });
}

// Gestionnaire d'événement pour la déconnexion
if (Deconnexion) {
    Deconnexion.addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            const { error } = await database.auth.signOut();
            if (error) throw error;
            alert("Déconnexion réussie !");
            // Redirection ou autres actions après déconnexion réussie
        } catch (error) {
            alert("Erreur lors de la déconnexion : " + error.message);
        }
    });
}

// Gestionnaire d'événement pour l'ajout de produit
if (produitForm) {
    produitForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const produit = document.querySelector('#produit')?.value;
        const date = document.querySelector('#date')?.value;
        const prix = parseFloat(document.querySelector('#prix')?.value);
        const quantite = parseInt(document.querySelector('#quantite')?.value);
        const globale = prix * quantite;

        // Vérification des champs
        if (!produit || !date || isNaN(prix) || isNaN(quantite)) {
            alert('Veuillez remplir tous les champs correctement');
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
                .insert([{ produit, date, prix, quantite, globale }]);

            if (error) throw error;
            alert('Produit ajouté avec succès');
            produitForm.reset();
            afficherProduits();
            populateDateFilter();
        } catch (error) {
            alert('Erreur lors de l\'ajout de Produit: ' + error.message);
            console.error('Erreur lors de l\'ajout de Produit:', error);
        }
    });
}

// Fonction pour peupler le filtre de date
async function populateDateFilter() {
    if (!dateFilter) return;

    try {
        const { data: produits, error } = await database
            .from('produits')
            .select('date')
            .order('date', { ascending: true });

        if (error) throw error;

        const uniqueDates = [...new Set(produits.map(produit => produit.date))];
        dateFilter.innerHTML = '<option selected>Sélectionner une date</option>';

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

// Fonction pour afficher les produits
async function afficherProduits(dateFilter = '') {
    const produitList = document.querySelector('#produit-list');
    if (!produitList) return;

    try {
        const query = database.from('produits').select('*');
        if (dateFilter) {
            query.eq('date', dateFilter);
        }

        const { data: produits, error } = await query;

        if (error) throw error;

        produitList.innerHTML = '';

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

// Initialisation
afficherProduits();
populateDateFilter();

// Écoute du changement de filtre de date
if (dateFilter) {
    dateFilter.addEventListener('change', function() {
        const selectedDate = this.value;
        afficherProduits(selectedDate);
    });
}