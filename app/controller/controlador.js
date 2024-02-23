
// llamada previa carga de la pagina
window.addEventListener("load", loadDada);
HOST = window.location.host;

// Actualizar la data listada
function loadDada() {
    $.get("https://" + HOST + "/odata/v4/sybven/producto", (data, status) => {
        cargarDataPoductos(data);
    });
};

// Permite reorganizar los elementos listados en base a filtro de categoria o con el buscador
function filtrosProductosGet(value,busq) {
    switch (value ? value : "") {
        case "Categoria":
            $.get("https://" + HOST + "/odata/v4/sybven/producto?$orderby=categoria", callbakc);
            break;
        case "Busqueda":
            $.get("https://" + HOST + "/odata/v4/sybven/producto?$search="+busq.trim(), callbakc);
            break;
        default:
            $.get("https://" + HOST + "/odata/v4/sybven/producto", callbakc);
            break;
    }
};

function callbakc(data) {
    cargarDataPoductos(data);
};

function setSelection(aux, inten) {
    switch (inten) {
        case "Edit":
            document.getElementById("TitleModal").innerHTML = "Editar producto";
            document.getElementById("btnTitleModal").innerHTML = "Guardar";
            document.getElementById("btnTitleModal").onclick=editarProducto;
            $.get("https://" + HOST + "/odata/v4/sybven/producto/" + aux.trim(), (data, status) => {
                setDataModal(data);
            });
            break;
 
        default:
            //Crear
            document.getElementById("TitleModal").innerHTML = "Agregar Producto";
            document.getElementById("btnTitleModal").innerHTML = "Agregar";
            document.getElementById("btnTitleModal").onclick=AgregarProducto;
            document.getElementById("Nombre").value = "";
            document.getElementById("Descripcion").value = "";
            document.getElementById("Categoria").value = "";
            document.getElementById("Precio").value = "";
            document.getElementById("Cantidad").value = "";
            document.getElementById("idAlumno").value = "";
            break;
    }
};

function setDataModal(d) {
    var productoinput = document.getElementById("Nombre");
    var nombreinput = document.getElementById("Descripcion");
    var apellidoinput = document.getElementById("Categoria");
    var gradoSelec = document.getElementById("Precio");
    var seccionSelec = document.getElementById("Cantidad");
    var idAlumno = document.getElementById("idAlumno");
    productoinput.value = d.nombre;
    nombreinput.value = d.descripcion;
    apellidoinput.value = d.categoria;
    gradoSelec.value = d.precio;
    seccionSelec.value = d.cantidad;
    idAlumno.value = d.ID;

};

function editarProducto() {
    var Nombre = document.getElementById("Nombre").value;
    var Descripcion = document.getElementById("Descripcion").value;
    var Categoria = document.getElementById("Categoria").value;
    var Precio = document.getElementById("Precio").value;
    var Cantidad = document.getElementById("Cantidad").value;
    var idAlumno = document.getElementById("idAlumno").value;
    var obj = {
        "ID": idAlumno,
        "nombre": Nombre,
        "descripcion": Descripcion,
        "categoria": Categoria,
        "precio": parseInt(Precio),
        "cantidad": parseInt(Cantidad)
    };
    RequestJSON("PUT",obj, function (res) {
         //console.log("Success 2:", res);
        loadDada();
        document.getElementById("cerrarModal").click();
    });
};

async function RequestJSON(method, data, callback) {
    var endPoint = "";
    switch (method) {
        case "DELETE":
        case "PUT":
            console.log("paso 20"); 
            endPoint = "https://" + HOST + "/odata/v4/sybven/producto/" + data.ID.trim();
            break;

        default:
            endPoint = "https://" + HOST + "/odata/v4/sybven/producto"
            break;
    }
    try {
        const response = await fetch(endPoint, {
            method: method, // or 'PUT'
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        callback(result);
    } catch (error) {
        console.error("Error:", error);
        callback({ "Error": "Falla de servicio" });
    }
};

function deleteConfirm(id,method,Nombre){
    msg="¿ Está seguro de eliminar el producto "+Nombre+" ?";
    if(confirm(msg)==true){
        RequestJSON(method,{"ID":id},function (res) {
            alert("Producto eliminado con éxito.");
            loadDada();
        });
    }
};

function AgregarProducto() {
    var Nombre = document.getElementById("Nombre").value;
    var Descripcion = document.getElementById("Descripcion").value;
    var Categoria = document.getElementById("Categoria").value;
    var Precio = document.getElementById("Precio").value;
    var Cantidad = document.getElementById("Cantidad").value;
    var obj = {
        "nombre": Nombre,
        "descripcion": Descripcion,
        "categoria": Categoria,
        "precio": parseInt(Precio),
        "cantidad": parseInt(Cantidad)
    };
    RequestJSON("POST",obj, function (res) {
         console.log("Success 2:", res);
        loadDada();
        document.getElementById("cerrarModal").click();
    });  
};

function cargarDataPoductos(data) {
    var item = ' <tr>' +
        '<td>{{Nombre}}</td>' +
        '<td>{{Descripcion}}</td>' +
        '<td>{{Categoria}}</td>' +
        '<td>{{Precio}}</td>' +
        '<td>{{Cantidad}}</td>' +
        '<td>' +        
        '<a href="#" class="edit" title="Edit" data-toggle="modal" data-target="#exampleModal"><i class="bi bi-pen" onclick="setSelection(\'{{ID}}\',\'Edit\')"></i></a>' +
        '<a href="#" class="delete" title="Delete" data-toggle="tooltip"><i class="bi bi-trash3" onclick="deleteConfirm(\'{{ID}}\',\'DELETE\',\'{{Nombre}}\')"></i></a>' +
        '</td>' +
        '</tr>';
    var objArray = [];
    //console.log("data = ",data.value.length);
    if(data.value.length > 0){
        data.value.forEach(element => {
            let aux = item;
            aux = aux.replaceAll("{{ID}}", element.ID);
            aux = aux.replaceAll("{{Nombre}}", element.nombre);
            aux = aux.replaceAll("{{Descripcion}}", element.descripcion);
            aux = aux.replaceAll("{{Categoria}}", element.categoria);
            aux = aux.replace("{{Precio}}", element.precio);
            aux = aux.replace("{{Cantidad}}", element.cantidad);
            objArray.push(aux);
            console.log(element);
        });
        document.getElementById("dataInventary").innerHTML = objArray.join("");
    } else {
        // El objeto result no tiene datos, generar mensaje en la tabla
        item = '<tr>'+
                '<td colspan = "7" style="text-align: center;" >NO HAY PRODUCTOS REGISTRADOS</td>'+
                '<tr/>'
        document.getElementById("dataInventary").innerHTML = item;
    }
};

function toggle(){
    let tabla = document.getElementById("tabla");
    let login = document.getElementById("section");
    if(tabla.style.display === "none"){
        tabla.style.display = "block";
        login.style.display = "none";
    } else{
        tabla.style.display = "none";
        login.style.display = "block";
    }
    
};

document.getElementById('formLogin').addEventListener('submit', function(e) {
    e.preventDefault();
    login()
});

function login() {
    console.log("En login");
    let usuario = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    
    $.get("https://" + HOST + "/odata/v4/login/usuario", (data) => {
        if(data.value[0].username === usuario && data.value[0].password === password){
            toggle();
        } else {
            alert("Las credenciales son incorrectas");
        }
    });
};