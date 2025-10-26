import connectDB from '../../../lib/mongodb';
import Order from '../../../models/Order';
import Product from '../../../models/Product';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Haal statistieken op
    const [
      totalOrders,
      totalRevenue,
      totalProducts,
      totalUsers,
      recentOrders,
      topProducts
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Product.countDocuments(),
      User.countDocuments(),
      Order.find()
        .populate('products.product')
        .sort({ createdAt: -1 })
        .limit(5),
      Order.aggregate([
        { $unwind: '$products' },
        { 
          $group: { 
            _id: '$products.product', 
            totalSold: { $sum: '$products.quantity' },
            totalRevenue: { $sum: '$products.total' }
          } 
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' }
      ])
    ]);

    // Bereken maandelijkse groei
    const currentMonth = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const [currentMonthOrders, lastMonthOrders] = await Promise.all([
      Order.countDocuments({
        createdAt: { $gte: currentMonth }
      }),
      Order.countDocuments({
        createdAt: { 
          $gte: lastMonth, 
          $lt: currentMonth 
        }
      })
    ]);

    const orderGrowth = lastMonthOrders > 0 
      ? ((currentMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 
      : 0;

    res.status(200).json({
      success: true,
      analytics: {
        overview: {
          totalOrders,
          totalRevenue: totalRevenue[0]?.total || 0,
          totalProducts,
          totalUsers,
          orderGrowth: Math.round(orderGrowth)
        },
        recentOrders,
        topProducts
      }
    });

  } catch (error) {
    console.error('Fout bij ophalen analytics:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Fout bij ophalen analytics',
      error: error.message 
    });
  }
}
