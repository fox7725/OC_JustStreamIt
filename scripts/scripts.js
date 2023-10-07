{
    let categories = ["Films les mieux notés", "catégorie 1", "catégorie 2", "catégorie 3"]
    let presentation = document.getElementById("ensembleCategories")
    let v=0
    while (v < categories.length){
        let titreCategorie = document.createElement("h2")
        titreCategorie.textContent = categories[v]
        presentation.appendChild(titreCategorie)
        let films = ["film1", "film2", "film3", "film4", "film5", "film6", "film7"]
        let ajoutCategorie = document.createElement("div")
        presentation.appendChild(ajoutCategorie)
        let boutonGauche = document.createElement("button")
        ajoutCategorie.appendChild(boutonGauche)
        let iGauche = document.createElement("i")
        iGauche.setAttribute("class", "fi-cwllx4-arrow-wide")
        boutonGauche.appendChild(iGauche)
        boutonGauche.addEventListener("mouseover", () => {
            console.log("Vous avez survolé sur le bouton gauche de "+categories[v])
        });
        let listeDeFilms = document.createElement("ul")
        ajoutCategorie.appendChild(listeDeFilms)
        let i = 0
        while (i < films.length){
            let film = films[i]
            let ajoutPoint = document.createElement("li")
            ajoutPoint.textContent = film
            listeDeFilms.appendChild(ajoutPoint)
            i+=1
        }
        let boutonDroite = document.createElement("button")
        ajoutCategorie.appendChild(boutonDroite)
        let iDroite = document.createElement("i")
        iDroite.setAttribute("class", "fi-cwlrx4-arrow-wide")
        boutonDroite.appendChild(iDroite)
        boutonDroite.addEventListener("mouseover", () => {
            console.log("Vous avez survolé sur le bouton droite de "+categories[v])
        });
        let retourLigne = document.createElement("p")
        presentation.appendChild(retourLigne)

        v += 1
    }
}