class Roles {
    constructor() {
        this.lista = [];
        this.tabla = [];
    }

    setResult(result) {
        if (Array.isArray(result)) {
            this.lista = result;
        }
    }

    setTable(result) {
        if (Array.isArray(result)) {
            const roles = []
            result.forEach(p => {
                let permisos = { lectura: [], escritura: [], delete: [] };
                try {
                    permisos = JSON.parse(p.permisos);
                } catch (error) {
                   
                }
                roles.push({
                    IdRol: p.IdRol,
                    Rol: p.Nombre,
                    IdEmpresa: p.idEmpresa,
                    permisos,
                })
            })
            this.tabla = roles;
        }
    }
}

module.exports = Roles;