const config 	=	require('../config');
const sql		=	require('mssql');
const VoiceResponse = require('twilio/lib/twiml/VoiceResponse');
const { FunctionInstance } = require('twilio/lib/rest/serverless/v1/service/function');
const { TodayInstance } = require('twilio/lib/rest/api/v2010/account/usage/record/today');
const { Notificaciones } = require("../../validar");
const Dominio = "https://greenpark.mx/";

async function PromoNueva(data) {
    
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input("Nombre", sql.NVarChar(100), data.Nombre)
			.input("Arte", sql.NVarChar(100), data.Arte)
			.input("Inicio", sql.Date, data.Inicio)
            .input("Fin", sql.Date, data.Fin)
            .input("MNombre", sql.TinyInt, data.MNombre)
            .input("MVigencia", sql.TinyInt, data.MVigencia)
            .input("url", sql.NVarChar, data.urlw)
            .input("urlt", sql.NVarChar, data.urlt)
            .execute("FX_CrearPromo")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
					return { recordset }
                } else {
					return { error: true, message: 'No se creo la promo' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

async function ModificarPromo(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input("IdPromo", sql.Int, data.IdPromo)
            .input("Nombre", sql.NVarChar(100), data.Nombre)
			.input("Arte", sql.NVarChar(100), data.Arte)
			.input("Inicio", sql.Date, data.Inicio)
            .input("Fin", sql.Date, data.Fin)
            .input("Status", sql.TinyInt, data.IdStatus)
            .input("MNombre", sql.TinyInt, data.MNombre)
            .input("MVigencia", sql.TinyInt, data.MVigencia)
            .input("url", sql.NVarChar, data.urlw)
            .input("urlt", sql.NVarChar, data.urlt)
            .execute("FX_ActualizarPromo")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
					return { recordset }
                } else {
					return { error: true, message: 'No se actualizo la promo' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

async function getnotificaciones() {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .execute("PWA_ObtenerMensajes")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
					return recordset
                } else {
					return { error: true, message: 'No se encontraron mensajes' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}


async function Promos() {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .execute("FX_ListarPromos")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                if (recordset) {
					return { promos: recordset[0], webapp: recordset[1] }
                } else {
					return { error: true, message: 'No se encontraron promociones' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}
async function AvisosCorp(a) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input('id', sql.Int, a)
            .execute("WA_ObtenerAvisos")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    console.log(recordset)
					return recordset[0]
                } else {
					return { error: true, message: 'Error IdPersona ' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}
async function InsertarAvisoIdpersona(a) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input('id', sql.Int, a)
            .execute("WA_InsertarPersonaAviso")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    console.log(recordset)
					return recordset[0]
                } else {
					return { error: true, message: 'Error IdPersona ' };
				}
            });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

async function notificacionsend(data) {
	try {let URL;
        let link = data.link || null;
		const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('inversionista', sql.Int, data.inversionista  || 0)
            .input('whonotificacion', sql.Int, data.whoiam)
            .input('link', sql.NVarChar(250), data.link || ' ')
            .input('IdPersona', sql.NVarChar(50), data.IdPersona  || null)
            .input('texto', sql.Text, data.texto || null)
            .input('titulo', sql.NVarChar(100), data.titulo || null)
            .execute("PWA_SendNotificacion")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    let imagenes = [Dominio +'assets/img/Img-Notificaciones/'+data.name];
                    for(let i = 0; i < recordset.length ;i++){
                    a = JSON.parse(recordset[i].llave);
                    if(link == undefined || data.link == ' ' || data.link == null ||data.link == 'undefined' || data.link == 'null'){     
                        if(data.whoiam == 2){
                            if(data.recordatorio){
                                URL = Dominio+"asesores/app/inicio";
                            }else{      
                                URL = Dominio+"inversionistas/login";    
                            }
                        }else{
                            URL = Dominio+"asesores/app/inicio";
                        }
                    }else{
                         URL = data.link;
                    }
                    await Notificaciones(a,data.texto,data.titulo,URL,imagenes);      
                        }
                } else {
			}
        });
        connection.close();
        return user;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

async function notificacionimg(data) {
	try {
        if(data.img > 0){
		const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("img", sql.Int, data.img)
            .input("titulo", sql.NVarChar(75), data.titulo)
            .input("name", sql.NVarChar(75), data.name)
            .execute("PWA_Insertimg")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
				}
            });
        connection.close();
        return user;
        }else{
            const connection = await new sql.ConnectionPool(config).connect();
            const user = await connection
                .request()
                .input("img", sql.Int, data.img || null)
                .input("titulo", sql.NVarChar(75), data.titulo || null)
                .input("name", sql.NVarChar(75), data.name || null)
                .execute("PWA_Insertimg")
                .then(async(dbData) => {
                    const recordset = dbData.recordset;
                    if (recordset) {
                        return recordset;
                    } else {
                    }
                });
            connection.close();
            return user;
        }
	} catch(error) {
		throw { error: true, message: error.message };
	}
}

async function insertararray(data) {
	try {
        console.log(data)
		const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("id", sql.Int, data.id)
            .input("asesorarray", sql.Text, JSON.stringify(data.asesor))
            .execute("WA_NotificacionArrays")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
				}
            });
        connection.close();
        return user;
   
	} catch(error) {
		throw { error: true, message: error.message };
	}
}
async function notificacionwebapp(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input("id", sql.Int, data.id)
            .execute("WA_ObtenerLeidos")
            .then(async(dbData) => {
                const recordset = dbData.recordset;
                if (recordset) {
                    return recordset;
                } else {
				}
            });
        connection.close();
        return user;
   
	} catch(error) {
		throw { error: true, message: error.message };
	}
}
async function notificacionporhora() {
    try {
      const connection = await new sql.ConnectionPool(config).connect();
      const result = await connection
        .request()
        .execute("HR_NotificacionPorHora")
        .then((dbData) => {
          const recordset = dbData.recordset;
          if (recordset) {
           for(let i = 0 ; i < recordset.length ; i++) {
            let datedos = new Date(recordset[i].Fch_Hora);
            let dateactual = new Date();
            console.log(dateactual)
            if(datedos.setHours(datedos.getHours() + 6,datedos.getMinutes()-datedos.getMinutes(),datedos.getSeconds()-datedos.getSeconds(),datedos.getMilliseconds()-datedos.getMilliseconds())
             == dateactual.setHours(dateactual.getHours() - 5,dateactual.getMinutes()-dateactual.getMinutes(),dateactual.getSeconds()-dateactual.getSeconds(),dateactual.getMilliseconds()-dateactual.getMilliseconds())) {
                if(recordset[i].IdIL == null){
                 }else{
                    const StatusMensajeDos = 2;
                    const Mensaje = 'Tienes Hr pendientes para acomodar';
                    enviarnotificacionporseishora(recordset[i], StatusMensajeDos,Mensaje);
                 }

            }
            if(datedos.setHours(datedos.getHours() + 12,datedos.getMinutes()-datedos.getMinutes(),datedos.getSeconds()-datedos.getSeconds(),datedos.getMilliseconds()-datedos.getMilliseconds())
            == dateactual.setHours(dateactual.getHours() - 5,dateactual.getMinutes()-dateactual.getMinutes(),dateactual.getSeconds()-dateactual.getSeconds(),dateactual.getMilliseconds()-dateactual.getMilliseconds()))
             {
               if(recordset[i].IdIL == null){
                }else{
                    const StatusMensajeDos = 3;
                    const Mensaje = 'Hay HR que se necesita acomodar';
                    enviarnotificacionporseishora(recordset[i], StatusMensajeDos,Mensaje);
                }

           }
           if(datedos.setHours(datedos.getHours() + 24,datedos.getMinutes()-datedos.getMinutes(),datedos.getSeconds()-datedos.getSeconds(),datedos.getMilliseconds()-datedos.getMilliseconds())
           == dateactual.setHours(dateactual.getHours() - 5,dateactual.getMinutes()-dateactual.getMinutes(),dateactual.getSeconds()-dateactual.getSeconds(),dateactual.getMilliseconds()-dateactual.getMilliseconds()))
            {
              if(recordset[i].IdIL == null){

               }else{
                   const StatusMensajeDos = 4;
                   const Mensaje = 'El tiempo se acaba';
                   enviarnotificacionporseishora(recordset[i], StatusMensajeDos,Mensaje);
               }

          }else{
          }
           }  
            return 1;
          } else {
            return {
              error: true,
              message: "No se finalizo el proceso",
            };
          }
        });
      connection.close();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

 /*  async function enviarnotificacionporseishora(data, StatusMensajeDos,Mensaje) {
    try {
      console.log( data.IdHR,'entra primero')
      const connection = await new sql.ConnectionPool(config).connect();
      const result = await connection
        .request()
        .input("IdHr", sql.Int, data.IdHR )
        .input("IdTLider", sql.Int, data.IdIL )
        .input("StatusMensajeDos", sql.Int, StatusMensajeDos )
        .execute("HR_CambioStatusJuego")
        .then((dbData) => {
          const recordset = dbData.recordset;
          if (recordset) {
           
            for (let i = 0; i < recordset.length; i++) {
                let llave = JSON.parse(recordset[i].llave); 
                console.log(llave) ;
                let URL = Dominio+'asesores/app/juego';
                let imagenes = [Dominio + 'assets/img/Img-Notificaciones/Fibrax.jpg'];
                const webpush = require('web-push');
                const express = require('express');
                const cors = require('cors')
                const bodyParser = require('body-parser');
                const app = express();
                    app.use(cors())
                    app.use(bodyParser.json())
                const vapidKeys = {
                    "publicKey": "BBH4b0eYUzw_2QCJ1-1I_07bkn-RzdnZTxmbLvrgGeNLb0zdUdXkvdOv0P4zI6vSoZolcXUcteD23EqVyo0oSkE",
                    "privateKey": "7L0YtAi3I6BbtMpiBBcgpgXN8vds6vLXhbb_cWYQ_LE"
                }
                
                webpush.setVapidDetails(
                    'mailto:corportativo@Greenpark.mx',
                    vapidKeys.publicKey,
                    vapidKeys.privateKey
                );
                    const pushSubscription = {
                        endpoint:llave.endpoint,
                        keys: {
                            auth:llave.keys.auth,
                            p256dh:llave.keys.p256dh
                        }
                    };
                    const payload = {
                        "notification": {
                            "title": Mensaje,
          
                            "badge": "💵",
                            "icon": Dominio+"asesores/assets/Fibrax-app--logo1-modified.png",
                            "vibrate": [100, 50, 100],
                            "image": imagenes,
                            "actions": [   
                                {
                                "action": "bar",
                                "title": "Ir"
                                }
                            ],
                            "data": {
                                "onActionClick": {
                                "default": {
                                            "operation": "openWindow", 
                                            "url": URL
                                            },
                                "bar": {
                                    "operation": "navigateLastFocusedOrOpen",
                                    "url": URL
                                        }
                                }
                        }
                    }
                }
                    webpush.sendNotification(
                        pushSubscription,
                    JSON.stringify(payload))
                    .then(respuesta => {
                        console.log('Enviado !!');
                    }).catch(err => {
                            console.log('Error', err);
                    })  
                  }       
            return recordset[0];
          } else {
            return {
              error: true,
              message: "No se finalizo el proceso",
            };
          }
        });
      connection.close();
      return result;
    } catch (error) {
      return { error: true, message: error.message };
    }
  } */
  

async function notificacionagenda(data) {
	try {
		const connection = await new sql.ConnectionPool(config).connect();
        const complementos = await connection
            .request()
            .input('fecha', sql.NVarChar(250), data.año || null  )
            .input('name', sql.NVarChar(150), data.name  || 'Fibrax.jpg')
            .input('whonotificacion', sql.Int, data.whoiam || null)
            .input('link', sql.NVarChar(250), data.link || ' ')
            .input('IdPersona', sql.NVarChar(50), data.IdPersona  || null)
            .input('texto', sql.Text, data.texto || null)
            .input('titulo', sql.NVarChar(100), data.titulo || null)
            .execute("PWA_NotificacionAgendada")
            .then(async(dbData) => {
                const recordset = dbData.recordsets;
                
                if (recordset) {
            var cron = require('node-cron');
            console.log(recordset)
            cron.schedule('* * * * *', () => {
            for(let i=0 ; i < recordset[0].length;i++ ){
                let data = new Date();
                let date = [data.getDate() ,data.getMonth(),data.getFullYear(),data.getHours(),data.getMinutes(),data.getSeconds()]
                let dat =  JSON.parse(recordset[0][i].FechaAgenda)  

        if(recordset[0][i].status == 1){
            if (dat.year == date[2] && dat.month == date[1]+1 && dat.day == date[0] && dat.hora == date[3] && dat.minutos == date[4] && 0 == date[5] ){
                let URL;
                a = JSON.parse(recordset[0][i].llave);
                if(recordset[0][i].Link == undefined || recordset[0][i].Link == ' ' || recordset[0][i].Link == null ||recordset[0][i].Link == 'undefined' || recordset[0][i].Link == 'null'){     
                    if(recordset[0][i].identificacion == 2){
                        URL = Dominio + "inversionistas/crm";    
                    }else{
                        URL = Dominio + "asesores/app/inicio";
                    }
                }else{
                    URL = recordset[0][i].Link;
                }
                let imagenes = [Dominio+'assets/img/Img-Notificaciones/'+recordset[0][i].imagen];
                const webpush = require('web-push');
                const express = require('express');
                const cors = require('cors')
                const bodyParser = require('body-parser');
                const app = express();
                    app.use(cors())
                    app.use(bodyParser.json())
                const vapidKeys = {
                    "publicKey": "BBH4b0eYUzw_2QCJ1-1I_07bkn-RzdnZTxmbLvrgGeNLb0zdUdXkvdOv0P4zI6vSoZolcXUcteD23EqVyo0oSkE",
                    "privateKey": "7L0YtAi3I6BbtMpiBBcgpgXN8vds6vLXhbb_cWYQ_LE"
                }
                
                webpush.setVapidDetails(
                    'mailto:corportativo@greenpark.mx',
                    vapidKeys.publicKey,
                    vapidKeys.privateKey
                );
                    const pushSubscription = {
                        endpoint: a.endpoint,
                        keys: {
                            auth: a.keys.auth,
                            p256dh:a.keys.p256dh
                        }
                    };
                    const payload = {
                        "notification": {
                            "title": recordset[0][i].Titulo,
                            "body": recordset[0][i].Texto,
                            "badge": "💵",
                            "icon":  Dominio + "asesores/assets/Fibrax-app--logo1-modified.png",
                            "vibrate": [100, 50, 100],
                            "image": imagenes,
                            "actions": [   
                                {
                                "action": "bar",
                                "title": "Ir"
                                }
                            ],
                            "data": {
                                "onActionClick": {
                                "default": {
                                            "operation": "openWindow", 
                                            "url": URL
                                            },
                                "bar": {
                                    "operation": "navigateLastFocusedOrOpen",
                                    "url": URL
                                        }
                                }
                        }
                    }
                }
                    webpush.sendNotification(
                        pushSubscription,
                    JSON.stringify(payload))
                    .then(respuesta => {
                        console.log('Enviado !!');
                        Enviarstatus(recordset[0][i].IdNotificacionCRM);
                        
                    }).catch(err => {
                            console.log('Error', err);
                    })         
                }
            } 
        }
    });
                } else {
			}
        });
        connection.close();
        return complementos;
	} catch(error) {
		throw { error: true, message: error.message };
	}
}
async function Enviarstatus(data){
try{
    const connection = await new sql.ConnectionPool(config).connect();
    const user = await connection
        .request()
        .input('status', sql.Int, data)
        .execute("PWA_ModificarMensajes")
        .then(async(dbData) => {
        });
        }catch(error) {
            throw { error: true, message: error.message };
    }                  
}
async function eliminarmensaje(data){
    try{
        console.log(data.data)
        const connection = await new sql.ConnectionPool(config).connect();
        const user = await connection
            .request()
            .input('status', sql.Int, data.data)
            .execute("PWA_ModificarMensajes")
            .then(async(dbData) => {
            const recordset = dbData.recordsets;
            });
        }catch(error) {
            throw { error: true, message: error.message };
        }                  
    }

    
module.exports = {
PromoNueva,
ModificarPromo,
Promos,
notificacionsend,
notificacionimg,
notificacionagenda,
getnotificaciones,
Enviarstatus,
eliminarmensaje,
notificacionporhora,
/* enviarnotificacionporseishora, */
notificacionwebapp,
insertararray,
AvisosCorp,
InsertarAvisoIdpersona
}