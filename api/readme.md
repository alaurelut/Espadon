#API Espadon


## Espaces
### Créer un espace

	[POST] /1/space

#### Valeurs
Variable	| Type    	| Description
------- 	| -------	|------------
id_user 	| String 	| L'ID du propriétaire de l'user
name		| String	| Le nom de l'espace
color		| String	| Valeur hexadécimale de la couleur de l'espace. Avec ou sans "#"
description	| String	| Texte de la page "About"(*Optionnel*)

#### Exemple	

##### Requête :

* name = Anniversaire d'Axel c'était super
* id_user = 1
* color = #26357E
* description = Lorem ipsum dolor sit amet



##### Retour :

	{
        "code": 200,
        "message": "OK",
        "data": {
            "id": "16",
            "id_user": "1",
            "name": "Anniversaire d'Axel c'était super",
            "hash": "fneveu/anniversaire-daxel-cetait-super"
        }
    }
	
### Récupérer les infos d'un espace

	[GET] /1/space/:id

#### Paramètres	
	
Champs  | Type    | Description
------- | ------- |------------
id	    | String  | L'ID de l'espace

#### Exemple
	[GET] /1/space/16
##### Retour :
    {
        "code": 200,
        "message": "OK",
        "data": {
            "id_user": "1",
            "name": "Anniversaire d'Axel c'était super",
            "hash": "fneveu/anniversaire-daxel-cetait-super",
            "color": "ff0000",
            "description": "Lorem ipsum dolor sit amet",
            "created_at": "2015-02-27 02:13:31"
        }
    }

### Mettre à jour un espace

    [PUT] /1/space/:id
    
#### Paramètres
        
Champs  | Type    | Description
------- | ------- |------------
id	    | String  | L'ID de l'espace

#### Exemple
    [PUT] /1/space/16
##### Retour :
    {
        "code": 200,
        "message": "OK"
    }

    
### Supprimer un espace

    [DELETE] /1/space/:id


#### Paramètres	
    
Champs  | Type    | Description
------- | ------- |------------
id	    | String  | L'ID de l'espace

#### Exemple
    [DELETE] /1/space/16
##### Retour :
    {
        "code": 200,
        "message": "OK"
    }