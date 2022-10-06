const koaRouter = require("koa-router");
const koaBody = require("koa-body");
const router = new koaRouter({ prefix: "/gateway" });
const stripe = require('stripe')('sk_live_ot1fOTBLxPidbcQt1gM3RxuJ00fbawuD6b')
const db = require("../../database/stripe/");

router.post("/stripe", koaBody(), async function (context) {
    try {

        const fondos = {

            "0": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "1": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "2": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "3": "https://greenpark.mx/newDesign/assets/images/zazil.jpg",
            "4": "https://greenpark.mx/newDesign/assets/images/koomuna.jpg",
            "5": "https://greenpark.mx/newDesign/assets/images/via.jpg",
            "6": "https://greenpark.mx/newDesign/assets/images/horizontes-slider.jpg",
            "7": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "8": "https://greenpark.mx/newDesign/assets/images/slider.jpg",
            "9": "https://greenpark.mx/newDesign/assets/images/mantra-slider.jpg",
            "11": "https://greenpark.mx/newDesign/assets/images/Slider-Kunal.jpg"
        };

        const datos = context.request.body;
        console.log(datos);

        let backurl = datos.backurl !== undefined ? datos.backurl : 'https://greenpark.mx/central-de-pagos?stripe=success';
        let cancelurl = datos.cancelurl !== undefined ? datos.cancelurl : 'https://greenpark.mx/central-de-pagos';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    currency: 'mxn',
                    name: datos.Titulo,
                    images: [fondos[datos.Desarrollo] + ''],
                    quantity: 1,
                    amount: datos.Total,
                    description: datos.Descripcion//'https://greenpark.mx/dist/slider.c6e9fa13.jpg'
                },
            ],
            mode: 'payment',

            customer_email: datos.Email,
            success_url: backurl,
            cancel_url: cancelurl,
        });

        context.body = { url: session.url };
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/stripe_subscription", koaBody(), async function (context) {
    try {

        const fondos = {

            "0": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "1": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "2": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "3": "https://greenpark.mx/newDesign/assets/images/zazil.jpg",
            "4": "https://greenpark.mx/newDesign/assets/images/koomuna.jpg",
            "5": "https://greenpark.mx/newDesign/assets/images/via.jpg",
            "6": "https://greenpark.mx/newDesign/assets/images/horizontes-slider.jpg",
            "7": "https://greenpark.mx/dist/slider.c6e9fa13.jpg",
            "8": "https://greenpark.mx/newDesign/assets/images/slider.jpg",
            "9": "https://greenpark.mx/newDesign/assets/images/mantra-slider.jpg",
            "11": "https://greenpark.mx/newDesign/assets/images/Slider-Kunal.jpg"
        };

        const datos = context.request.body;

        let backurl = datos.backurl !== undefined ? datos.backurl : 'https://greenpark.mx/central-de-pagos';
        let cancelurl = datos.cancelurl !== undefined ? datos.cancelurl : 'https://greenpark.mx/central-de-pagos';

        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: datos.IdProducto,
                    quantity: datos.Cantidad,
                },
            ],
            customer_email: datos.Email,
            success_url: backurl,
            cancel_url: cancelurl,
        });

        context.body = session;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/stripe_cancel_sub", koaBody(), async function (context) {
    try {
        const datos = context.request.body;
        const res = await stripe.subscriptions.del(datos.sub_id);
        context.body = res;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

router.post("/stripe_webhook", koaBody(), async function (context) {

    const body = context.request.body;
    //console.log(body);
    try {

        // Handle the event
        switch (body.type) {
            case 'customer.subscription.created':
                const paymentIntent = body.data.object;
                
                let montomensual = (paymentIntent.plan.amount / 100) * paymentIntent.quantity;
                let montofinal = montomensual * 3;

                const res = await db.guardarSubscripcion({
                    MontoFinal: montofinal,
                    MontoMensual: montomensual,
                    IdSub: paymentIntent.id
                });
                break;
            default:
        }


        context.status = 200;
        context.body = { success: true };
    } catch (error) {
        context.status = 401;
        context.body = { error: true, message: error.message };
    }
});

router.get("/stripe_cancel_expired_sub", koaBody(), async function (context) {
    try {

        const res = await db.subsporvencer();

        if (res.error !== true) {
            console.log('entrando');
            res.forEach(async (elem) => {
                await stripe.subscriptions.del(elem.IdSub);
            });
        }

        context.status = 200;
        context.body = res;
    } catch (error) {
        context.body = { error: true, message: error.message };
    }
});

module.exports = router;
