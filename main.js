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
                window.location.href = 'connexion.html';
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

// Connexion de l'utilisateur

if (formConnexion) {
    formConnexion.addEventListener('submit', async function(e) {
        e.preventDefault();

        const emailInput = formConnexion.querySelector('input[name="email"]');
        const passwordInput = formConnexion.querySelector('input[name="password"]');

        if (emailInput && passwordInput && 
            validEmail(emailInput) && validPassword(passwordInput)) {
            try {
                const { data, error } = await database.auth.signInWithPassword({
                    email: emailInput.value,
                    password: passwordInput.value,
                });

                if (error) throw error;
                window.location.href = 'index.html';
            } catch (error) {
                alert("Erreur lors de la connexion : " + error.message);
            }
        } else {
            alert("Veuillez entrer un email et un mot de passe valides.");
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
            window.location.href = 'connexion.html';
        } catch (error) {
            alert("Erreur lors de la déconnexion : " + error.message);
        }
    });
}


// Fonction pour récupérer l'ID de l'utilisateur connecté
async function getUserId() {
    try {
        const { data: { user }, error } = await database.auth.getUser();
        if (error) throw error;
        return user.id;
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
        return null;
    }
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
            const userId = await getUserId(); // Récupérer l'ID utilisateur connecté
            if (!userId) throw new Error('Utilisateur non authentifié.');
             

             const { data, error } = await database
                .from('produits')
                .insert([{ produit, date, prix, quantite, globale ,acheter: false ,user_id: userId }]);

            if (error) throw error;
            // alert('Produit ajouté avec succès');
                    if (error) throw error;
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Produit ajouter avec succes",
                    showConfirmButton: false,
                    timer: 1500
                });
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
async function afficherProduits(dateFilter = '') {
    const produitList = document.querySelector('#produit-list');
    if (!produitList) return;

    try {
        const userId = await getUserId(); // Récupérer l'ID utilisateur connecté
        if (!userId) throw new Error('Utilisateur non authentifié.');


           // Assurez-vous que dateFilter est une date valide avant de l'utiliser
           if (dateFilter === 'Sélectionner une date' || !/^\d{4}-\d{2}-\d{2}$/.test(dateFilter)) {
            dateFilter = ''; // Ne pas filtrer par date si la valeur est invalide
        }


        const query = database.from('produits').select('*').eq('user_id', userId); // Filtrer par user_id

        if (dateFilter) {
            query.eq('date', dateFilter);
        }

        const { data: produits, error } = await query;

        if (error) throw error;

        // Réinitialiser complètement le contenu
        produitList.innerHTML = '';

        // Créer les sections pour les produits à acheter et déjà achetés
        const produitsAAcheter = document.createElement('div');
        produitsAAcheter.innerHTML = '<h3>Produits à acheter</h3>';
        
        const produitsAchetes = document.createElement('div');
        produitsAchetes.innerHTML = '<h3 class="mt-4">Produits déjà achetés</h3><hr>';

        produits.forEach(produit => {
            const produitElement = creerElementProduit(produit);
            
            if (produit.acheter) {
                produitsAchetes.appendChild(produitElement);
            } else {
                produitsAAcheter.appendChild(produitElement);
            }
        });

        // Ajouter les deux sections au produitList
        produitList.appendChild(produitsAAcheter);
        produitList.appendChild(produitsAchetes);

    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
    }
}

function creerElementProduit(produit) {
    const produitElement = document.createElement('div');
    produitElement.classList.add('card', 'mt-4');
    if (produit.acheter) {
        produitElement.classList.add('produit-achete');
    }
    produitElement.innerHTML = `
        <div class="card-body" data-id="${produit.id}" data-nom="${produit.produit}">
            <div class="d-flex justify-content-between align-items-center">
                <div class="produit-left flex d-flex">
                    <div>
                    </div>
                    <div class="ml-8">
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


    if (produit.acheter) {
         // Ajouter un écouteur d'événements pour le clic sur le produit
    produitElement.addEventListener('click', async function() {
        const produitId = produitElement.querySelector('.card-body').dataset.id;
        const { value: action } = await Swal.fire({
            title: "Déja acheté",
            text:`Que voulez-vous faire avec "${produit.produit}" ?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Restaurer"
          }).then((result) => {
            if (result.isConfirmed) {
                RestaurerProduit(produit.id) 
            // Initialisation
                afficherProduits();
                populateDateFilter();
            }
          });
    });
    }else{
             // Ajouter un écouteur d'événements pour le clic sur le produit
    produitElement.addEventListener('click', async function() {
        const produitId = produitElement.querySelector('.card-body').dataset.id;
        const { value: action } = await Swal.fire({
            title: `Que voulez-vous faire avec "${produit.produit}" ?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Modifier',
            cancelButtonText: 'Acheter',
            showDenyButton: true,
            denyButtonText: 'Supprimer',
            customClass: {
                confirmButton: 'btn btn-primary me-3',
                denyButton: 'btn btn-danger me-3',
                cancelButton: 'btn btn-secondary'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                ouvrirModalModification(produit.id); 
            } else if (result.isDenied) {
                supprimerProduit(produit.id);
                
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                AcheterProduit(produit.id);
                  // Initialisation
                  afficherProduits();
                  populateDateFilter();
            }
        });
    });
    }
   

    return produitElement;
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


// Fonction pour supprimer un produit
async function supprimerProduit(id) {
    try {
        const result = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer !",
            cancelButtonText: "Annuler"
        });

        if (result.isConfirmed) {
            const { error } = await database
                .from('produits')
                .delete()
                .eq('id', id);

            if (error) throw error;

            Swal.fire('Supprimé !', 'Le produit a été supprimé.', 'success');
            afficherProduits(document.querySelector('#dateFilter').value);
            populateDateFilter();
        }
        afficherProduits();
        populateDateFilter();
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        Swal.fire('Erreur', 'Impossible de supprimer le produit', 'error');
    }
}




//Fonction pour la modification
// Fonction pour ouvrir la modal de modification et pré-remplir avec les détails du produit
async function ouvrirModalModification(id) {
    try {
        const { data: produit, error } = await database
            .from('produits')
            .select('*')
            .eq('id', id)
            .single(); // Assurez-vous de récupérer un seul enregistrement

        if (error) throw error;

        // Pré-remplir le formulaire de modification avec les détails du produit
        document.querySelector('#editId').value = produit.id;
        document.querySelector('#editDate').value = produit.date;
        document.querySelector('#editProduit').value = produit.produit;
        document.querySelector('#editPrix').value = produit.prix;
        document.querySelector('#editQuantite').value = produit.quantite;

             // Vérification des valeurs pré-remplies
             console.log(produit.produit);

        // Ouvrir la modal
        const editModal = new bootstrap.Modal(document.getElementById('editModal'));
        editModal.show();
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du produit:', error);
    }
}

// Gestionnaire pour le formulaire de modification
document.getElementById('editProduit').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editId').value;
    const date = document.getElementById('editDate').value;
    const produit = document.getElementById('editProduit').value;
    const prix = parseFloat(document.getElementById('editPrix').value);
    const quantite = parseInt(document.getElementById('editQuantite').value);
    const globale = prix * quantite;

    try {
        const { data, error } = await database
            .from('produits')
            .update({ date, produit, prix, quantite, globale })
            .eq('id', id);

        if (error) throw error;

        Swal.fire('Succès', 'Le produit a été modifié avec succès', 'success');
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        afficherProduits(document.querySelector('#dateFilter').value);
        // Initialisation
            afficherProduits();
            populateDateFilter();
    } catch (error) {
        console.error('Erreur lors de la modification:', error);
        Swal.fire('Erreur', 'Impossible de modifier le produit', 'error');
    }
});


// Marquage des produits acheté
// Fonction pour approuver une idée
async function AcheterProduit(id) {
    try {
        const { error } = await database.from('produits').update({ acheter: true }).eq('id', id);

        if (error) {
            throw error;
        }
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Produit acheté avec succes",
            showConfirmButton: false,
            timer: 1500
          });
          afficherProduits();
          populateDateFilter();
    } catch (error) {
        console.error('Erreur lors de l\'achat du produit', error);
    }
}


// Fonction pour Restaurer un produits 
async function RestaurerProduit(id) {
    try {
        const { error } = await database.from('produits').update({ acheter: false }).eq('id', id);

        if (error) {
            throw error;
        }
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Produit Restauré  avec succes",
            showConfirmButton: false,
            timer: 1500
          });
        afficherProduits();
        populateDateFilter();
    } catch (error) {
        console.error('Erreur lors de l\'achat du produit', error);
    }
}