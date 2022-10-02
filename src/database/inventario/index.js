const config = require("../config");
const sql = require("mssql");

async function GetAllInventario(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const inventario = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllInventario")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                const columns = Object.keys(recordset[0]);
                const id = recordset[0].Id.split(",");
                const newArray = recordset.map((objeto) => {
                    objeto.bodegas = [];
                    columns.map((column, index) => {
                        if (index > 6) {
                            objeto.bodegas.push({
                                idbodega: id[index - 7],
                                nombre: column,
                                valor: objeto[column]
                            })
                        }
                        return column
                    })
                    return {
                        idproducto: objeto.idproducto,
                        SKU: objeto.SKU,
                        Producto: objeto.Producto,
                        descripcion: objeto.Descripcion,
                        categoria: objeto.Categoria,
                        subcategoria: objeto.SubCategoria,
                        bodegas: objeto.bodegas
                    }
                })
                if (newArray) {
                    if (newArray.length > 0) {
                        return { inventario: newArray };
                    } else {
                        return { empty: true, message: "No hay inventario" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return inventario;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function GetDetalleInv(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const inventario = await connection
            .request()
            .input("p_IdProducto", sql.Int, data.IdProducto)
            .input("p_IdSucursal", sql.Int, data.IdBodega)
            .execute("sp_GetDetInventario")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { inventario: recordset };
                    } else {
                        return { empty: true, message: "No tiene movimientos" };
                    }
                } else {
                    return { error: true, message: "Error interno" };
                }
            });
        connection.close();
        return inventario;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    GetAllInventario,
    GetDetalleInv
}