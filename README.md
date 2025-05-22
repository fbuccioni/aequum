aequum 
======

Aequum is a framework for building apps common components in a fast and easy way, also providing a set of common components, utils, models etc.


Design
------

This framework was designed having in mind hexagonal archivecture and clean code using the DDD (Domain Driven Design) approach, also the components was divided in packages to use them in a modular way.


Packages
--------

- **[@aequum/crudl](packages/crudl/package.json)**: CRUD/CRUDL operations common components
- **[@aequum/exceptions](packages/exceptions/package.json)**: Common exceptions collection
- **[@aequum/geojson-models](packages/geojson-models/package.json)**: GeoJSON models with `class-validator`
- **[@aequum/mongoose](packages/mongoose/package.json)**: Aequum mongoose tools for repository, pagination, CRUD/CRUDL, configs, and utils
- **[@aequum/paginate-common](packages/paginate-common/package.json)**: Paginated results common components
- **[@aequum/typeorm](packages/mongoose/package.json)**: Aequum TypeORM tools for repository, pagination, CRUD/CRUDL, configs, and utils
- **[@aequum/types](packages/types/package.json)**: Common types collection
- **[@aequum/utils](packages/utils/package.json)**: aequum util functions collection
- **[@aequum/validators](packages/validators/package.json)**: Custom validators for `class-validator`