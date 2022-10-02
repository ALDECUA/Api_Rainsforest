class User {
    constructor() {
        this.tabla = [];
    }

    setTable(result) {
        if (Array.isArray(result)) {
            const user = []
            result.forEach(p => {
                let permisos = { lectura: [], escritura: [], delete: [] };
                try {
                    permisos = JSON.parse(p.permisos);
                } catch (error) {
                    console.log(error);
                }
                user.push({
                    IdUsuario: p.idusuario,
                    IdEmpresa: p.IdEmpresa,
                    Nombre: p.Nombre,
                    Usuario: p.usuario,
                    IdRol: p.idRol,
                    permisos,
                    BPrueba: p.BPrueba,
                    BFacturacion: p.BFacturacion,
                    NombreComercial:p.Nombre_Comercial
                })
            })
            this.tabla = user;
        }
    }
}

module.exports = User;