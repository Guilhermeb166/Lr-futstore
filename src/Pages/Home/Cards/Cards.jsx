//cards.jsx
import styles from './Cards.module.css'
import { FaCartPlus } from "react-icons/fa";
import { useCart } from '../../../Context/AppContext';

export default function Cards({ camisas = [] }){
    const {addToCart} = useCart()

    
    return(
        <section className={styles.lancamentosContainer}>
                <div className={styles.cardsLancamentos}>
                    {camisas.map((camisa)=>(
                        <div key={camisa.id} className={styles.card}>
                            <img src={camisa.image} alt={camisa.nome} draggable={false}/>
                            <FaCartPlus className={styles.addCartIcon} onClick={() => addToCart(camisa)}/>
                            <div>
                                <h3 className={styles.cardName}>{camisa.nome}</h3>
                                <p className={styles.cardPrice}>R$ {Number(camisa.preco).toFixed(2)}</p>
                            </div>

                        </div>
                    ))}
                    
                </div>
            </section>
    )
}