const config = require("../config");
const sql = require("mssql");

async function listarPerfiles(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("Opcion", sql.Int, data.Opcion)
      .execute("CRM_ObtenerPerfiles")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { perfiles: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarUsuarios() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .execute("CRM_ObtenerUsuariosCRM")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { usuarios: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarTipoUsuario() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .execute("CRM_ObtenerPerfiles")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { usuarios: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function PerfilesObtenerPorId(id) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("IdPerfil", sql.Int, id)
      .execute("CRM_PerfilesObtenerPorId")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { usuarios: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObetenerUsuarioPorId(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("Id", sql.Int, data.Id)
      .execute("CRM_ObtenerUsuarioId")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { usuario: recordset[0] };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function CrearUsuario(data, newpdw) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const persona = await connection
      .request()
      .input("Nombre", sql.NVarChar(50), data.Nombre)
      .input("Apellido", sql.NVarChar(50), data.Apellido)
      .input("Correo", sql.NVarChar(100), data.Correo)
      .input("Telefono", sql.NVarChar(10), data.Telefono)
      .input("Pwd", sql.NVarChar(100), newpdw)
      .input("TipoUsuario", sql.Int, data.TipoUsuario)
      .input("Fecha", sql.Date, data.fecha)
      .input("UsrAdd", sql.NVarChar(30), data.usr_add)
      .execute("CRM_CrearUsuario")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "Something went wrong",
          };
        }
      });
    connection.close();
    return persona;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function CrearPerfil(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const persona = await connection
      .request()
      .input("Nombre", sql.NVarChar(50), data.Perfil)
      .input("usr_add", sql.NVarChar(50), data.Usuario)
      .input("fch_add", sql.Date, data.fecha)
      .execute("CRM_PerfilesCrear")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { insert: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "Something went wrong",
          };
        }
      });
    connection.close();
    return persona;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarUsuario(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const persona = await connection
      .request()
      .input("Id", sql.Int, data.Id)
      .input("Nombre", sql.NVarChar(50), data.Nombre)
      .input("Apellido", sql.NVarChar(50), data.Apellido)
      .input("Correo", sql.NVarChar(100), data.Correo)
      .input("Telefono", sql.NVarChar(10), data.Telefono)
      .input("TipoUsuario", sql.Int, data.TipoUsuario)
      .input("Fecha", sql.Date, data.fecha)
      .input("UsrAdd", sql.NVarChar(30), data.usr_add)
      .input("Status", sql.Int, data.Status)
      .execute("CRM_EditarUsuario")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { Update: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "Something went wrong",
          };
        }
      });
    connection.close();
    return persona;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObetenerPerfilPorId(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("Id", sql.Int, data.Id)
      .execute("CRM_ObtenerInfoPerfil")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { usuario: recordset[0] };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarPerfil(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const persona = await connection
      .request()
      .input("Id", sql.Int, data.Id)
      .input("Nombre", sql.NVarChar(50), data.Nombre)
      .input("Usuario", sql.NVarChar(50), data.Usuario)
      .input("Fecha", sql.Date, data.Fecha)
      .input("IdStatus", sql.Int, data.IdStatus)
      .execute("CRM_EditarInfoPerfil")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset[0]) {
          return { Update: true, record: recordset[0] };
        } else {
          return {
            error: true,
            message: "Something went wrong",
          };
        }
      });
    connection.close();
    return persona;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarMenus() {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .execute("CRM_MenusObtener")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { Menus: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarMenusId(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("IdPerfil", sql.Int, data.Id)
      .execute("CRM_PerfilesObtenerPorId")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { Menus: recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarPermisos(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const lista = await connection
      .request()
      .input("IdPerfil", sql.Int, data.IdPerfil)
      .input("IdMenu", sql.Int, data.IdMenu)
      .input("Leer", sql.Int, data.Leer)
      .input("Editar", sql.Int, data.Editar)
      .input("Eliminar", sql.Int, data.Eliminar)
      .execute("CRM_PerfilMenusActualizar")
      .then(async (dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { recordset };
        } else {
          return { error: true, message: "Error interno" };
        }
      });
    connection.close();
    return lista;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

module.exports = {
  listarUsuarios,
  CrearUsuario,
  PerfilesObtenerPorId,
  listarTipoUsuario,
  ObetenerUsuarioPorId,
  EditarUsuario,
  listarPerfiles,
  CrearPerfil,
  ObetenerPerfilPorId,
  EditarPerfil,
  listarMenus,
  listarMenusId,
  EditarPermisos,
};
