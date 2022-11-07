const config = require("../config");
const sql = require("mssql");

async function listarPerfiles(data) {
  try {
    const lista = await config.query('SELECT * ,(CASE WHEN IdStatus = 1 THEN "Activo" ELSE "Inactivo" END) AS Status  FROM perfiles WHERE IdStatus = 1',[data.Correo,data.Pwd]);
            if (lista) {
                if (lista.length > 0) {
                    return {perfiles : JSON.parse(JSON.stringify(lista[0]))};
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

   /*  SELECT 
	CONCAT(CU.Nombre,' ', CU.Apellidos) AS Nombre,
	CU.Foto_Perfil, CU.Correo, CU.IdUsuario, CP.Nombre AS Perfil, CU.IdStatus, (CASE WHEN CU.IdStatus = 1 THEN 'Activo' ELSE 'Inactivo' END) AS Status
	FROM CRM_Usuarios CU LEFT JOIN CRM_Perfiles CP ON CU.IdPerfil = CP.IdPerfil; */


  const lista = await config.query('SELECT CONCAT(CU.Nombre," ", CU.Apellidos) AS Nombre,CU.Foto_Perfil, CU.Correo, CU.IdUsuario, CP.Nombre AS Perfil, CU.IdStatus, (CASE WHEN CU.IdStatus = 1 THEN "Activo" ELSE "Inactivo" END) AS Status FROM userr CU LEFT JOIN perfiles CP ON CU.IdPerfil = CP.IdPerfil');
    if (lista) {
      if (lista.length > 0) {
          return {usuarios : JSON.parse(JSON.stringify(lista[0]))};
      } else {
          return { empty: true, message: "Error de credenciales" };
      }
  } else {
      return { error: true, message: "Error interno" };
  }




   /*  const connection = await new sql.ConnectionPool(config).connect();
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
    return lista; */
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
    
    const lista = await config.query('SELECT P.IdPerfil, P.Nombre, PM.IdPerfilMenu, PM.IdPerfil, PM.IdMenu, PM.Leer, PM.Editar, PM.Eliminar FROM perfiles AS P LEFT JOIN perfilMenus AS PM ON PM.IdPerfil = P.IdPerfil WHERE P.IdPerfil = ?',[id]);
    if (lista) {
      return { usuarios: JSON.parse(JSON.stringify(lista[0])) };
    } else {
      return { error: true, message: "Error interno" };
    }
    /* const connection = await new sql.ConnectionPool(config).connect();
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
    return lista;*/
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObetenerUsuarioPorId(data) {
  try {
    const lista = await config.query('SELECT Correo ,Nombre ,Apellidos,Telefono ,IdPerfil,IdStatus FROM userr where IdUsuario=?',[data.Id]);

    if (lista) {
      return { usuario: JSON.parse(JSON.stringify(lista[0]))};
    } else {
      return { error: true, message: "Error interno" };
    }

   /*  const connection = await new sql.ConnectionPool(config).connect();
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
    return lista; */
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function CrearUsuario(data, newpdw) {
  try {
    const persona = await config.query('INSERT INTO userr (Correo,Pwd,Nombre,Apellidos,Telefono,IdPerfil,usr_add,usr_del,IdStatus) VALUES (?, ?,?,?, ?,?, ?,?,?)',[data.Correo,newpdw,data.Nombre,data.Apellido,data.Telefono,data.TipoUsuario,data.usr_add,data.fecha,1]);
    
    if (persona) {
      return { insert: true, record: JSON.parse(JSON.stringify(persona[0])) };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }
    /* INSERT INTO CRM_USUARIOS(Correo,Pwd,Fch_Pwd,Nombre,Apellidos,Telefono,IdPerfil,usr_add,fch_add,IdSta VALUES (@Correo, @Pwd,@Fecha,@Nombre, @Apellido,@Telefono, @TipoUsuario,	@UsrAdd,@Fecha,	1); */

    
  /*   const connection = await new sql.ConnectionPool(config).connect();
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
    return persona; */
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

    const persona = await config.query('update userr set Nombre= ? ,Apellidos= ?,Correo= ?,Telefono= ?,IdPerfil= ?,usr_upd= ?,IdStatus= ? where IdUsuario= ?; ',[data.Nombre,data.Apellido,data.Correo,data.Telefono,data.TipoUsuario,data.fecha,data.Status,data.Id]);
    
    if (persona) {
      return { Update: true, record: {Updated: 1} };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }
    /* update CRM_Usuarios set Nombre=@Nombre ,Apellidos=@Apellido,Correo=@Correo,Telefono=@Telefono,IdPerfil=@TipoUsuario,fch_upd=@Fecha,usr_upd=@UsrAdd,IdStatus=@Statuswhere IdUsuario=@Id;select 1 as 'Updated'; */


 /*    const connection = await new sql.ConnectionPool(config).connect();
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
    return persona; */
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function ObetenerPerfilPorId(data) {
  try {
    
   const lista = await config.query('select Nombre,IdStatus from perfiles where IdPerfil= ?;',[data.Id]);
    if (lista) {
      return { usuarios: JSON.parse(JSON.stringify(lista[0][0])) };
    } else {
      return { error: true, message: "Error interno" };
    }

 /*    const connection = await new sql.ConnectionPool(config).connect();
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
    return lista; */
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarPerfil(data) {
  try {
    console.log(data)
    const persona = await config.query('update perfiles set Nombre= ? ,usr_upd= ?,IdStatus= ? where IdPerfil= ?; ',[data.Nombre,data.Usuario,data.IdStatus,data.Id]);
    
    if (persona) {
      return { Update: true, record: {Updated: 1} };
    } else {
      return {
        error: true,
        message: "Something went wrong",
      };
    }

   /*  const connection = await new sql.ConnectionPool(config).connect();
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
    return persona; */
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
    /* const connection = await new sql.ConnectionPool(config).connect();
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
    return lista; */
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function listarMenusId(data) {
  try {
    const lista = await config.query('SELECT P.IdPerfil, P.Nombre, PM.IdPerfilMenu, PM.IdPerfil, PM.IdMenu, PM.Leer, PM.Editar, PM.Eliminar FROM perfiles AS P LEFT JOIN perfilmenus AS PM ON PM.IdPerfil = P.IdPerfil WHERE P.IdPerfil = ?',[data.Id]);
    if (lista) {
      return { Menus: JSON.parse(JSON.stringify(lista[0])) };
    } else {
      return { error: true, message: "Error interno" };
    }

  /*   const connection = await new sql.ConnectionPool(config).connect();
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
    return lista; */
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function EditarPermisos(data) {
  try {
    const respuesta = await config.query('SELECT * FROM perfilmenus WHERE IdPerfil = ? and IdMenu = ?	',[data.IdPerfil,data.IdMenu]);

if( JSON.parse(JSON.stringify(respuesta[0]))){

  const recordset = await config.query('UPDATE perfilmenus SET Leer = ?, Editar = ?, Eliminar = ? WHERE IdPerfil = ? AND IdMenu = ?;',[data.Leer,data.Editar,data.Eliminar,data.IdPerfil,data.IdMenu]);
  if (recordset) {
    return { Updated: 1 };
  } else {
    return { error: true, message: "Error interno" };
  }
}else{
  const recordset = await config.query('INSERT INTO perfilmenus (IdPerfil, IdMenu, Leer, Editar,Eliminar) VALUES (?, ?,?, ?, ?);',[data.IdPerfil,data.IdMenu,data.Leer,data.Editar,data.Eliminar]);
  if (recordset) {
    return { Updated: 1 };
  } else {
    return { error: true, message: "Error interno" };
  }
}

   /*  const connection = await new sql.ConnectionPool(config).connect();
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
    return lista; */
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
