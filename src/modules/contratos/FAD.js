//
const koaBody = require("koa-body");
const db = require("../../database/contratos/FAD");
const db2 = require("../../database/contratos");
const Request = require('superagent');
const moment = require('moment-timezone');
const fs = require('fs');
const crypto = require("crypto");
const Dominio = "https://greenpark.mx/";

const desarrollosGeneradores = {
    8:'generar_mantra.php',
    10:'generar_villamar.php',
    11:'generar.php',
};

async function generateAuthToken() {
	const username = 'agarcia@fibrax.mx';
	const password = '25257870c993dedb6126fc535fb548caf83404ca0817ff94d0053fa8f3fba25a';
	const result = await Request
		.post(`https://api.firmaautografa.com/authorization-server/oauth/token?grant_type=password&username=${username}&password=${password}`)
		.set('Authorization', 'Basic ZmFkOmZhZHNlY3JldA==')
		.set('Content-type', 'application/x-www-form-urlencoded')
		.then(res => {
			return res.body;
		}).catch(err => {
			return { error: true, message: err.message };
		});
	return result;
}

async function crearRequisicion(xml, pdf, logo, idHR) {
	const token = await db.getToken();

	let sha256 = crypto.createHash('sha256').update(pdf).digest('hex');

	const result = await Request
		.post(`https://api.firmaautografa.com/requisitions/createRequisicionB2C`)
		.set('Authorization', `Bearer ${token}`)
		.set('Content-type', 'application/x-www-form-urlencoded')
		.field('xml', xml)
		.field('pdf', pdf)
		.field('hash', sha256)
		.then(res => {
			console.log(res);
			return res.body;
		}).catch(err => {
			console.log(err);
			return { error: true, message: err.message };
		});
	console.log(result);
	return result;
}

async function obtenerInformacion(id) {
	const token = await db.getToken();
	const result = await Request
		.get(`https://api.firmaautografa.com/requisitions/info/${id}`)
		.set('Authorization', `Bearer ${token}`)
		.then(res => {
			return res.body;
		}).catch(err => {
			console.log(err);
			return { error: true, message: err.message };
		});
	return result;
}

async function requisitionKeys(id) {
	const token = await db.getToken();

	const result = await Request
		.get(`https://api.firmaautografa.com/versioning/getRequisitionKeys/${id}`)
		.set('Authorization', `Bearer ${token}`)
		.then(res => {
			return res.body;
		}).catch(err => {
			console.log(err);
			return { error: true, message: err.message };
		});
	return result;
}

async function getContratoFirmado(id) {
	const token = await db.getToken();

	const result = await Request
		.get(`https://api.firmaautografa.com/clients/requisitions/documentsByIdRequisition/${id}`)
		.set('Authorization', `Bearer ${token}`)
		.then(res => {
			return res.body;
		}).catch(err => {
			console.log(err);
			return { error: true, message: err.message };
		});
	return result;
}

async function contratosFAD(router) {
	router.get("/fad/token/obtener", koaBody(), async function (context) {
		try {
			const result = await generateAuthToken();

			if (result.access_token) {
				result.fecha = moment().format('YYYY-MM-DD HH:mm:ss')
				context.body = await db.setTokenFAD(result);
			}
		} catch (error) {
			context.body = { error: true, message: error.message };
		}
	});

	router.post("/fad/requisicion/crear/:idHR", koaBody(), async function (context) {
		try {
			let data = context.request.body;
			let XML = fs.readFileSync(__dirname + '/requisition.xml', 'utf-8');
			let info = await db2.obtenerDocumentoDigital(context.params.idHR);
			if(info.error === 1) {
				context.status = 401;
				context.body = {error:true, message: info.message};
				return;
			}
			//console.log(info);

			let ContentPDF = { documento: info.documento }

			// Reemplazar contenido de XML con info de base de datos
			XML = XML.replace(new RegExp('@NOMBRECLIENTE', 'g'), info.nomCliente);
			XML = XML.replace(new RegExp('@EMAILCLIENTE', 'g'), info.emailCliente);
			XML = XML.replace(new RegExp('@TELCLIENTE', 'g'), info.telCliente);
			XML = XML.replace(new RegExp('@NOMBREDOCUMENTO', 'g'), info.nombreDocumento);
			XML = XML.replace(new RegExp('@DESARROLLO', 'g'), info.nombreDesarrollo);
			XML = XML.replace(new RegExp('@FECHA', 'g'), moment().format('DD/MM/YYYY'));

			//console.log(XML);
			let PDF = await Request.post(Dominio+'pruebas_dwit/tcpdf/'+desarrollosGeneradores[info.IdDesarrollo])
				.set('Content-type', 'application/json')
				.set('Accept', 'application/json')
				.send(ContentPDF)
				.buffer(true)
				.then(res => {
					return res.body;
				}).catch(error => {
					context.body = {error:true, message:'Error al generar el documento'};
				});

			if (PDF) {
				console.log(PDF);
				//PDF = Buffer.from(PDF).toString('base64');
				const requisicion = await crearRequisicion(XML, PDF, null, context.params.idHR);

				console.log(requisicion);
				if (requisicion.error) {
					throw { error: true, message: requisicion.message };
				} else if (requisicion.data) {

					data.idHR = context.params.idHR;
					data.IdContratoDesarrollo = info.IdContratoDesarrollo;
					
					const result = await db.guardarRequisicion(requisicion.data, data);
				
					context.body = result;
				}
			} else {
				throw { error: true, message: 'No se pudo obtener formato de documento' }
			}
		} catch (error) {
			//console.log(error);
			context.body = { error: true, message: error.message };
		}
	});

	router.get("/fad/requisicion/status/:id", koaBody(), async function (context) {
		try {
			context.body = await obtenerInformacion(context.params.id);
		} catch (error) {
			context.body = { error: true, message: error.message };
		}
	});

	router.get("/fad/requisicion/keys/:id", koaBody(), async function (context) {
		try {
			context.body = await requisitionKeys(context.params.id)
		} catch (error) {
			context.body = { error: true, message: error.message };
		}
	});

	router.get("/fad/requisicion/firmado/:id", koaBody(), async function (context) {
		try {
			context.body = await getContratoFirmado(context.params.id)
		} catch (error) {
			context.body = { error: true, message: error.message };
		}
	});

	router.get("/fad/pendientes/verificar", koaBody(), async function (context) {
		try {
			const result = await generateAuthToken();

			if (result.access_token) {
				result.fecha = moment().format('YYYY-MM-DD HH:mm:ss')
				await db.setTokenFAD(result);
			}

			const contratos = await db2.obtenerContratosPendientes();
			let results = null;
			if (contratos.error !== true) {

				if (contratos.length > 0) {

					for (let i = 0; i < contratos.length; i++) {
						results = await obtenerInformacion(contratos[i].RequisitionId);

						if (results.success === true) {

							console.log(results.data);
							if (results.data.status === 'SIGNED') {
								await db2.setContratoFirmado({ id: contratos[i].RequisitionId });
							}
						} else {
							context.body = { error: true, message: 'La API del FAD esta teniendo problemas' }
						}

					}

					context.body = { message: 'Verificacion completada' };

				} else {
					context.body = { message: 'Nada por verificar' };
				}

			} else {
				context.body = { error: true };
			}

		} catch (error) {
			context.body = { error: true, message: error.message };
		}
	});

}

module.exports = contratosFAD;