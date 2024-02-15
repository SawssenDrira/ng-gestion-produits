import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/produit';
import { ProduitsService } from '../services/produits.service';

@Component({
  selector: 'app-ajout-produit',
  templateUrl: './ajout-produit.component.html',
  styleUrls: ['./ajout-produit.component.css']
})
export class AjoutProduitComponent implements OnInit {
  nouveauProduit: Produit = new Produit();
  produitsExistant: Produit[] = [];

  constructor(private produitsService: ProduitsService) {}

  ngOnInit(): void {
    this.produitsService.getProduits()
      .subscribe({
        next: produits => {
          this.produitsExistant = produits;
        },
        error: err => {
          console.log("Erreur lors de la récupération des produits", err);
        }
      });
  }

  validerFormulaire(): void {
    // Vérification de l'existence de l'ID
    const existingProduct = this.produitsExistant.find(p => p.id === this.nouveauProduit.id);
    if (existingProduct) {
      alert("Identificateur de produit déjà existant.");
    } else {
      // Ajouter le produit en utilisant le service
      this.ajouterProduit();
      // Réinitialiser le formulaire
      this.nouveauProduit = new Produit();
    }
  }

  private ajouterProduit(): void {
    this.produitsService.addProduit(this.nouveauProduit)
      .subscribe({
        next: addedProduit => {
          console.log("Produit ajouté avec succès", addedProduit);
          // Ajouter le nouveau produit à la liste
          this.produitsExistant = this.produitsExistant.concat(addedProduit);
        },
        error: err => {
          console.log("Erreur lors de l'ajout du produit", err);
        }
      });
  }
  
}