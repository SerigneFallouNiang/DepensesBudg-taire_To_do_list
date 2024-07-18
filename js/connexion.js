const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0Z2l1dHZmanZ6bmtjZG5udGRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjEzMjQ3MDAsImV4cCI6MjAzNjkwMDcwMH0._A7DsFg8SstWla2xsg78nJUwK8G8GJbWzDNnPah7kCw";
const url = "https://ktgiutvfjvznkcdnntdk.supabase.co";
const database = supabase.createClient(url, key);

// Connexion de l'utilisateur
const formConnexion = document.querySelector('#registerForm'); // Assurez-vous que le bon ID est utilisé

// Écouteur d'événement pour la soumission du formulaire de connexion
formConnexion.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (validEmail(formConnexion.email.value) && validPassword(formConnexion.password.value)) {
        try {
            const { data: { user }, error } = await supabase.auth.signInWithPassword({
                email: formConnexion.email.value,
                password: formConnexion.password.value,
            });

            if (error) throw error;

            alert("Connexion réussie !");
            // Redirection ou autres actions après connexion réussie
            window.location.href = 'dashboard.html'; // Exemple de redirection
        } catch (error) {
            alert("Erreur lors de la connexion : " + error.message);
        }
    } else {
        alert("Veuillez vérifier vos identifiants");
    }
});

// Assurez-vous d'avoir ces fonctions de validation
function validEmail(email) {
    // Exemple simple de validation d'email
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function validPassword(password) {
    // Exemple simple de validation de mot de passe
    return password.length >= 6;
}
