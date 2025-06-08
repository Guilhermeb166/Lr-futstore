//sideCart.jsx
import { IoClose, IoTrashOutline } from 'react-icons/io5';
import styles from './Cart.module.css'

import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/AppContext';
import { FaShoppingCart } from "react-icons/fa";
export default function SideCard({ isOpen, onClose }) {
    const navigation = useNavigate()
    const { cartItems, removeFromCart } = useCart();

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * Number(item.preco), 0);

    const navigateCartPage = () => {
        navigation('/cart')

    }

    return (
        <aside className={`${styles.sideCart} ${isOpen ? styles.open : ''}`}>
            <IoClose className={styles.closeIcon} onClick={onClose} />
            {cartItems.length === 0 ? (
                <p className={styles.emptyText}>Seu carrinho está vazio.</p>
            ) : (
                <div>
                    <h2>Produtos</h2>

                    <ul className={styles.cartList}>
                        {cartItems.map((item) => (
                            <li key={item.id} className={styles.cartItem}>
                                <img src={item.image} alt={item.nome} className={styles.itemImage} onClick={() => navigation(`/individualProduct/${item.id}`)}/>
                                <div>
                                    <p  onClick={() => navigation(`/individualProduct/${item.id}`)} className={styles.itemName}>{item.nome}</p>
                                    <p>R$ {Number(item.preco).toFixed(2)}</p>
                                    <p>Quantidade: {item.quantity}</p>
                                </div>
                                <IoTrashOutline
                                    className={styles.removeIcon}
                                    onClick={() => removeFromCart(item.id)}
                                />
                            </li>
                        ))}
                    </ul>

                    <h3>Subtotal: R$ {subtotal.toFixed(2)}</h3>
                </div>)}
            <div className={styles.DivisionButton} >
                <button className={styles.ButtonCart} onClick={() => {
                    onClose(); // Fecha o SideCart
                    navigateCartPage(); // Navega para a página de carrinho
                }}>Carrinho <FaShoppingCart className={styles.IconButtonCart} />
                </button>

            </div>
        </aside>
    )
}