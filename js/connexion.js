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

