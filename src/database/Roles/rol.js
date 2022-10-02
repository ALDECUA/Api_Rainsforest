class Perfil {
    constructor() {
        this.IdRol = 0;
        this.Rol = '';
        this.IdEmpresa = 0;
        this.permisos = { lectura: [], escritura: [], delete: [] };
    }

    setData(data) {
        this.IdRol = data.IdRol || 0;
        this.Rol = data.Rol;
        this.IdEmpresa = data.IdEmpresa;
        this.permisos = data.permisos;
    }

    setResult(result) {
        if (Array.isArray(result)) {
            this.lista = result;
        }
    }
}

module.exports = Perfil;