const config = require("../config");
const sql = require("mssql");

async function insertarReferidos(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const regimen = await connection
            .request()
            .input("Nombre_completo", sql.NVarChar(100), data.nombrecompleto)
            .input("IdDesarrollo", sql.Int, data.desarrollo)
            .input("Etapa", sql.NVarChar(100), data.etapa)
            .input("Lote", sql.NVarChar(100), data.lote)
            .input("IdSC", sql.Int, data.scom)
            .input("Array_Referidos", sql.Text, data.referidos)
            .input("Asesor", sql.NVarChar(100), data.asesor)
            .input("Notas", sql.NVarChar(100), data.notas)
            .execute("SP_InsertarReferidos")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0];
                    } else {
                        return { empty: true, message: "Error al insertar" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return regimen;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtnerReferidosAsesor(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const regimen = await connection
            .request()
            .input("IdPersona", sql.Int, data)
            .execute("SP_ReferidosPorAsesor")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset;
                    } else {
                        return { empty: true, message: "error al obtener datos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return regimen;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function referidopromotores(data) {
    try {
       
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("Idreferido", sql.Int, data.Form.IdReferido || null)
            .input("IdAsesor1", sql.Int, data.Form.IdPersona )
            .input("Nombre", sql.NVarChar(500), data.Form.Nombre)
            .input("Nombre_S", sql.NVarChar(50), data.Form.SegundoNombre|| '' )
            .input("Apellido_P", sql.NVarChar(50), data.Form.Apellido_P)
            .input("Apellido_M", sql.NVarChar(50), data.Form.Apellido_M || '' )
            .input("Num_Tel", sql.NVarChar(25), data.Form.Celular)
            .input("Email", sql.NVarChar(255), data.Form.Email)
            .input("Contactos", sql.NVarChar, data.Form.Contactos)
            .input("IdAsesor2", sql.Int, data.Form.IdAsesor2)
            .input("Comentario", sql.Text, data.Form.Comentario)
            .execute("WA_InsertarReferido")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset[0];
                } else {
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
 async function obtenerReferido(data) {
     try{
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("IdPersona", sql.Int, data)
            .execute("WA_ObtenerReferidos")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    return {
                        pendientes: recordset[0],
                        interesandont: recordset[1],
                        referidos: recordset[2],
                        referidoszap: recordset[3]
                    };
                        
                } else {
                }
            });
        connection.close();
        return user;
     }catch{
        return { error: true, message: error.message };
     }
     
 }
 async function ActualizarReferido(data) {
    try{
    
       const connection = await new sql.ConnectionPool(config).connect();
       const user = await connection
           .request()
           .input("idreferido", sql.Int, data.idreferido || null)
           .input("Estatus", sql.Int, data.estatus || null)
           .input("IdPersona", sql.Int, data.persona)
           .execute("WA_ActualizarReferido")
           .then(async (dbData) => {
               const recordset = dbData.recordset;
               if (recordset) {
                   return recordset;
                       
               } else {
               }
           });
       connection.close();
       return user;
    }catch{
       return { error: true, message: error.message };
    }
    
}

 async function referidobyId(IdReferido) {
    try{
       const connection = await new sql.ConnectionPool(config).connect();
       const user = await connection
           .request()
           .input("IdReferido", sql.Int, IdReferido)
           .execute("WA_InfoReferido")
           .then(async (dbData) => {
               const recordset = dbData.recordset[0];
               if (recordset) {
                   return recordset;  
               } else {
               }
           });
       connection.close();
       return user;
    }catch{
       return { error: true, message: error.message };
    }
    
}

module.exports = {
    insertarReferidos,
    obtnerReferidosAsesor,
    referidopromotores,
    obtenerReferido,
    ActualizarReferido,
    referidobyId

};

