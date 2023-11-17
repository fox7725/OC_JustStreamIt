// URL de départ
let urlCategorie = 'http://localhost:8000/api/v1/genres/'

// déclaration de la variable globale "categories"
let categories = ["Films les mieux notés"]

// Dictionnaire pour stocker les catégories
let toutesCategories = {}

// Fonction pour charger les données JSON d'une URL
async function chargerDonnees(url) {
    try {
        let reponse = await fetch(url)
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`)
        }
        return await reponse.json();
    } catch (erreur) {
        console.error("Erreur lors du chargement des données : ", erreur)
    }
}

// Fonction pour extraire les données et les ajouter au dictionnaire
function ajouterDansCategories(data) {
    data.results.forEach(element => {
        toutesCategories[element.id] = element.name
    });
}

// Choisir N éléments aléatoires dans un tableau
function choisirAleatoirement(tableau, n) {
    let resultats = ["Films les mieux notés"]
    let copies = tableau.slice()

    for (let i = 0; i < n; i++) {
        if (copies.length === 0) {
            break;
        }
        let index = Math.floor(Math.random() * copies.length)
        resultats.push(copies[index])
        copies.splice(index, 1); // Enlever l'élément choisi pour éviter les doublons
    }

    return resultats
}

// Fonction principale pour charger et traiter les données
async function chargerEtTraiterDonnees() {
    while (urlCategorie != null) {
        let donnees = await chargerDonnees(urlCategorie)
        if (donnees) {
            ajouterDansCategories(donnees)
            urlCategorie = donnees.next
        } else {
            urlCategorie = null
        }
    }
    console.log(toutesCategories)

    // Récupération de trois catégories au hasard après le chargement complet
    let valeursCategories = Object.values(toutesCategories)
    categories = choisirAleatoirement(valeursCategories, 3)
    console.log(categories)

    affichage()
}

// Lancer le processus
chargerEtTraiterDonnees()

//---------------------------------------------------------------------------------------------
function blocCategorie (titreCategorie, films, parentElement) {
    let divCategorie = document.createElement("div")
    parentElement.appendChild(divCategorie);

    let h2 = document.createElement("h2")
    h2.textContent = titreCategorie;
    h2.style.borderBottom = "1px solid black"
    divCategorie.appendChild(h2);

    let ajoutCategorie = document.createElement("div")
    divCategorie.appendChild(ajoutCategorie)

    let boutonGauche = document.createElement("button")
    let iGauche = document.createElement("i")
    iGauche.setAttribute("class", "fi-cwllx4-arrow-wide")
    boutonGauche.appendChild(iGauche)
    ajoutCategorie.appendChild(boutonGauche)

    let listeDeFilms = document.createElement("ul")
    ajoutCategorie.appendChild(listeDeFilms)

    let currentFilmIndex = 0 // Variable pour suivre l'index actuel des films affichés

    function afficherDetailsFilm(nomDuFilm) {
        let popup = document.createElement("div")
        popup.setAttribute("id", "popupFilm")

        let titreFilm = document.createElement("p")
        titreFilm.textContent = "Titre du film : " + nomDuFilm
        popup.appendChild(titreFilm)

        let categorieFilm = document.createElement("p")
        categorieFilm.textContent = "Catégorie du film : " + titreCategorie.textContent
        popup.appendChild(categorieFilm)

        document.body.appendChild(popup)

        function fermerPopup(e) {
            if (!popup.contains(e.target)) {
                popup.remove()
                document.removeEventListener("click", fermerPopup)
            }
        }

        // pour ne pas que le click d'ouverture de la popup se confonde
        // avec le click de fermeture on utilise setTimeout à 0
        setTimeout(() => {
            document.addEventListener("click", fermerPopup)
        }, 0)
    }

        function afficherFilms() {
            // Efface la liste actuelle
            listeDeFilms.innerHTML = ""

            // Affiche les 4 films suivants ou revient au début si on est à la fin
            for (let i = currentFilmIndex; i < currentFilmIndex + 4; i++) {
                let film = films[i % films.length] // Utilise l'opérateur modulo pour revenir au début si nécessaire
                let ajoutPoint = document.createElement("li")

                ajoutPoint.addEventListener("mouseover", () => {
                    ajoutPoint.style.fontWeight = "bold"
                })

                ajoutPoint.addEventListener("mouseout", () => {
                    ajoutPoint.style.fontWeight = "normal"
                })

                ajoutPoint.textContent = film
                listeDeFilms.appendChild(ajoutPoint)

                // Ouverture de la popup avec les infos sur le film
                ajoutPoint.addEventListener("click", () => {
                    afficherDetailsFilm(film)
                })
            }
        }

        afficherFilms()

        boutonGauche.addEventListener("click", () => {
            currentFilmIndex = (currentFilmIndex - 4 + films.length) % films.length
            afficherFilms()

        })

        let boutonDroite = document.createElement("button")
        let iDroite = document.createElement("i")
        iDroite.setAttribute("class", "fi-cwlrx4-arrow-wide")
        boutonDroite.appendChild(iDroite)
        ajoutCategorie.appendChild(boutonDroite)

        boutonDroite.addEventListener("click", () => {
            currentFilmIndex = (currentFilmIndex + 4) % films.length // Met à jour l'index
            afficherFilms()
        })
    if (typeof friconix_update === "function") {
       friconix_update()
    }
    return divCategorie
}

function affichage () {
    let presentation = document.getElementById("ensembleCategories")
    categories.forEach(categorie => {
        let films = ["film 1", "film 2", "film 3", "film 4", "film 5", "film 6", "film 7"]
        blocCategorie(categorie,films,presentation)
    })

    let retourLigne = document.createElement("p")
    let retourLigne2 = document.createElement("p")
    presentation.appendChild(retourLigne2)
    presentation.appendChild(retourLigne)
    retourLigne.style.borderBottom = "5px solid black"
    presentation.appendChild(retourLigne)

}