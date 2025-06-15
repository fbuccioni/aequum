aequum 
======

Aequum is a framework for building apps common components in a fast and easy
way, also providing a set of common components, utils, models etc.


Design
------

This framework was designed having in mind hexagonal archivecture and clean 
code using the DDD (Domain Driven Design) approach, also the components was 
divided in packages to use them in a modular way.


Packages
--------

- **[@aequum/crudl](packages/crudl/)**: CRUD/CRUDL operations common components
- **[@aequum/exceptions](packages/exceptions/)**: Common exceptions collection
- **[@aequum/geojson-models](packages/geojson-models/)**: GeoJSON models for `class-validator`
- **[@aequum/mongoose](packages/mongoose/)**: Mongoose tools
- **[@aequum/paginate-common](packages/paginate-common/)**: Pagination common components
- **[@aequum/typeorm](packages/typeorm/)**: TypeORM tools
- **[@aequum/types](packages/types/)**: Common types collection
- **[@aequum/utils](packages/utils/)**: Util functions collection
- **[@aequum/validators](packages/validators/)**: Custom validators for `class-validator`
