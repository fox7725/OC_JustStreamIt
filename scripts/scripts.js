

let categories = ["Films les mieux notés", "catégorie 1", "catégorie 2", "catégorie 3"]
let presentation = document.getElementById("ensembleCategories")
let v=0

while (v < categories.length){
    let titreCategorie = document.createElement("h2")
    titreCategorie.textContent = categories[v]
    titreCategorie.style.borderBottom = "1px solid black"
    presentation.appendChild(titreCategorie)

    let films = ["film 1", "film 2", "film 3", "film 4", "film 5", "film 6", "film 7"]
    let ajoutCategorie = document.createElement("div")
    presentation.appendChild(ajoutCategorie)

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
        popup.textContent = "Détails du film : " + nomDuFilm
        document.body.appendChild(popup)

        function fermerPopup(e) {
            if(!popup.contains(e.target)) {
                popup.remove()
                document.removeEventListener("click", fermerPopup)
            }
        }

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

            // Ouverture de la modale avec les infos sur le film
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

    let retourLigne = document.createElement("p")
    let retourLigne2 = document.createElement("p")
    presentation.appendChild(retourLigne2)
    presentation.appendChild(retourLigne)
    retourLigne.style.borderBottom = "5px solid black"
    presentation.appendChild(retourLigne)

    v += 1
}