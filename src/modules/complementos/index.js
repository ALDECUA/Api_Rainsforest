const koaRouter	=	require("koa-router");

const koaBody	=	require("koa-body");
const router	=	new koaRouter({ prefix: "/complementos" });
const db		=	require("../../database/complementos");

router.post("/obtener", koaBody(), async function(context) {
    try {

		const data = context.request.body;

        context.body = await db.getComplementos(data);

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/activar", koaBody(), async function(context) {
    try {

		const data = context.request.body;

		const { complemento, IdEmpresa, user } = data;

		context.body = await db.activarComplemento({IdPaquete: complemento.idPaquete, IdEmpresa, IdUsuario: user.IdUsuario});

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/cancelar", koaBody(), async function(context) {
    try {

		const data = context.request.body;

		const { IdComplemento, IdEmpresa, user } = data;

		context.body = await db.cancelarComplemento({IdComplemento, IdEmpresa, IdUsuario: user.IdUsuario});

    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;
