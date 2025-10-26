import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    
    const { orderId } = req.body;
    
    // Haal order op
    const order = await Order.findById(orderId).populate('products.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verwerk elke product in de order
    const dropshipResults = [];
    
    for (const item of order.products) {
      const product = item.product;
      
      // Controleer of product een echte leverancier heeft
      if (product.supplier && product.supplier.aliExpressUrl) {
        // Hier zou je normaal gesproken een API call maken naar AliExpress
        // Voor nu simuleren we dit
        const dropshipResult = {
          productId: product._id,
          productName: product.name,
          quantity: item.quantity,
          supplier: product.supplier.name,
          aliExpressUrl: product.supplier.aliExpressUrl,
          status: 'pending_manual_order',
          instructions: `Bestel ${item.quantity}x ${product.name} van ${product.supplier.name}`
        };
        
        dropshipResults.push(dropshipResult);
        
        // Update order status
        order.status = 'processing';
        order.dropshipStatus = 'pending_manual_orders';
        await order.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Dropship orders processed',
      dropshipResults,
      instructions: 'Bestel de producten handmatig van de leveranciers en update de order status'
    });

  } catch (error) {
    console.error('Error processing dropship orders:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing dropship orders',
      error: error.message 
    });
  }
}
