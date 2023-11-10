{
    let categories = ["Films les mieux notés", "catégorie 1", "catégorie 2", "catégorie 3"]
    let presentation = document.getElementById("ensembleCategories")
    let v=0

    while (v < categories.length){
        let titreCategorie = document.createElement("h2")
        titreCategorie.textContent = categories[v]
        titreCategorie.style.borderBottom = "1px solid black"
        presentation.appendChild(titreCategorie)

        let films = ["film1", "film2", "film3", "film4", "film5", "film6", "film7"]
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

}