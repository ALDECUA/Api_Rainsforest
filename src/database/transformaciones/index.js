/**
 *  index.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO -
 *  @description: Funciones asyncronas para las peticiones a bases de datos /transformaciones
 */

const config = require("../config");
const sql = require("mssql");

async function sp_AddTransformacion(data) {
    try {
      
       
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdTransformacion", sql.Int, data.IdTransformacion)
            .input("p_IdBodega", sql.Int, data.IdBodega)
            .input("p_Lote", sql.NVarChar(50), data.Lote)
            .input("p_FechaInicial", sql.Date, data.FechaInicial)
            .input("p_FechaFinal", sql.Date, data.FechaFinal)
            .input("p_IdProducto", sql.Int, data.IdProducto)
            .input("p_CantidadEstimada", sql.Decimal(18,2),data.CantidadEstimada)
            .input("p_CantidadReal", sql.Decimal(18,2),data.CantidadReal)
            .input("p_IdEmpresa", sql.Int,data.IdEmpresa)
            .input("p_IdTipo", sql.Int,data.Tipo)
            .input("p_UsuarioUpd", sql.NVarChar(100),data.UsuarioUpd)
            .input("p_Comentarios", sql.NVarChar(200),data.Comentarios)
            .input("p_Empleado", sql.NVarChar(200),data.Empleado)
            .input("p_Turno", sql.NVarChar(200),data.Turno)
            .input("p_Estado", sql.Bit,data.Estado)
            .input("p_Detalle", sql.NVarChar(sql.MAX), JSON.stringify(data.Detalle))
            .input("p_CantidadPendiente", sql.Decimal(18,2),data.CantidadPendiente)
            .execute("sp_Addtransformaciones")
            .then(async(dbData) => {    
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 1) {
                        return { inserted: recordset, message: "Información guardada correctamente" }
                    } else {
                        if (recordset[0].Valor == 2) {
                            return { updated: recordset, message: "Información actualizada correctamente" };
                        } else {
                            return { error: true, message: "No se pudo procesar la información" };
                        }
                    }
                } else {
                    return { error: true, message: "No se pudo procesar la información" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetTransformacion(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const Transformacion = await connection
            .request()
            .input("p_IdTransformacion", sql.Int, data.IdTransformacion)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_TransformacionGet")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { Transformacion: recordset[0] };
                    } else {
                        return { empty: true, message: "No existe la información" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return Transformacion;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetCantEstimada(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const cantidad = await connection
            .request()
            .input("p_IdProducto", sql.Int, data.IdProducto)
            .input("p_IdBodega", sql.Int, data.IdBodega)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetCantidadTrasProducto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 0) {
                        return { error: true, message: "El producto no tiene información" }
                    } else {
                        if (recordset[0].Valor == 1) {
                            return { error: true, message: "El inventario no es suficiente" };
                        } else {
                            return {
                                cantidad: recordset,
                            };
                        }
                    }
                } else {
                    return { error: true, message: "Error" };
                }
            });
        connection.close();
        return cantidad;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function GetAllTransformaciones(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .input("p_IdTipo", sql.Int, data.Tipo)
            .execute("sp_GetAllTransformaciones")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No hay información" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return producto;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_GetProductosSub(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetSubProductos")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No hay productos finales con materia prima" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return producto;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function sp_TransformacionEstado(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const estado = await connection
            .request()
            .input("p_IdTransformacion", sql.Int, data.IdTransformacion)
            .input("p_Estado", sql.Int, data.Estado)
            .input("p_Usuario", sql.NVarChar, data.Usuario)
            .execute("sp_Transformación_Estado")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 1) {
                        return { updated: true, message: "Estado guardado correctamente" }
                    } else {
                        return { error: true, message: "Error" };
                    }
                } else {
                    return { error: true, message: "Error" };
                }
            });
        connection.close();
        return estado;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    sp_AddTransformacion,
    sp_GetCantEstimada,
    GetAllTransformaciones,
    sp_GetProductosSub,
    sp_GetTransformacion,
    sp_TransformacionEstado
}