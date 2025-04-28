//cart.jsx
import styles from "./Cart.module.css";
import { useState } from "react";
import { useCart } from '../../Context/AppContext';
import { IoTrashOutline } from "react-icons/io5";
import { FaCaretRight,FaCaretLeft  } from "react-icons/fa";
export default function Cart () {
    const {cartItems,removeFromCart,increaseQuantity, decreaseQuantity} = useCart()

    const subtotal = cartItems.reduce((acc, item) => acc + item.preco * item.quantity, 0);
    return (
        <main className={styles.cartPage}>
            {cartItems.length === 0 ? (
                <div className={styles.DivisionemptyText}>
                    <p className={styles.emptyText}>Seu carrinho está vazio.</p>
                </div>
            ) :(
                <>
            <table className={styles.cartTable}>
                <thead>
                    <th></th>
                    <th className={styles.TitleTable}>Produto</th>
                    <th className={styles.TitleTable}>Quantidade</th>
                    <th className={styles.TitleTable}>Preço</th>
                    <th></th>
                </thead>
                <tbody>
                {cartItems.map((item)=>(
                    <tr key={item.id} className={styles.produtCell}>
                        <td><img src={item.image} alt={item.nome} className={styles.productImage}/>
                        </td>
                        <td>{item.nome}</td>
                        <td>
                            <div className={styles.quantityControl}>
                                    <FaCaretLeft
                                        onClick={() => decreaseQuantity(item.id)}
                                        className={styles.quantityIcon}
                                    />
                                
                                <span>{item.quantity}</span>
                                <FaCaretRight 
                                    onClick={() => increaseQuantity(item.id)} 
                                    className={styles.quantityIcon}
                                />
                            </div>
                        </td>
                        <td>R$ {(item.preco * item.quantity).toFixed(2)}</td>
                        <td><IoTrashOutline onClick={()=>removeFromCart(item.id)} className={styles.removeProductIcon}/></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className={styles.orderDescription}>
                <h2>Resumo do Pedido</h2>
                <div>
                    <h2>Subtotal: R$ {subtotal.toFixed(2)}</h2>
                </div>
            </div>
            </>
            )}
        </main>
        
    ) 
}