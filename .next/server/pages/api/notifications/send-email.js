"use strict";(()=>{var e={};e.id=7833,e.ids=[7833,2206],e.modules={1185:e=>{e.exports=require("mongoose")},145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},5184:e=>{e.exports=require("nodemailer")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,i){return i in t?t[i]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,i)):"function"==typeof t&&"default"===i?t:void 0}}})},3110:(e,t,i)=>{i.r(t),i.d(t,{config:()=>g,default:()=>m,routeModule:()=>h});var r={};i.r(r),i.d(r,{default:()=>c});var n=i(1802),s=i(7153),a=i(6249),o=i(5130),d=i(7264),l=i(6955),p=i(2206),u=i(327);async function c(e,t){if(await (0,o.Z)(),"POST"===e.method)try{let i;let r=e.headers.authorization;if(!r||!r.startsWith("Bearer "))return t.status(401).json({success:!1,message:"Geen geldige autorisatie token"});let n=r.substring(7),s=(0,u.WX)(n);if(!s)return t.status(401).json({success:!1,message:"Ongeldige of verlopen token"});let a=await l.Z.findById(s.userId);if(!a||"admin"!==a.role)return t.status(403).json({success:!1,message:"Geen admin rechten"});let{orderId:o,type:c}=e.body;if(!o||!c)return t.status(400).json({success:!1,message:"Order ID en type zijn verplicht"});let m=await d.Z.findById(o).populate("user","firstName lastName email").populate("items.product","name images price");if(!m)return t.status(404).json({success:!1,message:"Bestelling niet gevonden"});let g={_id:m._id,orderNumber:m.orderNumber,customerName:`${m.user.firstName} ${m.user.lastName}`,customerEmail:m.user.email,items:m.items.map(e=>({product:{name:e.product.name},quantity:e.quantity,total:e.total})),totals:m.totals,status:m.status,shipping:m.shipping,createdAt:m.createdAt};switch(c){case"confirmation":i=await p.yo.sendOrderConfirmation(g);break;case"shipped":i=await p.yo.sendOrderShipped(g);break;case"delivered":i=await p.yo.sendOrderDelivered(g);break;default:return t.status(400).json({success:!1,message:"Ongeldig email type"})}i.success?t.status(200).json({success:!0,message:"Email succesvol verzonden",messageId:i.messageId}):t.status(500).json({success:!1,message:"Fout bij verzenden email",error:i.error})}catch(e){console.error("Error sending email notification:",e),t.status(500).json({success:!1,message:"Er is een fout opgetreden bij het verzenden van de email"})}else t.setHeader("Allow",["POST"]),t.status(405).json({success:!1,message:`Method ${e.method} not allowed`})}let m=(0,a.l)(r,"default"),g=(0,a.l)(r,"config"),h=new n.PagesAPIRouteModule({definition:{kind:s.x.PAGES_API,page:"/api/notifications/send-email",pathname:"/api/notifications/send-email",bundlePath:"",filename:""},userland:r})},2206:(e,t,i)=>{i.d(t,{yo:()=>o});var r=i(5184),n=i.n(r);let s=()=>n().createTransporter({host:process.env.SMTP_HOST||"smtp.gmail.com",port:parseInt(process.env.SMTP_PORT||"587"),secure:!1,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASS}}),a={orderConfirmation:e=>({subject:`Bestelling Bevestiging - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestelling Bevestiging</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .product-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .total { font-weight: bold; font-size: 18px; color: #667eea; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Bestelling Bevestigd!</h1>
            <p>Bedankt voor je bestelling bij PulseBuy</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.customerName},</h2>
            <p>Je bestelling is succesvol ontvangen en wordt zo snel mogelijk verwerkt.</p>
            
            <div class="order-details">
              <h3>Bestelling Details</h3>
              <p><strong>Bestelnummer:</strong> ${e.orderNumber}</p>
              <p><strong>Datum:</strong> ${new Date(e.createdAt).toLocaleDateString("nl-NL")}</p>
              <p><strong>Status:</strong> ${e.status}</p>
              
              <h4>Producten:</h4>
              ${e.items.map(e=>`
                <div class="product-item">
                  <span>${e.product.name} (${e.quantity}x)</span>
                  <span>€${e.total.toFixed(2)}</span>
                </div>
              `).join("")}
              
              <div class="product-item total">
                <span>Totaal:</span>
                <span>€${e.totals.total.toFixed(2)}</span>
              </div>
            </div>
            
            <p>Je kunt je bestelling volgen via: <a href="http://localhost:3000/orders/${e._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `}),orderShipped:e=>({subject:`Je bestelling is verzonden! - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestelling Verzonden</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .tracking { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .tracking-number { font-size: 24px; font-weight: bold; color: #4CAF50; margin: 10px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚚 Je bestelling is onderweg!</h1>
            <p>Bestelling ${e.orderNumber} is verzonden</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.customerName},</h2>
            <p>Geweldig nieuws! Je bestelling is verzonden en komt binnenkort aan.</p>
            
            <div class="tracking">
              <h3>Tracking Informatie</h3>
              <p><strong>Verzendmethode:</strong> ${e.shipping.method}</p>
              ${e.shipping.trackingNumber?`
                <p><strong>Tracking nummer:</strong></p>
                <div class="tracking-number">${e.shipping.trackingNumber}</div>
              `:""}
              ${e.shipping.estimatedDelivery?`
                <p><strong>Geschatte levering:</strong> ${new Date(e.shipping.estimatedDelivery).toLocaleDateString("nl-NL")}</p>
              `:""}
            </div>
            
            <p>Je kunt je bestelling volgen via: <a href="http://localhost:3000/orders/${e._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `}),orderDelivered:e=>({subject:`Je bestelling is bezorgd! - ${e.orderNumber}`,html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bestelling Bezorgd</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF6B6B 0%, #ee5a52 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .review-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Bestelling Bezorgd!</h1>
            <p>Je bestelling ${e.orderNumber} is succesvol bezorgd</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.customerName},</h2>
            <p>Fantastisch! Je bestelling is succesvol bezorgd. We hopen dat je tevreden bent met je aankoop.</p>
            
            <div class="review-section">
              <h3>💬 Laat een review achter</h3>
              <p>Help andere klanten door een review achter te laten voor je producten.</p>
              <a href="http://localhost:3000/orders/${e._id}" style="background: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">
                Review Schrijven
              </a>
            </div>
            
            <p>Bekijk je bestelling: <a href="http://localhost:3000/orders/${e._id}">Bekijk bestelling</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `}),welcomeEmail:e=>({subject:"Welkom bij PulseBuy! \uD83C\uDF89",html:`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welkom bij PulseBuy</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .welcome-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welkom bij PulseBuy!</h1>
            <p>De beste tech en lifestyle producten</p>
          </div>
          <div class="content">
            <h2>Hallo ${e.firstName},</h2>
            <p>Welkom bij PulseBuy! We zijn blij dat je je bij ons hebt aangesloten.</p>
            
            <div class="welcome-section">
              <h3>🚀 Wat kun je verwachten?</h3>
              <ul style="text-align: left; display: inline-block;">
                <li>De nieuwste tech en lifestyle producten</li>
                <li>Snelle en gratis verzending</li>
                <li>Uitstekende klantenservice</li>
                <li>Exclusieve deals en aanbiedingen</li>
              </ul>
            </div>
            
            <p>Begin met winkelen: <a href="http://localhost:3000/products">Bekijk onze producten</a></p>
            
            <div class="footer">
              <p>Met vriendelijke groet,<br>Het PulseBuy Team</p>
              <p>Voor vragen kun je contact opnemen via: support@pulsebuy.nl</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `})},o={async sendEmail(e,t,i){try{let r=s(),n={from:`"PulseBuy" <${process.env.SMTP_USER}>`,to:e,subject:t,html:i},a=await r.sendMail(n);return console.log("Email sent successfully:",a.messageId),{success:!0,messageId:a.messageId}}catch(e){return console.error("Error sending email:",e),{success:!1,error:e.message}}},async sendOrderConfirmation(e){let t=a.orderConfirmation(e);return await this.sendEmail(e.customerEmail,t.subject,t.html)},async sendOrderShipped(e){let t=a.orderShipped(e);return await this.sendEmail(e.customerEmail,t.subject,t.html)},async sendOrderDelivered(e){let t=a.orderDelivered(e);return await this.sendEmail(e.customerEmail,t.subject,t.html)},async sendWelcomeEmail(e){let t=a.welcomeEmail(e);return await this.sendEmail(e.email,t.subject,t.html)}}},327:(e,t,i)=>{i.d(t,{WX:()=>s});let r=require("jsonwebtoken");var n=i.n(r);function s(e){try{return n().verify(e,"your-super-secret-jwt-key-here")}catch(e){return null}}},5130:(e,t,i)=>{i.d(t,{Z:()=>d});var r=i(1185),n=i.n(r);let s="mongodb://localhost:27017/dropshipmotion";if(!s)throw Error("Please define the MONGODB_URI environment variable inside .env.local");let a=global.mongoose;async function o(){if(a.conn)return a.conn;a.promise||(a.promise=n().connect(s,{bufferCommands:!1,retryWrites:!0}).then(e=>(console.log("Connected to MongoDB"),e)));try{a.conn=await a.promise}catch(e){throw a.promise=null,e}return a.conn}a||(a=global.mongoose={conn:null,promise:null});let d=o},7264:(e,t,i)=>{i.d(t,{Z:()=>a});var r=i(1185),n=i.n(r);let s=new(n()).Schema({orderNumber:{type:String,required:!0,unique:!0},user:{type:n().Schema.Types.ObjectId,ref:"User",required:!1},items:[{product:{type:n().Schema.Types.ObjectId,ref:"Product",required:!0},quantity:{type:Number,required:!0,min:1},price:{type:Number,required:!0},total:{type:Number,required:!0}}],shippingAddress:{firstName:{type:String,required:!0},lastName:{type:String,required:!0},street:{type:String,required:!0},city:{type:String,required:!0},postalCode:{type:String,required:!0},country:{type:String,required:!0},phone:String},billingAddress:{firstName:{type:String,required:!0},lastName:{type:String,required:!0},street:{type:String,required:!0},city:{type:String,required:!0},postalCode:{type:String,required:!0},country:{type:String,required:!0}},payment:{method:{type:String,enum:["stripe","ideal","paypal","card"],required:!0},status:{type:String,enum:["pending","paid","failed","refunded"],default:"pending"},transactionId:String,amount:{type:Number,required:!0}},status:{type:String,enum:["pending","paid","confirmed","processing","shipped","delivered","cancelled"],default:"pending"},shipping:{method:{type:String,required:!0},cost:{type:Number,required:!0},trackingNumber:String,estimatedDelivery:Date,actualDelivery:Date},totals:{subtotal:{type:Number,required:!0},shipping:{type:Number,required:!0},tax:{type:Number,required:!0},total:{type:Number,required:!0}},notes:String,dropshipStatus:{type:String,enum:["pending","forwarded","shipped","completed","failed"],default:"pending"},dropshipInstructions:String,dropshipCost:Number,profit:Number,profitMargin:Number,trackingEvents:[{status:String,message:String,timestamp:{type:Date,default:Date.now}}]},{timestamps:!0});s.pre("save",async function(e){if(!this.orderNumber){let e=await n().model("Order").countDocuments();this.orderNumber=`ORD-${Date.now()}-${String(e+1).padStart(4,"0")}`}e()}),s.methods.updateStatus=function(e,t){return this.status=e,this.trackingEvents.push({status:e,message:t||`Status gewijzigd naar ${e}`,timestamp:new Date}),this.save()},s.virtual("totalItems").get(function(){return this.items.reduce((e,t)=>e+t.quantity,0)});let a=n().models.Order||n().model("Order",s)},6955:(e,t,i)=>{i.d(t,{Z:()=>a});var r=i(1185),n=i.n(r);let s=new(n()).Schema({email:{type:String,required:!0,unique:!0,lowercase:!0,trim:!0},password:{type:String,required:function(){return"admin"===this.role},minlength:6},firstName:{type:String,required:!0,trim:!0},lastName:{type:String,required:!0,trim:!0},phone:{type:String,trim:!0},address:{street:String,city:String,postalCode:String,country:{type:String,default:"Netherlands"}},role:{type:String,enum:["customer","admin"],default:"customer"},isActive:{type:Boolean,default:!0},emailVerified:{type:Boolean,default:!1},emailVerificationToken:String,passwordResetToken:String,passwordResetExpires:Date,preferences:{newsletter:{type:Boolean,default:!0},notifications:{type:Boolean,default:!0}},lastLogin:Date,loginAttempts:{type:Number,default:0},lockUntil:Date},{timestamps:!0});s.virtual("fullName").get(function(){return`${this.firstName} ${this.lastName}`}),s.virtual("isLocked").get(function(){return!!(this.lockUntil&&this.lockUntil>Date.now())}),s.methods.incLoginAttempts=function(){if(this.lockUntil&&this.lockUntil<Date.now())return this.updateOne({$unset:{lockUntil:1},$set:{loginAttempts:1}});let e={$inc:{loginAttempts:1}};return this.loginAttempts+1>=5&&!this.isLocked&&(e.$set={lockUntil:Date.now()+72e5}),this.updateOne(e)},s.methods.resetLoginAttempts=function(){return this.updateOne({$unset:{loginAttempts:1,lockUntil:1}})};let a=n().models.User||n().model("User",s)},7153:(e,t)=>{var i;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return i}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(i||(i={}))},1802:(e,t,i)=>{e.exports=i(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var i=t(t.s=3110);module.exports=i})();