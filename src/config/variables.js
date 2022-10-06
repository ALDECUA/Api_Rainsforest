/**
 *  variables.js
 *  @version: 1.0.0
 *  @author: DWIT MÉXICO - Mariano,  
 *  @description: Variables de entorno globales de la aplicación
 */


process.env.IDAPP = 'Cancun2019';

process.env.TZ = 'America/Cancun';

if (process.env.NODE_ENV === "production") {
    process.env.CRM = 'https://greenpark.mx/angularcrm/crm';
} else {
    process.env.CRM = 'https://greenpark.mx/angularcrm/crm';
}
