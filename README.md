## Getting Started
`pnpm install`
`edgedb project init`
`pnpm db:generate`
`pnpm dev`

## Créer une migration
* Modifier le schéma dans `packages/database/dbschema/default.esdl`
* Exécuter à la racine du projet `edgedb migration create`
* Exécuter à la racine du projet `edgedb migrate`
* Exécuter à la racine du projet `pnpm db:generate`