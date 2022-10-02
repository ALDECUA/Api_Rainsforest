const config = require("../config");
const sql = require("mssql");

async function obtenerProductosActivos() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .execute("FC_ObtenerProductosActivosFx")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { productos: recordset[0], categorias: recordset[1] };
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerProducto(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prod = await connection
            .request()
            .input('IdProducto', sql.Int, id)
            .execute("FC_ObtenerProductoPorId")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0];
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prod;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerProductosCategoria(id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .input('Categoria', sql.Int, id)
            .execute("FC_ObtenerProductosPorCategoria")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0];
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function insertarProducto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .input("Nombre", sql.NVarChar(100), data.Nombre)
            .input("Precio", sql.Int, data.Precio)
            .input("Img", sql.NVarChar(255), data.Img)
            .input("Img2", sql.NVarChar(100), data.Img2)
            .input("Categoria", sql.Int, data.Categoria)
            .input("Multi", sql.Int, data.Multi)
            .input("Precio_A", sql.Int, data.Precio_A)
            .input("Precio_N", sql.Int, data.Precio_N)
            .input("Precio_Personalizado", sql.Int, data.Precio_Personalizado)
            .input("Precio_Ecoins", sql.Int, data.Precio_Ecoins)
            .input("Solo_ECoins", sql.Int, data.Solo_ECoins)
            .input("Usuario", sql.NVarChar(254), data.Usuario)
            .input("Descripcion", sql.NVarChar(255), data.Descripcion)
            .input("Nota", sql.NVarChar(255), data.Nota)
            .input("pdf", sql.NVarChar(255), data.pdf)
            .input("Slug", sql.NVarChar(200), data.Slug)
            .execute("FC_InsertFxcoinsProducto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset[0]) {
                    return { insert: true, record: recordset[0] };
                } else {
                    return {
                        error: true,
                        message: "No se creo el producto.",
                    };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function FC_ActualizarProductoFxCoin(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .input('IdProducto', sql.Int, data.IdProducto)
            .input('Nombre', sql.NVarChar(255), data.Nombre)
            .input('Precio', sql.Int, data.Precio)
            .input('Categoria', sql.Int, data.Categoria)
            .input('Status', sql.Int, data.Status)
            .input('Multi', sql.Int, data.Multi)
            .input('Precio_A', sql.Int, data.Precio_A)
            .input('Precio_N', sql.Int, data.Precio_N)
            .input('Slug', sql.NVarChar(200), data.Slug)
            .input('Nota', sql.NVarChar(255), data.Nota)
            .input('Img', sql.NVarChar(255), data.Img)
            .input('Descripcion', sql.Text, data.Descripcion)
            .execute("FC_ActualizarProductoFxCoin")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizó el producto.",
                    };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function FC_ObtenerProductosFx() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .execute("FC_ObtenerProductosFx")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { productos: recordset[0], categorias: recordset[1] };
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function FC_AsignarFxCoins(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .input('FxCoins', sql.Float, data.FxCoins)
            .input('ECoins', sql.Float, data.ECoins)
            .execute("FC_AgregarFxCoins")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return { Updated: true };
                } else {
                    return {
                        error: true,
                        message: "No se actualizaron Coins.",
                    };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function ValidarCodigo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .input('IdPersona', sql.Int, data.IdPersona)
            .input('Codigo', sql.NVarChar, data.Codigo)
            .input('DesarrolloPorValidar', sql.Int, 10)
            .execute("SP_VerificarCodigo")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset[0];
                } else {
                    return {
                        error: true,
                        message: "Error al validar el codigo.",
                    };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function CanjearCodigo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .input('Folio', sql.NVarChar, data.Folio)
            .input('Recompensa', sql.Int, data.Recompensa)
            .input('IdPersona', sql.Int, data.IdPersona)
            .input('Lote', sql.Int, data.Lote || null)
            .execute("CanjearCodigo")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "Error al canjear el código",
                    };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function StockCategorias() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .execute("FC_StockCategorias")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset;
                    } else {
                        return { empty: true, message: "No hay categorias" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function FC_Ranking() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .execute("FC_Ranking")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    return { Ranking: recordset }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function FC_Reporte() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const prods = await connection
            .request()
            .execute("FC_ReporteGlobal")
            .then(async(dbData) => {
                const recordsets = dbData.recordsets;
                if (recordsets) {
                    return { activos: recordsets[0], inactivos: recordsets[1], inversionistas: recordsets[2] }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return prods;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function ConvertirATexto(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const conv = await connection
            .request()
            .input('cantidad', sql.NVarChar, data.cantidad)
            .execute("FX_NumeroATexto")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
                    return {
                        error: true,
                        message: "No se pudo convertir",
                    };
                }
            });
        connection.close();
        return conv;

    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    obtenerProductosActivos,
    insertarProducto,
    obtenerProducto,
    obtenerProductosCategoria,
    FC_ObtenerProductosFx,
    FC_ActualizarProductoFxCoin,
    FC_AsignarFxCoins,
    StockCategorias,
    FC_Ranking,
    ValidarCodigo,
    CanjearCodigo,
    FC_Reporte,
    ConvertirATexto
};

//hjhj