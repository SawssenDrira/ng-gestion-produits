import { Produit } from '../model/produit';
import { NgForm } from '@angular/forms';
import { ProduitsService } from '../services/produits.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Array<Produit> = [];
  produitCourant: Produit = new Produit();
  afficherFormulaireEdition = false; // Nouvelle variable pour contrôler l'affichage du formulaire d'édition

  constructor(private produitsService: ProduitsService) {}

  ngOnInit(): void {
    this.consulterProduits();
  }

  private consulterProduits(): void {
    console.log("Récupération de la liste des produits");
    this.produitsService.getProduits()
      .subscribe({
        next: data => {
          console.log("Succès GET");
          this.produits = data;
        },
        error: err => {
          console.log("Erreur GET", err);
        }
      });
  }

  supprimerProduit(produit: Produit): void {
    const reponse: boolean = confirm("Voulez-vous supprimer le produit :" + produit.designation + " ?");
    if (reponse) {
      this.supprimerProduitHttp(produit);
    } else {
      console.log("Suppression annulée...");
    }
  }

  private supprimerProduitHttp(produit: Produit): void {
    this.produitsService.deleteProduit(produit.id)
      .subscribe({
        next: () => {
          console.log("Succès DELETE");
          this.supprimerProduitLocal(produit);
        },
        error: err => {
          console.log("Erreur DELETE", err);
        }
      });
  }

  private supprimerProduitLocal(produit: Produit): void {
    const index: number = this.produits.indexOf(produit);
    if (index !== -1) {
      this.produits.splice(index, 1);
    }
  }

  editerProduit(produit: Produit): void {
    this.afficherFormulaireEdition = true; // Afficher le formulaire lors de l'édition
    this.produitCourant = { ...produit };
  }

  validerFormulaire(form: NgForm): void {
    console.log(form.value);
    // On peut supposer que si on est dans cette méthode, c'est pour une mise à jour, donc pas besoin de vérifier l'existence de l'ID
    this.metreAJourProduit(form.value, this.produitCourant);
    this.afficherFormulaireEdition = false; // Cacher le formulaire après la validation
    window.location.reload(); // Rechargement de la page pour mettre à jour l'affichage
  }

  private metreAJourProduit(nouveau: Produit, ancien: Produit): void {
    const reponse: boolean = confirm("Produit existant. Confirmez-vous la mise à jour de :" + ancien.designation + " ?");
    if (reponse) {
      this.produitsService.updateProduit(nouveau.id, nouveau)
        .subscribe({
          next: updatedProduit => {
            console.log("Succès PUT");
            this.metreAJourProduitLocal(ancien as Produit, updatedProduit as Produit);

          },
          error: err => {
            console.log("Erreur PUT", err);
          }
        });
    } else {
      console.log("Mise à jour annulée");
    }
  }

  private metreAJourProduitLocal(ancien: Produit, updatedProduit: Produit): void {
    const index: number = this.produits.indexOf(ancien);
    if (index !== -1) {
      this.produits[index] = updatedProduit;
    }
  }
}
