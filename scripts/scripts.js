//--------------------INITIALISATION DES VARIABLES--------------------
// URL de départ
let urlCategorie = 'http://localhost:8000/api/v1/genres/'
let urlFilm = "http://localhost:8000/api/v1/titles/"

// déclaration de la variable globale "categories" qui servira à en afficher 3
let categories = ["Films les mieux notés"]

// Le film le mieux noté à mettre en avant
let filmMieuxNote = {}
// Dictionnaire pour stocker les catégories
let toutesCategories = {}

//--------------------CHARGEMENT & TRAITEMENT DES DONNEES--------------------
// Fonction pour charger un fichier JSON
async function chargerCategories(url) {
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

// Fonction pour extraire les catégories et les ajouter au dictionnaire
function ajouterCategories(data) {
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

// Fonction principale pour charger et traiter les données depuis le JSON
async function chargerEtTraiterCategories() {
    while (urlCategorie != null) {
        let donnees = await chargerCategories(urlCategorie)
        if (donnees) {
            ajouterCategories(donnees)
            urlCategorie = donnees.next
        } else {
            urlCategorie = null
        }
    }

    // Récupération de trois catégories au hasard après le chargement complet
    let valeursCategories = Object.values(toutesCategories)
    categories = choisirAleatoirement(valeursCategories, 3)

    affichage()
}

//Fonction chargeant les 8 meilleurs films (incluant 1 pour la mise en avant)
async function meilleursFilms() {
    let tousLesFilmsDic = {}
    let nombreDeFilmsCharges = 0
    let page = 1
    let urlMeilleursFilms = ""

    while (nombreDeFilmsCharges < 8) {
        if (page === 1) {
            urlMeilleursFilms = `${urlFilm}?sort_by=-imdb_score`
        } else {
            urlMeilleursFilms = `${urlFilm}?page=${page}&sort_by=-imdb_score`
        }

        try {
            let reponse = await fetch(urlMeilleursFilms)
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP: ${reponse.status}`)
            }
            let donnees = await reponse.json()
            for (let film of donnees.results) {
                if (nombreDeFilmsCharges < 8) {
                    if (nombreDeFilmsCharges === 0) {
                        filmMieuxNote = film
                    } else {
                        tousLesFilmsDic[film.id] = film
                    }
                    nombreDeFilmsCharges++
                } else {
                    break
                }
            }
            page++
        } catch (erreur) {
            console.error("Erreur lors du chargement des meilleurs films : ", erreur)
            break
        }
    }
    return Object.values(tousLesFilmsDic)
}

//Fonction chargeant 7 films pour la catégorie demandée
async function filmsDansCategorie (cat) {
    let tousLesFilms = new Set()
    let pages = []
    let nbPages = 0
    let urlPremierePage = `${urlFilm}?genre=${cat}`

    try {
        let reponse = await fetch(urlPremierePage)
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`)
        }
        let donnees = await reponse.json()
        console.log("donnee.count" + donnees.count)
        if (donnees.count >= 7) { //S'il y a plus de 7 films dans la catégorie
            nbPages = Math.ceil(donnees.count / 5)
            console.log(nbPages)
            console.log(pages)
            while (pages.length < 7) {
                let pageRandom = Math.floor(Math.random() * nbPages) + 1
                console.log("pagerandom" + pageRandom)
                let urlPage = `${urlFilm}?genre=${cat}&page=${pageRandom}`
                console.log(urlPage)
                pages.push(urlPage)
                let reponsePage = await fetch(urlPage)
                let donneesPage = await reponsePage.json()
                let film = donneesPage.results[Math.floor(Math.random() * donneesPage.results.length)]
                tousLesFilms.add(film.title)
            }
        } else { //Si le nombre de film est inférieur ou égal à 7
            nbPages = Math.ceil(donnees.count / 5)
            console.log(nbPages)
            for (let i = 0; i < donnees.count; i++) {
                let pageRandom = Math.floor(Math.random() * nbPages) + 1
                let urlPage = `${urlFilm}?genre=${cat}&page=${pageRandom}`
                pages.push(urlPage)
                let reponsePage = await fetch(urlPage)
                let donneesPage = await reponsePage.json()
                let film = donneesPage.results[Math.floor(Math.random() * donneesPage.results.length)]
                tousLesFilms.add(film.title)
            }
        }
    } catch (erreur) {
        console.error("Erreur lors du chargement des films : ", erreur)
    }
    return Array.from(tousLesFilms)
}

//--------------------GESTION DE L'AFFICHAGE--------------------


//Popup info du film
async function afficherDetailsFilm(idDuFilm) {
    let popup = document.createElement("div")
    popup.setAttribute("id", "popupFilm")

    //On charge les infos du film
    let urlInfoFilm = urlFilm + idDuFilm
    async function recupInfoFilm() {
        try {
            let reponse = await fetch(urlInfoFilm)
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP: ${reponse.status}`)
            }
            return await reponse.json();
        } catch (erreur) {
            console.error("Erreur lors du chargement des données : ", erreur)
        }
    }
    let infoFilm = await recupInfoFilm()

    let photoFilm = document.createElement("img")
    photoFilm.src = infoFilm.image_url
    popup.appendChild(photoFilm)

    let titreFilm = document.createElement("p")
    titreFilm.textContent = "Titre du film : " + infoFilm.title + " -" +
        " Score Imdb : " + infoFilm.imdb_score
    popup.appendChild(titreFilm)

    let BoxOffice = document.createElement("p")
    BoxOffice.textContent = "Résultat au Box Office : " + infoFilm.worldwide_gross_income + " $"
    popup.appendChild(BoxOffice)

    let directeurFilm = document.createElement("p")
    directeurFilm.textContent = "De : " + infoFilm.directors
    popup.appendChild(directeurFilm)

    let acteursFilm = document.createElement("p")
    acteursFilm.textContent = "Avec : " + infoFilm.actors
    popup.appendChild(acteursFilm)

    let dureeFilm = document.createElement("p")
    dureeFilm.textContent = "Durée : " + infoFilm.duration + " minutes"
    popup.appendChild(dureeFilm)

    let anneeFilm = document.createElement("p")
    anneeFilm.textContent = "Année de sortie : " + infoFilm.year + " en" +
        " " + infoFilm.countries
    popup.appendChild(anneeFilm)

    let categorieFilm = document.createElement("p")
    categorieFilm.textContent = "Genres : " + infoFilm.genres
    popup.appendChild(categorieFilm)

    let evaluation = document.createElement("p")
    evaluation.textContent = "Notre évaluation : " + infoFilm.rated
    popup.appendChild(evaluation)

    let resume = document.createElement("p")
    resume.textContent = "Résumé : " + infoFilm.long_description
    popup.appendChild(resume)

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

//Bloc qui contient le film à mettre en avant
function blocUne(film, parentElement) {
    let divUne = document.createElement("div")
    parentElement.appendChild(divUne)

    let filmImage = document.createElement("img")
    let filmTitre = document.createElement("div")

    filmImage.src = film.image_url
    filmImage.alt = `Affiche du film ${film.title}`
    filmTitre.textContent = film.title

    filmTitre.addEventListener("mouseover", () => {
        filmTitre.style.fontWeight = "bold"
    })

    filmTitre.addEventListener("mouseout", () => {
        filmTitre.style.fontWeight = "normal"
    })

    divUne.appendChild(filmImage)
    divUne.appendChild(filmTitre)

    // Ouverture de la popup avec les infos sur le film
    divUne.addEventListener("click", () => {
        afficherDetailsFilm(film.id)
    })
}

//Bloc qui contient la catégorie et les films
function blocCategorie (titreCategorie, films, parentElement) {
    let divCategorie = document.createElement("div")
    parentElement.appendChild(divCategorie)

    let h2 = document.createElement("h2")
    h2.textContent = titreCategorie;
    divCategorie.appendChild(h2)

    let ajoutCategorie = document.createElement("div")
    ajoutCategorie.setAttribute("class", "categorie")
    divCategorie.appendChild(ajoutCategorie)

    let boutonGauche = document.createElement("button")
    let iGauche = document.createElement("i")
    iGauche.setAttribute("class", "fi-cwllx4-arrow-wide")
    boutonGauche.appendChild(iGauche)
    ajoutCategorie.appendChild(boutonGauche)

    let listeDeFilms = document.createElement("ul")
    ajoutCategorie.appendChild(listeDeFilms)

    let currentFilmIndex = 0 // Variable pour suivre l'index actuel des films affichés

    function afficherFilms() {
        // Efface la liste actuelle
        listeDeFilms.innerHTML = ""

        // Affiche les 4 films suivants ou revient au début si on est à la fin
        for (let i = currentFilmIndex; i < currentFilmIndex + 4; i++) {
            let index = i % films.length
            let film = films[index]

            let filmElement = document.createElement("li")
            let filmImage = document.createElement("img")
            let filmTitre = document.createElement("div")
            filmTitre.setAttribute("class", "titreFilmNorm")

            filmImage.src = film.image_url
            filmImage.alt = `Affiche du film ${film.title}`
            filmTitre.textContent = film.title

            filmTitre.addEventListener("mouseover", () => {
                filmTitre.setAttribute("class", "titreFilmGras")
            })

            filmTitre.addEventListener("mouseout", () => {
                filmTitre.setAttribute("class", "titreFilmNorm")
            })

            filmElement.appendChild(filmImage)
            filmElement.appendChild(filmTitre)
            listeDeFilms.appendChild(filmElement)

            // Ouverture de la popup avec les infos sur le film
            filmElement.addEventListener("click", () => {
                afficherDetailsFilm(film.id)
            })
        }
    }

    afficherFilms()

    boutonGauche.addEventListener("click", () => {
        currentFilmIndex = (currentFilmIndex - 1 + films.length) % films.length
        afficherFilms()

    })

    let boutonDroite = document.createElement("button")
    let iDroite = document.createElement("i")
    iDroite.setAttribute("class", "fi-cwlrx4-arrow-wide")
    boutonDroite.appendChild(iDroite)
    ajoutCategorie.appendChild(boutonDroite)

    boutonDroite.addEventListener("click", () => {
        currentFilmIndex = (currentFilmIndex + 1) % films.length // Met à
        // jour l'index
        afficherFilms()
    })

    if (typeof friconix_update === "function") {
       friconix_update()
    }
    return divCategorie
}

async function affichage () {
    let filmUne = document.getElementById("filmUne")
    let presentation = document.getElementById("ensembleCategories")
    for (const categorie of categories) {
        let films = []
        if (categorie === "Films les mieux notés") {
            films = await meilleursFilms()
        } else {
            films = await filmsDansCategorie(categorie)
        }
        blocCategorie(categorie,films,presentation)
    }
    blocUne(filmMieuxNote, filmUne)
}

// Lancer le processus
chargerEtTraiterCategories()