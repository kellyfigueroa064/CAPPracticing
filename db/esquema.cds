using { managed,cuid } from '@sap/cds/common';


namespace my.ejemplo;
entity  Productos : cuid,managed {
    nombre: String(255);
    descripcion: String(255);
    categoria: String(255);
    precio: Integer;
    cantidad: Integer;
}

entity Usuarios : cuid, managed {
    username: String(255);
    email: String(255);
    password: String(255);
}