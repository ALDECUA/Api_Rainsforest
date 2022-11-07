const config = require("../config");
const sql = require("mssql");

async function listarPerfiles(data) {
  try {
    const lista = await config.query('SELECT * ,(CASE WHEN IdStatus = 1 THEN "Activo" ELSE "Inactivo" END) AS Status  FROM perfiles WHERE IdStatus = 1', [data.Correo, data.Pwd]);
    if (lista) {
      if (lista.length > 0) {
        return { perfiles: JSON.parse(JSON.stringify(lista[0])) };
      } else {
        return { empty: true, message: "Error de credenciales" };
      }
    } else {
      return { error: true, message: "Error interno" };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarUsuarios() {
  try {
    const lista = await config.query('SELECT CONCAT(CU.Nombre," ", CU.Apellidos) AS Nombre,CU.Foto_Perfil, CU.Correo, CU.IdUsuario, CP.Nombre AS Perfil, CU.IdStatus, (CASE WHEN CU.IdStatus = 1 THEN "Activo" ELSE "Inactivo" END) AS Status FROM userr CU LEFT JOIN perfiles CP ON CU.IdPerfil = CP.IdPerfil');
    if (lista) {
      if (lista.length > 0) {
        return { usuarios: JSON.parse(JSON.stringify(lista[0])) };
      } else {
        return { empty: true, message: "Error de credenciales" };
      }
    } else {
      return { error: true, message: "Error interno" };
    }


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

    const lista = await config.query('SELECT P.IdPerfil, P.Nombre, PM.IdPerfilMenu, PM.IdPerfil, PM.IdMenu, PM.Leer, PM.Editar, PM.Eliminar FROM perfiles AS P LEFT JOIN perfilMenus AS PM ON PM.IdPerfil = P.IdPerfil WHERE P.IdPerfil = ?', [id]);
    if (lista) {
      return { usuarios: JSON.parse(JSON.stringify(lista[0])) };
    } else {
      return { error: true, message: "Error interno" };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObetenerUsuarioPorId(data) {
  try {
    const lista = await config.query('SELECT Correo ,Nombre ,Apellidos,Telefono ,IdPerfil,IdStatus FROM userr where IdUsuario=?', [data.Id]);

    if (lista) {
      return { usuario: JSON.parse(JSON.stringify(lista[0])) };
    } else {
      return { error: true, message: "Error interno" };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function CrearUsuario(data, newpdw) {
  try {
    const persona = await config.query('INSERT INTO userr (Correo,Pwd,Nombre,Apellidos,Telefono,IdPerfil,usr_add,usr_del,IdStatus) VALUES (?, ?,?,?, ?,?, ?,?,?)', [data.Correo, newpdw, data.Nombre, data.Apellido, data.Telefono, data.TipoUsuario, data.usr_add, data.fecha, 1]);

    if (persona) {
      return { insert: true, record: JSON.parse(JSON.stringify(persona[0])) };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function CrearPerfil(data) {
  try {
    const persona = await config.query('INSERT INTO perfiles (Nombre, usr_add, fch_del, IdStatus) VALUES (?, ?,?,1)', [data.Perfil, data.Usuario, data.fecha]);

    if (persona) {
      return { insert: true, record: JSON.parse(JSON.stringify(persona[0])) };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarUsuario(data) {
  try {

    const persona = await config.query('update userr set Nombre= ? ,Apellidos= ?,Correo= ?,Telefono= ?,IdPerfil= ?,usr_upd= ?,IdStatus= ? where IdUsuario= ?; ', [data.Nombre, data.Apellido, data.Correo, data.Telefono, data.TipoUsuario, data.fecha, data.Status, data.Id]);

    if (persona) {
      return { Update: true, record: { Updated: 1 } };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObetenerPerfilPorId(data) {
  try {

    const lista = await config.query('select Nombre,IdStatus from perfiles where IdPerfil= ?;', [data.Id]);
    if (lista) {
      return { usuarios: JSON.parse(JSON.stringify(lista[0][0])) };
    } else {
      return { error: true, message: "Error interno" };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarPerfil(data) {
  try {

    const persona = await config.query('update perfiles set Nombre= ? ,usr_upd= ?,IdStatus= ? where IdPerfil= ?; ', [data.Nombre, data.Usuario, data.IdStatus, data.Id]);

    if (persona) {
      return { Update: true, record: { Updated: 1 } };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }


  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarMenus() {
  try {

    const lista = await config.query('	SELECT IdMenu, Texto, IdStatus, IdParent FROM menus ORDER BY IdParent,IdMenu');
    if (lista) {
      return { Menus: JSON.parse(JSON.stringify(lista[0])) };
    } else {
      return { error: true, message: "Error interno" };
    }

  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarMenusId(data) {
  try {
    const lista = await config.query('SELECT P.IdPerfil, P.Nombre, PM.IdPerfilMenu, PM.IdPerfil, PM.IdMenu, PM.Leer, PM.Editar, PM.Eliminar FROM perfiles AS P LEFT JOIN perfilmenus AS PM ON PM.IdPerfil = P.IdPerfil WHERE P.IdPerfil = ?', [data.Id]);
    if (lista) {
      return { Menus: JSON.parse(JSON.stringify(lista[0])) };
    } else {
      return { error: true, message: "Error interno" };
    }


  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarPermisos(data) {
  try {

    const respuesta = await config.query('SELECT * FROM perfilmenus WHERE IdPerfil = ? and IdMenu = ?	', [data.IdPerfil, data.IdMenu]);
    let respuestados = JSON.parse(JSON.stringify(respuesta[0]))
    if (respuestados[0]) {
      const recordset = await config.query('UPDATE perfilmenus SET Leer = ?, Editar = ?, Eliminar = ? WHERE IdPerfil = ? AND IdMenu = ?;', [data.Leer, data.Editar, data.Eliminar, data.IdPerfil, data.IdMenu]);
      if (recordset) {
        return { Updated: 1 };
      } else {
        return { error: true, message: "Error interno" };
      }
    } else {

      const recordset = await config.query('INSERT INTO perfilmenus (IdPerfil, IdMenu, Leer, Editar,Eliminar) VALUES (?, ?,?, ?, ?);', [data.IdPerfil, data.IdMenu, data.Leer, data.Editar, data.Eliminar]);
      if (recordset) {
        return { Updated: 1 };
      } else {
        return { error: true, message: "Error interno" };
      }
    }

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
