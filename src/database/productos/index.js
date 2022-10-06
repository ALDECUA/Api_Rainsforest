const config = require("../config");
const sql = require("mssql");
const { now } = require("moment-timezone");

async function AddProducto(data) {
    try {
        console.log(data);
        console.log(JSON.stringify(data.Detalle));
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("p_IdProducto", sql.Int, data.IdProducto)
            .input("p_SKU", sql.NVarChar(100), data.SKU)
            .input("p_Nombre", sql.NVarChar(100), data.Nombre)
            .input("p_Descripcion", sql.NVarChar(256), data.Descripcion)
            .input("p_Categoria", sql.NVarChar(100), data.Categoria)
            .input("p_SubCategoria", sql.NVarChar(100), data.SubCategoria)
            .input("p_Img1", sql.NVarChar(200), data.Img)
            .input("p_CodigoBarras", sql.NVarChar(50), data.CodigoBarras)
            .input("p_UsuarioUpd", sql.NVarChar(100), data.Usuario)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .input("P_Precio", sql.Decimal(18, 2), data.Precio)
            .input("p_Costo", sql.Decimal(18, 2), data.Costo)
            .input("p_Minimo", sql.Decimal(18, 2), data.Minimo)
            .input("p_IdUnidad", sql.Decimal(18, 2), data.IdUnidad)
            .input("p_SubProducto", sql.Bit, data.SubProducto)
            .input("p_Principal", sql.Bit, data.Principal)
            .input("p_Comentarios", sql.NVarChar(250), data.Comentarios)
            .input("p_Detalle", sql.NVarChar(250), JSON.stringify(data.Detalle))
            .execute("sp_AddProducto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 1) {
                        return { inserted: true, message: "Producto registrado" }
                    } else {
                        if (recordset[0].Valor == 2) {
                            return { updated: true, message: "Producto actualizado correctamente" };
                        } else {
                            if (recordset[0].Valor == 3) {
                                return { limite: true, message: "Llego al límite de productos permitidos en su paquete" };
                            } else {
                                return { error: true, message: "Ya existe el SKU del producto" };
                            }
                        }
                    }
                } else {
                    return { error: true, message: "Ya existe el SKU del producto" };
                }
            });
        connection.close();
        return user;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function GetProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_IdProducto", sql.Int, data.IdProducto)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_ProductoGet")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No existe el producto" };
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

async function CatalogoProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_Descripcion", sql.NVarChar(100), data.Descripcion)
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_CatalogoProducto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No existe el producto" };
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

async function GetAllProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllProducto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No hay producto dados de alta" };
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


async function GetProductos(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetProductosByEmpresa")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No hay productos dados de alta" };
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

async function DeleteProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const eddited = await connection
            .request()
            .input('p_IdProducto', sql.Int, data.IdProducto)
            .input('p_Usuario', sql.Int, data.Usuario)
            .execute('sp_DeleteProducto')
            .then((dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset[0].Valor == 1) {
                        return { delete: true}
                    } else if(recordset[0].Valor==2)
                    {
                        return { error: true, message: "El SubProducto esta siendo utilizado en un Producto. Favor de Verificar" };  
                    }
                    else{
                        return { error: true, message: "Imposible Eliminar: Verifique el stock del producto" };
                    }
                
                } else {
                    return { error: true, message: "Verifique el stock del producto" };
            } 

            });
        connection.close();
        return eddited;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function GetAllSubProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const producto = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetAllSubProducto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { producto: recordset };
                    } else {
                        return { empty: true, message: "No hay producto dados de alta" };
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

async function GetReportProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const inventario = await connection
            .request()
            .input("p_IdEmpresa", sql.Int, data.IdEmpresa)
            .execute("sp_GetReportProducto")
            .then(async(dbData) => {
                let recordset = dbData.recordset;
                recordset.map(rec => { 
                    rec.Detalle = JSON.parse(rec.Detalle);
                    rec.Detalle.map((dt,key) =>{
                        rec["Sub"+(1+key)] = dt.SKU;
                        rec["Cant"+(1+key)] = dt.Cantidad;
                    });
                 });
                 
                 recordset.forEach( obj => delete obj.Detalle);

                 return recordset;
            });
        connection.close();
        return inventario;
    } catch (error) {
        return { error: true, message: error.message };
    }
}


module.exports = {
    AddProducto,
    GetProducto,
    CatalogoProducto,
    GetAllProducto,
    GetProductos,
    DeleteProducto,
    GetAllSubProducto,
    GetReportProducto
}