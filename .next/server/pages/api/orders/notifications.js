"use strict";(()=>{var e={};e.id=5124,e.ids=[5124],e.modules={1185:e=>{e.exports=require("mongoose")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5184:e=>{e.exports=require("nodemailer")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,r){return r in t?t[r]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,r)):"function"==typeof t&&"default"===r?t:void 0}}})},4605:(e,t,r)=>{r.r(t),r.d(t,{config:()=>g,default:()=>u,routeModule:()=>m});var i={};r.r(i),r.d(i,{default:()=>c});var n=r(1802),a=r(7153),s=r(6249),o=r(5130),d=r(7264),p=r(5184),l=r.n(p);async function c(e,t){if(await (0,o.Z)(),"POST"===e.method)try{console.log("\uD83D\uDCE7 Customer notifications gestart...");let{orderNumber:r,notificationType:i}=e.body;if(!r||!i)return t.status(400).json({success:!1,message:"Order nummer en notification type zijn verplicht"});let n=await d.Z.findOne({orderNumber:r}).populate("items.product");if(!n)return t.status(404).json({success:!1,message:"Order niet gevonden"});let a=l().createTransporter({host:process.env.SMTP_HOST,port:process.env.SMTP_PORT,secure:465==process.env.SMTP_PORT,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}),s="",o="";switch(i){case"order_confirmation":s=`Order Bevestiging - ${n.orderNumber}`,o=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Bevestiging</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .item { border-bottom: 1px solid #e5e7eb; padding: 10px 0; }
        .total { font-weight: bold; font-size: 18px; color: #2563eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Bedankt voor je bestelling!</h1>
          <p>Order: ${n.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${n.shippingAddress.firstName},</p>
          <p>Bedankt voor je bestelling bij PulseBuy! We hebben je bestelling ontvangen en gaan er direct mee aan de slag.</p>
          
          <div class="order-details">
            <h3>📦 Je bestelling:</h3>
            ${n.items.map(e=>`
              <div class="item">
                <strong>${e.product.name}</strong><br>
                Hoeveelheid: ${e.quantity}x<br>
                Prijs: €${e.price.toFixed(2)} per stuk<br>
                Totaal: €${e.total.toFixed(2)}
              </div>
            `).join("")}
            
            <div class="total">
              <p>Totaal: €${n.totals.total.toFixed(2)}</p>
            </div>
          </div>
          
          <h3>🚚 Verzending:</h3>
          <p><strong>Verzendadres:</strong><br>
          ${n.shippingAddress.firstName} ${n.shippingAddress.lastName}<br>
          ${n.shippingAddress.street}<br>
          ${n.shippingAddress.postalCode} ${n.shippingAddress.city}<br>
          ${n.shippingAddress.country}</p>
          
          <p><strong>Verwachte levering:</strong> ${new Date(n.shipping.estimatedDelivery).toLocaleDateString("nl-NL")}</p>
          
          <p>Je ontvangt een email zodra je bestelling is verzonden met tracking informatie.</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
          <p>Heb je vragen? Neem contact met ons op via support@pulsebuy.com</p>
        </div>
      </div>
    </body>
    </html>
  `;break;case"order_shipped":s=`Je bestelling is verzonden - ${n.orderNumber}`,o=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestelling Verzonden</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .tracking { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #059669; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚚 Je bestelling is onderweg!</h1>
          <p>Order: ${n.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${n.shippingAddress.firstName},</p>
          <p>Geweldig nieuws! Je bestelling is verzonden en is onderweg naar je toe.</p>
          
          <div class="tracking">
            <h3>📦 Tracking Informatie:</h3>
            <p class="tracking-number">${n.shipping.trackingNumber||"Wordt binnenkort beschikbaar"}</p>
            <p>Verwachte levering: ${new Date(n.shipping.estimatedDelivery).toLocaleDateString("nl-NL")}</p>
          </div>
          
          <p>Je kunt je bestelling volgen via de tracking code hierboven op de website van de vervoerder.</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
        </div>
      </div>
    </body>
    </html>
  `;break;case"order_delivered":s=`Je bestelling is bezorgd - ${n.orderNumber}`,o=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Bestelling Bezorgd</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Je bestelling is bezorgd!</h1>
          <p>Order: ${n.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${n.shippingAddress.firstName},</p>
          <p>Fantastisch! Je bestelling is succesvol bezorgd. We hopen dat je er veel plezier van hebt!</p>
          
          <p>Als je tevreden bent over je aankoop, zouden we het enorm waarderen als je een review achterlaat. Dit helpt andere klanten bij het maken van hun keuze.</p>
          
          <p>Heb je vragen over je bestelling of ben je niet tevreden? Neem gerust contact met ons op.</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
        </div>
      </div>
    </body>
    </html>
  `;break;case"tracking_update":s=`Tracking Update - ${n.orderNumber}`,o=`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Tracking Update</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📊 Tracking Update</h1>
          <p>Order: ${n.orderNumber}</p>
        </div>
        
        <div class="content">
          <p>Hallo ${n.shippingAddress.firstName},</p>
          <p>Er is een update voor je bestelling beschikbaar.</p>
          
          <p><strong>Huidige status:</strong> ${n.status}</p>
          <p><strong>Tracking nummer:</strong> ${n.shipping.trackingNumber||"Nog niet beschikbaar"}</p>
        </div>
        
        <div class="footer">
          <p>Met vriendelijke groet,<br>Het PulseBuy team</p>
        </div>
      </div>
    </body>
    </html>
  `;break;default:return t.status(400).json({success:!1,message:"Ongeldige notification type"})}let p={from:`"PulseBuy" <${process.env.SMTP_USER}>`,to:n.email,subject:s,html:o};await a.sendMail(p),n.trackingEvents.push({status:"notification_sent",message:`${i} email verzonden naar ${n.email}`,timestamp:new Date}),await n.save(),console.log(`✅ ${i} email verzonden naar ${n.email}`),t.status(200).json({success:!0,message:"Notification succesvol verzonden",data:{orderNumber:n.orderNumber,email:n.email,notificationType:i,sentAt:new Date}})}catch(e){console.error("❌ Customer notification gefaald:",e),t.status(500).json({success:!1,message:"Customer notification gefaald",error:e.message})}else t.setHeader("Allow",["POST"]),t.status(405).json({success:!1,message:`Method ${e.method} not allowed`})}let u=(0,s.l)(i,"default"),g=(0,s.l)(i,"config"),m=new n.PagesAPIRouteModule({definition:{kind:a.x.PAGES_API,page:"/api/orders/notifications",pathname:"/api/orders/notifications",bundlePath:"",filename:""},userland:i})},5130:(e,t,r)=>{r.d(t,{Z:()=>d});var i=r(1185),n=r.n(i);let a="mongodb://localhost:27017/dropshipmotion";if(!a)throw Error("Please define the MONGODB_URI environment variable inside .env.local");let s=global.mongoose;async function o(){if(s.conn)return s.conn;s.promise||(s.promise=n().connect(a,{bufferCommands:!1,retryWrites:!0}).then(e=>(console.log("Connected to MongoDB"),e)));try{s.conn=await s.promise}catch(e){throw s.promise=null,e}return s.conn}s||(s=global.mongoose={conn:null,promise:null});let d=o},7264:(e,t,r)=>{r.d(t,{Z:()=>s});var i=r(1185),n=r.n(i);let a=new(n()).Schema({orderNumber:{type:String,required:!0,unique:!0},user:{type:n().Schema.Types.ObjectId,ref:"User",required:!1},items:[{product:{type:n().Schema.Types.ObjectId,ref:"Product",required:!0},quantity:{type:Number,required:!0,min:1},price:{type:Number,required:!0},total:{type:Number,required:!0}}],shippingAddress:{firstName:{type:String,required:!0},lastName:{type:String,required:!0},street:{type:String,required:!0},city:{type:String,required:!0},postalCode:{type:String,required:!0},country:{type:String,required:!0},phone:String},billingAddress:{firstName:{type:String,required:!0},lastName:{type:String,required:!0},street:{type:String,required:!0},city:{type:String,required:!0},postalCode:{type:String,required:!0},country:{type:String,required:!0}},payment:{method:{type:String,enum:["stripe","ideal","paypal","card"],required:!0},status:{type:String,enum:["pending","paid","failed","refunded"],default:"pending"},transactionId:String,amount:{type:Number,required:!0}},status:{type:String,enum:["pending","paid","confirmed","processing","shipped","delivered","cancelled"],default:"pending"},shipping:{method:{type:String,required:!0},cost:{type:Number,required:!0},trackingNumber:String,estimatedDelivery:Date,actualDelivery:Date},totals:{subtotal:{type:Number,required:!0},shipping:{type:Number,required:!0},tax:{type:Number,required:!0},total:{type:Number,required:!0}},notes:String,dropshipStatus:{type:String,enum:["pending","forwarded","shipped","completed","failed"],default:"pending"},dropshipInstructions:String,dropshipCost:Number,profit:Number,profitMargin:Number,trackingEvents:[{status:String,message:String,timestamp:{type:Date,default:Date.now}}]},{timestamps:!0});a.pre("save",async function(e){if(!this.orderNumber){let e=await n().model("Order").countDocuments();this.orderNumber=`ORD-${Date.now()}-${String(e+1).padStart(4,"0")}`}e()}),a.methods.updateStatus=function(e,t){return this.status=e,this.trackingEvents.push({status:e,message:t||`Status gewijzigd naar ${e}`,timestamp:new Date}),this.save()},a.virtual("totalItems").get(function(){return this.items.reduce((e,t)=>e+t.quantity,0)});let s=n().models.Order||n().model("Order",a)},7153:(e,t)=>{var r;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return r}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(r||(r={}))},1802:(e,t,r)=>{e.exports=r(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var r=t(t.s=4605);module.exports=r})();