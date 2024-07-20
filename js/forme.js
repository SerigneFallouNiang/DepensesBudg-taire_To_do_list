const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
const database = supabase.createClient(url, key);

let form = document.querySelector('#loginForm');
//Ajouter un produit
let ProduitSave = document.querySelector('#save');
let SectionConnexion = document.querySelector('#SectionConnexion');
let SectionInscription = document.querySelector('#SectionInscription'); 
let toDoListe = document.querySelector('#to-do-list');  
const Deconnexion = document.getElementById('btnDeconnexion');
// console.log(form.email);



// Ecouter la soumission du formulaire
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
// Ecouter la modification de l'email
form.email.addEventListener('input',function(){
validEmail(this);  
});


// Ecouter la modification du password
// le petit e sert à récuperer l'évennement
form.password.addEventListener('input',function(){
    validPassword(this);  
    });

    // le changement du nom
form.nom.addEventListener('input',function(){
    validNom(this);  
    });




//********************** */ validation Email******************
const validEmail = function (inputEmail){
    // création de l'expression reguliaire pour validation email
    let emailRegExp = new RegExp(
'^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$',
'g'
    );



// nextElementSibling c'est pour attraper la balise qui est juste aprés
// recuperation de la balise small
let small = inputEmail.nextElementSibling;

// on test l'expression reguliere
let testEmail = emailRegExp.test(inputEmail.value);
if(testEmail){
    small.innerHTML = 'Adresse Valide';
    small.classList.add('text-success');
    small.classList.remove('text-danger');
    return true;
} else{
    small.innerHTML = 'Adresse Non Valide';
    small.classList.add('text-danger');
    small.classList.remove('text-success');
    return false;
}
};




//********************** */ validation Password******************
const validPassword = function (inputPassword){
    let msg;
    let valid = false;

    // Au moins 8 caracteres
    if(inputPassword.value.length < 8){
        msg = "Le mot de passe doit contenir au moins 8 caracteres"
    }
    // Au moins 1 maj
    else if (!/[A-Z]/.test(inputPassword.value)){
        msg = "Le mot de passe doit contenir au moins 1 majuscule" 
    }
    // Au moins 1 min
    else if (!/[a-z]/.test(inputPassword.value)){
        msg = "Le mot de passe doit contenir au moins 1 minuscule" 
    }
    // Au moins 1 chiffrhttps://formulairevalid.netlify.app/e
    else if (!/[0-9]/.test(inputPassword.value)){
        msg = "Le mot de passe doit contenir au moins 1 chiffre" 
    }

    // Mot de passe valide 
    else{
        msg = "Le mot de passe est valide" 
        valid = true;
    }

    // Affichage
    // recuperation de la balise small
let small = inputPassword.nextElementSibling;

// on test l'expression reguliere
if(valid){
    small.innerHTML = 'Mot de passe Valide';
    small.classList.add('text-success');
    small.classList.remove('text-danger');
    // return true permet de controller le button submit
    return true ;
} else{
    small.innerHTML = msg;
    small.classList.add('text-danger');
    small.classList.remove('text-success');
      // return false permet de controller le button submit
      return false ;
}
};




//********************** */ validation Nom******************
const validNom = function (inputNom){
    let msg;
    let valid = false;

    // Nom compris entre 3 et 15
    if(inputNom.value.length < 3 || inputNom.value.length > 15){
        msg = "Le nom doit etre compris entre 3 et 15"
    }
    else{
        msg = "Le nom est est valide" 
        valid = true;
    }

    // Affichage
    // recuperation de la balise small
let small = inputNom.nextElementSibling;

// on test l'expression reguliere
if(valid){
    small.innerHTML = 'Nom  Valide';
    small.classList.add('text-success');
    small.classList.remove('text-danger');
    // return true permet de controller le button submit
    return true ;
} else{
    small.innerHTML = msg;
    small.classList.add('text-danger');
    small.classList.remove('text-success');
      // return false permet de controller le button submit
      return false ;
}
};





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
         window.location.href = 'index.html'; // Exemple de redirection
    } catch (error) {
        alert("Erreur lors de la déconnexion : " + error.message);
    }
});





const produit = document.querySelector('#produit').value;
const date = document.querySelector('#date').value;
const prix = document.querySelector('#prix').value;
const quantite = document.querySelector('#quantite').value;

// Écouteur d'événement pour la soumission du formulaire d'ajout des données
document.querySelector('#produits').addEventListener('submit', async function(e) {
    e.preventDefault();
     // Ajouter l'idée à Supabase
     const { data, error } = await database
     .from('produits')
     .insert([{ produit, date, prix, quantite}]);
     
     if (error) {
        alert('Erreur lors de l\'ajout de Produit');
        console.error('Erreur lors de l\'ajout de Produit:', error);
    } else {
        alert('Produit ajouté avec succès');
        document.querySelector('#produits').reset();
    }
});