const config = require("../config");
const sql = require("mssql");

async function obtenerPedidos() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedidos = await connection
            .request()
            .execute("FC_ListarPedidos")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { pedidos: recordset[0] };
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedidos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function obtenerPedidoById(Id) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedidos = await connection
            .request()
            .input("IdPedido", sql.Int, Id)
            .execute("FC_ObtenerPedidoById")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0][0];
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedidos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function topVentas() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const ventas = await connection
            .request()
            .execute("FC_ObtenerVentas")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { productos: recordset[0] };
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return ventas;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function getByStatus() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const ventas = await connection
            .request()
            .execute("FC_ObtenerVentasStatus")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset[0][0];
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return ventas;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function lastPedidos() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedidos = await connection
            .request()
            .execute("FC_ObtenerPedidosRecientes")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { pedidos: recordset[0] };
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedidos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function estadisticasCategoria() {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const data = await connection
            .request()
            .execute("FC_ObtenerVentasCategoria")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    if (recordset.length > 0) {
                        return recordset;
                    } else {
                        return { empty: true, message: "No hay productos" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return data;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function crearPedido(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedido = await connection
            .request()
            .input("IdProducto", sql.Int, data.IdProducto)
            .input("Precio_Final", sql.Float, data.Precio_Final || null)
            .input("IdPersona", sql.Int, data.IdPersona)
            .input("Moneda", sql.Int, data.Moneda || null)
            .input("IdCategoria", sql.Int, data.IdCategoria || null)
            .input("Adultos", sql.Int, data.Adultos || null)
            .input("Ninos", sql.Int, data.Ninos || null)
            .input("Nota", sql.VarChar, data.Nota || null)
            .input("IdDesarrollo", sql.VarChar(60), data.IdDesarrollo || null)
            .input("Etapa", sql.Int, data.Etapa || null)
            .input("Abono", sql.Float, data.Abono || null)
            .input("IdLote", sql.Int, data.IdLote || null)
            .input("Evento", sql.NVarChar, data.Evento || null)
            .input("Banco", sql.NVarChar, data.Banco || null)
            .input("Clabe", sql.NVarChar, data.Clabe || null)
            .input("Proveedor", sql.NVarChar, data.Proveedor || null)
            .input("RazonSocial", sql.NVarChar, data.RazonSocial || null)
            .input("FechaReq", sql.Date, data.FechaReq || null)
            .input("Cotizacion", sql.NVarChar, data.Cotizacion || null)
            .input("Monto", sql.Float, data.Monto || null)
            .execute("FC_CrearPedido")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    if (recordset.length > 0) {
                        return { datos: recordset[0], inserted: true };
                    } else {
                        return { empty: true, message: "No se creo el pedido" };
                    }
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedido;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function updateStatus(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedidos = await connection
            .request()
            .input("IdPedido", sql.Int, data.IdPedido)
            .input("IdStatus", sql.Int, data.IdStatus)
            .input("IdPersona", sql.Int, data.IdPersona)
            .input('Precio_Final', sql.Int, data.Precio_Final)
            .execute("FC_ActualizarEstatusPedido")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset[0]) {
                    return recordset[0][0];
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedidos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}
async function ObtenerPedidosPersona(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedidos = await connection
            .request()
            .input("IdPersona", sql.Int, data.IdPersona)
            .execute("FC_PedidosPersona")
            .then(async (dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
                    return { pedidos: recordset};
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedidos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

async function ObtenerPedidosParaRecibo(data) {
    try {
        const connection = await new sql.ConnectionPool(config).connect();
        const pedidos = await connection
            .request()
            .input("IdPersona", sql.Int, data.IdPersona)
            .input("IdPedido", sql.Int, data.IdPedido)
            .execute("FC_VerReciboPedido")
            .then(async (dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset[0];
                } else {
                    return { error: true, message: "Error Interno" };
                }
            });
        connection.close();
        return pedidos;
    } catch (error) {
        return { error: true, message: error.message };
    }
}

module.exports = {
    obtenerPedidos,
    topVentas,
    lastPedidos,
    getByStatus,
    estadisticasCategoria,
    obtenerPedidoById,
    crearPedido,
    updateStatus,
    ObtenerPedidosPersona,
    ObtenerPedidosParaRecibo
}