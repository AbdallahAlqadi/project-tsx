import React, { useReducer, useState } from "react";
import '../style/home.css';
import Button from '@mui/material/Button';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Modal, Box } from '@mui/material';
import salat_home from '../img/salat_home.png';
import about from '../img/about.jpg';
import plate1 from '../img/plate1.png';
import plate2 from '../img/plate2.png';
import plate3 from '../img/plate3.png';
import plate4 from '../img/plate4.jpg';
import plate5 from '../img/plate5.jpg';
import plate6 from '../img/plate6.jpg';
import z1 from '../img/z1.jpeg';
import z2 from '../img/z2.jpeg';
import z3 from '../img/z3.jpeg';
import z4 from '../img/z4.jpeg';
import z5 from '../img/z5.jpeg';
import z8 from '../img/z8.jpeg';

interface Item {
  name: string;
  price: string;
  quantity?: number;
}

interface Order {
  orderNumber: number;
  orderTime: string;
  items: Item[];
  totalAmount: number;
}

type ActionType = 
  | { type: 'ADD_TO_CART'; payload: Item }
  | { type: 'REMOVE_FROM_CART'; payload: number }
  | { type: 'CLEAR_CART' };

const initialState: Item[] = [];

const CartItem: React.FC<{ item: Item; onRemove: () => void; onQuantityChange: (quantity: number) => void }> = ({ item, onRemove, onQuantityChange }) => {
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuantity = parseInt(e.target.value, 10);
      if (newQuantity >= 0) {
        onQuantityChange(newQuantity);
      }
    };
  
    return (
      <div>
        <span>{item.name} - {item.price} - Quantity: </span>
        <input 
          type="number" 
          value={item.quantity || 1} 
          onChange={handleQuantityChange} 
          min="1"
        />
        <Button onClick={onRemove} style={{ color: 'red' }}>Remove</Button>
      </div>
    );
  };

function reducer(state: Item[], action: ActionType): Item[] {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.findIndex(item => item.name === action.payload.name);
      if (existingItemIndex > -1) {
        return state.map((item, index) => 
          index === existingItemIndex ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    case 'REMOVE_FROM_CART':
      return state.filter((_, index) => index !== action.payload);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

const Home: React.FC = () => {
  const cardsRef = React.useRef<HTMLDivElement>(null);
  const scrollToCards = () => {
    if (cardsRef.current) {
      cardsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [cart, dispatch] = useReducer(reducer, initialState);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderCount, setOrderCount] = useState(0);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const addToCart = (item: Item) => {
    dispatch({ type: 'ADD_TO_CART', payload: item });
  };

  const placeOrder = () => {
    if (cart.length === 0) return;

    const orderNumber = orderCount + 1;
    const currentTime = new Date().toLocaleString();

    const aggregatedOrder: Order = {
      orderNumber,
      orderTime: currentTime,
      items: [...cart],
      totalAmount: cart.reduce((total, item) => total + parseFloat(item.price.replace('JD', '')) * (item.quantity ?? 1), 0)
    };

    setOrders(prevOrders => [...prevOrders, aggregatedOrder]);
    setOrderCount(orderNumber);
    dispatch({ type: 'CLEAR_CART' });
    setIsCartModalOpen(false); // Close the modal after placing the order
  };

  const toggleCartModal = () => {
    setIsCartModalOpen(!isCartModalOpen);
  };

  const cartModalStyle = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="body">
      {/* Grid and Sections */}
      <div className="grid1">
        <div className="secssion1">
          <h1 id='text1'>Tasty food <br /> and healthy.</h1>
          <h1 id='text2'>Try the best <br />food of the week.</h1>
          <Button onClick={scrollToCards} style={{ backgroundColor: '#26cc00', borderRadius: '18px', fontSize: 'large', marginLeft: '540px' }} variant="contained" className='button1'>View Menu</Button>
        </div>
        <div className="secssion2">
          <img id='imgsec2' src={salat_home} alt="Salad" />
        </div>
      </div>

      <div className="grid2">
        <div className="secssion3">
          <img id='img3' src={about} alt="About Us" />
        </div>
        <div className="secssion4">
          <h1 id='text3'>About us</h1>
          <h1 id='text4'>We cook the best <br />tasty food</h1>
          <h3 id='text5'>We cook the best food in the entire city, with excellent<br /> customer service, the best meals and at<br /> the best price, visit us.</h3>
        </div>
      </div>

      <h1 id='text6'>Special</h1>
      <h1 id='text7'>Menu of the week for foods.</h1>

      <div ref={cardsRef} className='cards'>
        {/* Food Items */}
        {[
          { id: 'plate1', name: 'Barbecue salad', price: '3.00JD', src: plate1 },
          { id: 'plate2', name: 'Salad with fish', price: '2.00JD', src: plate2 },
          { id: 'plate3', name: 'Spinach salad', price: '2.50JD', src: plate3 },
          { id: 'plate4', name: 'Salmon salad', price: '5.00JD', src: plate4 },
          { id: 'plate5', name: 'Pasta', price: '3.00JD', src: plate5 },
          { id: 'plate6', name: 'Grilled chicken', price: '4.00JD', src: plate6 },
          { id: 'plate6', name: 'Grilled chicken', price: '4.00JD', src: plate6 },
          { id: 'plate6', name: 'Grilled chicken', price: '4.00JD', src: plate6 }
        ].map((item, index) => (
          <div id='card' key={index}>
            <img id='imgcard' src={item.src} alt={item.name} />
            <h2 id='textcard1'>{item.name}</h2>
            <h4 id='textcard2'>{item.price}</h4>
            <Button variant="contained" style={{ color: 'green', backgroundColor: 'white', border: '1px solid green', width: '250px', marginLeft: '25px' }} onClick={() => addToCart({ name: item.name, price: item.price })}>ADD TO ORDER</Button>
          </div>
        ))}
      </div>

      <h1 id='text6'>Special</h1>
      <h1 id='text7'>Menu of the week for juices.</h1>

      <div className='cards'>
        {/* Juice Items */}
        {[
          { id: 'z1', name: 'Strawberry Juice', price: '1.50JD', src: z1 },
          { id: 'z2', name: 'Orange Juice', price: '1.75JD', src: z2 },
          { id: 'z3', name: 'Mango Juice', price: '1.50JD', src: z3 },
          { id: 'z4', name: 'Pineapple Juice', price: '5.00JD', src: z4 },
          { id: 'z5', name: 'Lemon Juice', price: '1.75JD', src: z5 },
          { id: 'z8', name: 'Cocktail Juice', price: '2.75JD', src: z8 },
          { id: 'z8', name: 'Cocktail Juice', price: '2.75JD', src: z8 },
          { id: 'z8', name: 'Cocktail Juice', price: '2.75JD', src: z8 }
        ].map((item, index) => (
          <div id='card' key={index}>
            <img id='imgcard2' src={item.src} alt={item.name} />
            <h2 id='textcard1'>{item.name}</h2>
            <h4 id='textcard2'>{item.price}</h4>
            <Button variant="contained" style={{ color: 'green', backgroundColor: 'white', border: '1px solid green', width: '250px', marginLeft: '25px' }} onClick={() => addToCart({ name: item.name, price: item.price })}>ADD TO ORDER</Button>
          </div>
        ))}
      </div>

      {/* Modal for Shopping Cart */}
      <Modal
        open={isCartModalOpen}
        onClose={toggleCartModal}
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
      >
        <Box sx={cartModalStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 id="cart-modal-title">Shopping Cart</h2>
            <Button 
              onClick={toggleCartModal} 
              style={{ color: 'red' }} 
              variant="text"
            >
              Close
            </Button>
          </div>
          <div id="cart-modal-description">
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cart.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  onRemove={() => dispatch({ type: 'REMOVE_FROM_CART', payload: index })}
                  onQuantityChange={(quantity) => dispatch({ type: 'ADD_TO_CART', payload: { ...item, quantity } })}
                />
              ))
            )}
            <Button
              onClick={() => {
                placeOrder();
                toggleCartModal(); // Close the modal after placing the order
              }}
              style={{ backgroundColor: '#26cc00', borderRadius: '18px', fontSize: 'large' }}
              variant="contained"
            >
              Place Order
            </Button>
          </div>
        </Box>
      </Modal>

      <Button onClick={toggleCartModal} style={{ backgroundColor: '#26cc00', borderRadius: '18px', fontSize: 'large', position: 'fixed', bottom: '20px', right: '20px' }} variant="contained" startIcon={<LocalMallIcon />}>
        View Cart
      </Button>

      {/* Order History */}
      <h2>Order History</h2>
      <table id="order-history-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Order Time</th>
            <th>Items</th>
            <th>Total Amount (JD)</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={4}>No orders placed yet.</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.orderNumber}>
                <td>{order.orderNumber}</td>
                <td>{order.orderTime}</td>
                <td>
                  <ul>
                    {order.items.map((item, index) => (
                      <li key={index}>{item.name} - {item.price} - Quantity: {item.quantity}</li>
                    ))}
                  </ul>
                </td>
                <td>{order.totalAmount.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Home;
