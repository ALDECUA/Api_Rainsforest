const config = require("../config");
const sql = require("mssql");

async function nuevo_grupo(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("Nombre", sql.NVarChar(100), data.Nombre)
      .input("IdCreador", sql.Int, data.IdCreador)
      .input("Status", sql.Int, data.Status)
      .input("Descripcion", sql.NVarChar(sql.MAX), data.Descripcion || null)
      .input("Img", sql.NVarChar(150), data.Img)
      .input("Uri", sql.NVarChar(50), data.Uri || null)
      .input("Portada", sql.NVarChar(150), data.Portada)
      .input("TipoApp", sql.Int, data.TipoApp || 1)
      .input("Rango", sql.Int, data.Rango)
      .input("SCom", sql.Int, data.SCom)
      .input("ILider", sql.Int, data.ILider || null)
      .execute("FXG_NuevoGrupo")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        if (recordset) {
          return { inserted: 1 };
        } else {
          return {
            error: true,
            message: "No se pudo guardar la informacion del grupo",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function busqueda(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("IdNivel", sql.Int, data.IdNivel)
      .input("IdSCom", sql.Int, data.IdSCom || null)
      .input("IdLider", sql.Int, data.IdILider || null)
      .execute("FXG_Busqueda")
      .then((dbData) => {
        const recordset = dbData.recordset;
        if (recordset) {
          return { grupos: recordset };
        } else {
          return {
            error: true,
            message: "No se pudieron obtener los grupos",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function publicacion(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdPublicacion", sql.Int, data.IdPublicacion)
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("IdStatus", sql.Int, data.IdStatus)
      .input("IdGrupo", sql.Int, data.IdGrupo)
      .input("Titulo", sql.NVarChar(sql.MAX), data.Titulo)
      .input("Contenido", sql.NVarChar(sql.MAX), data.Contenido)
      .execute("FXG_Publicacion")
      .then((dbData) => {
      
        const recordset = dbData.recordset[0];
        if (recordset) {
          return { recordset};
        } else {
          return {
            error: true,
            message: "No se pudo guardar la informacion del grupo",
          };
        }
      });
    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function publicaciones(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdGrupo", sql.Int, data.IdGrupo)
      .input("IdPersona", sql.Int, data.IdPersona)
      .execute("FXG_ListarPublicaciones")
      .then((dbData) => {
        const recordset = dbData.recordsets;
        if (recordset) {
          return { 
            grupo: recordset[0],
            persona: recordset[1]
           };
        } else {
          return {
            error: true,
            message: "No se pudieron obtener los grupos",
          };
        }
      });

    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}
async function like(data) {
  try {
    const connection = await new sql.ConnectionPool(config).connect();
    const empresas = await connection
      .request()
      .input("IdPublicacion", sql.Int, data.IdPublicacion)
      .input("IdPersona", sql.Int, data.IdPersona)
      .input("likeStatus", sql.Int, data.likeStatus)
      .execute("FXG_ULike")
      .then((dbData) => {
        const recordset = dbData.recordset[0];
        if (recordset) {
          return { recordset};
        } else {
          return {
            error: true,
            message: "No se pudo guardar el like",
          };
        }
      });
    connection.close();
    return empresas;
  } catch (error) {
    return { error: true, message: error.message };
  }
}

module.exports = {
  nuevo_grupo,
  busqueda,
  publicacion,
  publicaciones,
  like
};
