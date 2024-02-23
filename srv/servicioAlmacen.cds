using { my.ejemplo as db } from '../db/esquema';

service Sybven {
    entity producto as projection on db.Productos;   
};

service Login {
    entity usuario as projection on db.Usuarios;
};